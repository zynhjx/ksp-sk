'use client'

import { motion } from "framer-motion"
import CardTitle from "@/components/auth/CardTitle"
import FormInput from "@/components/auth/form/FormInput"
import { useState } from "react"
import Button from "@/components/Button"
import AuthCardFooter from "@/components/auth/AuthCardFooter"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const apiUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sending, setSending] = useState(false)
  const router = useRouter()

  const isFormValid = email.trim() !== "" && password.trim() !== "" && password.length >= 8

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    try {
      const result = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
					"Content-Type": "application/json",
					"x-app-type": "sk",
				},
				body: JSON.stringify({ email, password })
      })

      const data = await result.json()
      
      if (!result.ok) {
        return toast.error(data.message, {position: "top-center"})
      }

      toast.success(data.message, { position: "top-center"})
      return router.push("/dashboard")
      
    } catch (err) {
      console.log(err)
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.form 
        initial={{x: 10, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x:-10, opacity: 0}}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit} className='space-y-4'>
        <CardTitle title={"Welcome back"} />

        <FormInput
          value={email}
          name={"email"}
          onChange={(e) => (setEmail(e.target.value))}
          type={"email"}
          placeholder={"john@example.com"}
          label={"Email Address"} />

        <FormInput
          value={password}
          name={"password"}
          onChange={(e) => (setPassword(e.target.value))}
          type={"password"}
          placeholder={"Password"}
          label={"Password"} />

        <Button
          type="submit"
          primary
          disabled={!isFormValid || sending}
        >
          {sending ? "Verifying..." : "Sign in"}
        </Button>
       
        <AuthCardFooter type='login'/>

      </motion.form>
  )
}

export default LoginPage