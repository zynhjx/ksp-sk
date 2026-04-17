
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


// type RegisterPageProps = {
//     fetchedEmail?: string
// }

type StepOneProps = {
  email: string;
  setEmail: (v: string) => void;
  isFormValid: boolean;
  sending: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const StepOne = ({handleSubmit, email, setEmail, isFormValid, sending}: StepOneProps) => {
    return (
      <motion.form 
        initial={{x: 10, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x:-10, opacity: 0}}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit} className='space-y-4'>
        <AuthCardTitle title={"Sign in to continue"} />

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

        <div className="mt-5 px-2 text-sm text-gray-600 text-center leading-relaxed">
          By continuing, you agree to our{" "}
          <Link href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline text-theme-blue">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:underline text-theme-blue">
            Privacy Policy
          </Link>.
        </div>        

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
  const [sending, setSending] = useState(false)
  const [step, setStep] = useState(1)
  const [countdown, setCountdown] = useState(0)
	const [otp, setOtp] = useState("")
	const [invalid, setInvalid] = useState(false)
	const [success, setSuccess] = useState(false)
	const [pendingResend, setPendingResend] = useState(false)
  const roleRedirectMap: Record<string, string> = {
    admin: "/admin/dashboard",
    sk: "/admin/dashboard",
    youth: "/youth/home", // or "/"
  };

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
        credentials: "include"
      }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData?.message || "Something went wrong.");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include"
      });


      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData?.message || "Something went wrong.", { position: "top-center" });
        return; 
      }

      const data = await res.json()

      if (data.success) {
        console.log(data)
        toast.success(data.message)
      } else {
        toast.info(data.message)
      }

      setCountdown(data.otpCooldown)
      
      setStep(2)

    } catch (err) {
      console.error("Error sending request:", err);
      toast.error("Error sending request", { position: "top-center"})
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
				},
				body: JSON.stringify({ otp })
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.message)
        setInvalid(true)
				return
			}

			setSuccess(true)
			toast.success(data.message)
      return router.replace("/home");

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
      return email.trim() !== "" && isValidEmail(email);
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
