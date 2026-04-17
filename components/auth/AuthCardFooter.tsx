import Link from "next/link";

const AuthCardFooter = ({type}: {type: "register" | "login"}) => {
  return (
    <div className=" text-center border-t border-gray-100 pt-4">
      {type === "login" ? (
        <p className="text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-theme-blue font-bold hover:underline"
          >
            Register Now
          </Link>
        </p>
      ) : (
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-theme-blue font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      )}
    </div>
  )
}
export default AuthCardFooter
