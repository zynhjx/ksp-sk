import {ReactNode} from 'react'

const AuthLayout = ({children}: {children: ReactNode}) => {

  return (
    <div className="min-h-screen bg-theme-white md:bg-gray-50 flex flex-col items-center md:justify-center md:p-6 pb-24 text-gray-900">
      <div className="w-full mt-8 md:mt-0 max-w-full md:max-w-md bg-theme-white md:rounded-3xl md:shadow-xl md:shadow-theme-blue/40 md:border border-theme-blue/20 overflow-hidden p-8 md:p-12">
        {children}
      </div>
    </div>
  )
}
export default AuthLayout
