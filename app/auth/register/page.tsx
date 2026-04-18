
'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import AuthCardTitle from "@/components/auth/CardTitle";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import FormInput from "@/components/auth/form/FormInput";
import Button from '@/components/Button';
import { toast } from 'sonner';
import { motion } from "framer-motion"
import { redirect, useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"


// type RegisterPageProps = {
//     fetchedEmail?: string
// }

type StepOneProps = {
  email: string;
  setEmail: (v: string) => void;
  agreed: boolean
  setAgreed: (v: boolean) => void
  isFormValid: boolean;
  sending: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const StepOne = ({handleSubmit, email, agreed, setAgreed, setEmail, isFormValid, sending}: StepOneProps) => {
    return (
      <motion.form 
        initial={{x: 10, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x:-10, opacity: 0}}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit} className='space-y-4'>
        <AuthCardTitle title={"Sign Up as SK Official"} />

        <FormInput
          value={email}
          name={"email"}
          onChange={(e) => (setEmail(e.target.value))}
          type={"email"}
          placeholder={"john@example.com"}
          label={"Email Address"} />

        <Button
          type="submit"
          primary
          disabled={!isFormValid || sending}
        >
          {sending ? "Sending OTP..." : "Continue"}
        </Button>

        {/* <div className="mt-5 px-2 text-sm text-gray-600 text-center leading-relaxed">
          By continuing, you agree to our{" "}
          <Link href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline text-theme-blue">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:underline text-theme-blue">
            Privacy Policy
          </Link>.
        </div> */}

        <FieldGroup className="px-2">
          <Field orientation="horizontal">
            <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" checked={agreed} onCheckedChange={setAgreed}
              className='
              data-[state=checked]:bg-theme-blue
              data-[state=checked]:border-theme-blue
              data-[state=checked]:text-white
              hover:cursor-pointer
              '
            />
            <FieldLabel htmlFor="terms-checkbox-basic" className='text-sm text-gray-600 gap-0'>
              <div className="text-sm text-gray-600 text-center leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline text-theme-blue">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:underline text-theme-blue">
                  Privacy Policy
                </Link>.
              </div>
            </FieldLabel>
          </Field>
        </FieldGroup>
        <AuthCardFooter type='register'/>

      </motion.form>
    )
  }


  type StepTwoProps = {
    email: string;
    otp: string;
    setOtp: (v: string) => void;
    invalid: boolean;
    setInvalid: (v: boolean) => void;
    success: boolean;
    isFormValid: boolean;
    countdown: number;
    pendingResend: boolean;
    handleVerify: (e: React.FormEvent<HTMLFormElement>) => void;
    handleResend: () => void;
  }

  const StepTwo = ({handleVerify, otp, setOtp, setInvalid, email, invalid, success, isFormValid, handleResend, countdown, pendingResend}: StepTwoProps) => {
    return (
      <motion.form
        initial={{x: 10, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x:-10, opacity: 0}}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onSubmit={handleVerify} className='space-y-4'>
        <AuthCardTitle title={"Check your inbox"} className="mb-3"/>

        <p className="text-sm text-gray-700 text-center mb-4">
          An OTP has been sent to <span className="font-medium text-theme-blue">{email}</span>. Please check your inbox and enter it below.
        </p>

        <FormInput
          value={otp}
          name={"otp"}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            setInvalid(false)
          }}
          inputMode="numeric"
          type={"text"}
          maxLength={6}
          placeholder='012345'
          label={"One Time Password (OTP)"}
          error={invalid}
          success={success}
        />

        <Button
          primary
          type="submit"
          disabled={!isFormValid || success}
          className={
            success ? "bg-green-600 text-white border-green-600" : ""
          }
        >
          {success ? "Verified" : "Verify"}
        </Button>

        
        <p className="text-sm text-gray-700 text-center">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || pendingResend || success}
            className="font-medium text-theme-blue hover:underline hover:cursor-pointer disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
          </button>
        </p>
      </motion.form>
    )
  }

const RegisterPage = () => {
  const [email, setEmail] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [sending, setSending] = useState(false)
  const [step, setStep] = useState(1)
  const [countdown, setCountdown] = useState(0)
	const [otp, setOtp] = useState("")
	const [invalid, setInvalid] = useState(false)
	const [success, setSuccess] = useState(false)
	const [pendingResend, setPendingResend] = useState(false)
  // const roleRedirectMap: Record<string, string> = {
  //   admin: "/admin/dashboard",
  //   sk: "/admin/dashboard",
  //   youth: "/youth/home", // or "/"
  // };

  const router = useRouter()

  useEffect(() => {
		if (countdown <= 0) return;

		const interval = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval); // cleanup
	}, [countdown]);

  const handleResend = async () => {
		setPendingResend(true)
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/register/email/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-type": "sk",
        },
        body: JSON.stringify({ email }),
      }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData?.message || "Something went wrong.", { position: "top-center"});
        return; 
      }

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.info(data.message)
      }

      setCountdown(data.otpCooldown)
		} catch (error) {
			console.error("Error resending OTP:", error);
		} finally {
			setPendingResend(false)
		}
	};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/email`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-app-type": "sk",
        },
        body: JSON.stringify({ email }),
      });


      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData?.message || "Something went wrong.", { position: "top-center"});
        return; 
      }

      const data = await res.json()

      if (data.success) {
        toast.success(data.message, {position: "top-center"})
      } else {
        toast.info(data.message, {position: "top-center"})
      }

      setCountdown(data.otpCooldown)
      
      setStep(2)

    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/email/verify`, {
				method: "POST",
        credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"x-app-type": "sk",
				},
				body: JSON.stringify({ otp, email })
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.message, { position: "top-center"})
        setInvalid(true)
				return
			}

			setSuccess(true)
			toast.success(data.message, {position: "top-center"})
      return router.replace("/onboarding");

		} catch (error) {
			console.error("Error: ", error);
			toast.error("Something went wrong")
		}
	}


  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    if (step === 1) {
      return email.trim() !== "" && isValidEmail(email) && agreed;
    }

    if (step === 2) {
      return otp.trim() !== "" && otp.length === 6;
    }

    // Default for any other step
    return false;
  }

  

  switch (step) {
    case 1:
      return (
        <StepOne
          email={email}
          setEmail={setEmail}
          isFormValid={isFormValid()}
          sending={sending}
          handleSubmit={handleSubmit}
          agreed={agreed}
          setAgreed={setAgreed}
        />
      )

    case 2:
      return (
        <StepTwo
          email={email}
          otp={otp}
          setOtp={setOtp}
          invalid={invalid}
          setInvalid={setInvalid}
          success={success}
          isFormValid={isFormValid()}
          countdown={countdown}
          pendingResend={pendingResend}
          handleVerify={handleVerify}
          handleResend={handleResend}
        />
      )
  }

}
export default RegisterPage
