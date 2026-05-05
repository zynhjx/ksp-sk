import Image from "next/image";
import React from "react";
import Link from "next/link";
import {ChevronRight, Mail, KeyRound, ClipboardList, Clock, Users, Megaphone, MessageSquareText, LayoutDashboard} from "lucide-react";
import PublicFooter from "@/components/PublicFooter";

const Section = ({ children, className, containerClassName, id } : { children: React.ReactNode, className?: string, containerClassName?: string, id?: string }) => {
    return (
        <section id={id} className={`py-16 md:py-24 px-6 flex justify-center items-center ${className || ""}`}>
            <div className={`w-full max-w-7xl ${containerClassName || ""}`}>
                {children}
            </div>
        </section>
    )
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
    return (
        <div className="p-8 rounded-2xl border border-gray-100 bg-theme-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-theme-blue group-hover:text-white transition-colors duration-300 text-theme-blue">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    )
}

const StatItem = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className="flex flex-col items-center text-center">
            <span className="text-4xl md:text-5xl  text-theme-blue mb-2">{value}</span>
            <span className="text-sm uppercase tracking-widest font-semibold text-gray-500">{label}</span>
        </div>
    )
}

const LandingPage = () => {

    return (
        <>
        <div className="min-h-screen bg-theme-white">
            <header className="sticky top-0 z-100 bg-theme-white border-b border-gray-100 flex items-center justify-center">
                <div className="relative flex items-center justify-between h-20 w-full max-w-7xl px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Image src="/LogoTextDark.svg" alt="logo" loading={"eager"} width={140} height={45} className="w-auto h-8 md:h-10" />
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#features" className="hover:text-theme-blue transition">Features</a>
                        <a href="#how-it-works" className="hover:text-theme-blue transition">How It Works</a>
                        <a href="#about" className="hover:text-theme-blue transition">About</a>
                    </nav>

                    {/* Right buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/auth/login" className="hidden sm:block px-5 py-2.5 rounded-xl bg-transparent text-gray-700 hover:bg-gray-100 transition cursor-pointer font-semibold text-sm">
                            Sign In
                        </Link>

                        <Link href="/auth/register" className="px-5 py-2.5 rounded-xl bg-theme-blue text-white cursor-pointer font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-blue-900/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <Section className="relative overflow-hidden pt-12 md:pt-40">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 opacity-10">
                      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
                      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400 rounded-full blur-[120px]"></div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-5xl md:text-7xl  tracking-tight font-bold text-gray-900 mb-8 max-w-4xl leading-[1.1]">
                      The Future of  <span className="text-theme-blue">Youth Data </span>Management.
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
                      The all-in-one platform for SK officials to register youth members, manage community programs, and make data-driven decisions for your barangay.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                      <Link
                        href="/auth/register"
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-theme-blue flex items-center justify-center text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-900/30 transition-all cursor-pointer text-center"
                      >
                        Register Now <ChevronRight className="ml-3" />
                      </Link>
                      <Link
                        href="/auth/login"
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-theme-white text-gray-700 border border-gray-200 font-bold text-lg hover:bg-gray-50 transition cursor-pointer text-center"
                      >
                        Sign In to Dashboard
                      </Link>
                    </div>
                  </div>
                </Section>

                {/* Impact/Stats Section */}
                {/* <Section id="impact" className="bg-gray-200/50 border-y border-gray-100">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                       <StatItem label="Registered Youth" value="12k+" />
                       <StatItem label="Barangays" value="48" />
                       <StatItem label="PYDP Projects" value="150+" />
                       <StatItem label="Satisfaction" value="99%" />
                   </div>
                </Section> */}

               

                {/* Features Section */}
                <Section id="features">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="text-sm font-semibold uppercase tracking-widest text-theme-blue">Features</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 my-6">Built for SK Officials</h2>
                        <div className="w-20 h-1.5 bg-theme-blue rounded-full mb-6"></div>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            Everything you need to manage youth data, run programs, and serve your barangay — all in one portal.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <FeatureCard
                            icon={<Users className="w-6 h-6" />}
                            title="Youth Data Management"
                            description="Register and manage youth profiles in your barangay. Keep records organized, searchable, and always up to date."
                        />
                        <FeatureCard
                            icon={<LayoutDashboard className="w-6 h-6" />}
                            title="Programs & Initiatives"
                            description="Create and track livelihood, sports, scholarship, and community programs tailored for the youth of your barangay."
                        />
                        <FeatureCard
                            icon={<Megaphone className="w-6 h-6" />}
                            title="Announcements"
                            description="Broadcast important updates, events, and notices to keep your community informed and engaged at all times."
                        />
                        <FeatureCard
                            icon={<MessageSquareText className="w-6 h-6" />}
                            title="Suggestions & Feedback"
                            description="Receive and review community suggestions to make informed, data-driven decisions for the youth of your barangay."
                        />
                    </div>
                </Section>

                {/* How It Works Section */}
                <Section id="how-it-works" className="bg-gray-50/50" containerClassName="max-w-screen-2xl">
                    <div className="flex flex-col items-center mb-14 text-center">
                        <span className="text-sm font-semibold uppercase tracking-widest text-theme-blue">How It Works</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
                            Getting started is <span className="text-theme-blue">Easy</span>
                        </h2>
                        <div className="w-16 h-1.5 bg-theme-blue rounded-full"></div>
                    </div>

                    <div className="relative flex flex-col md:flex-row items-stretch gap-6 md:gap-0">

                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-7.5 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-blue-200 z-0" />

                        {/* Step 1 */}
                        <div className="flex-1 flex flex-col items-center text-center px-4 relative z-10">
                            <div className="w-15 h-15 rounded-2xl bg-theme-blue text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
                                <Mail className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-theme-blue mb-2">Step 01</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Register with Email</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Enter your official email address and agree to the Terms of Use. A one-time password will be sent to your inbox.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex-1 flex flex-col items-center text-center px-4 relative z-10">
                            <div className="w-15 h-15 rounded-2xl bg-theme-white border-2 border-blue-100 text-theme-blue flex items-center justify-center mb-6 shadow-sm">
                                <KeyRound className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-theme-blue mb-2">Step 02</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Verify Your Email</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Enter the 6-digit OTP sent to your inbox to confirm your identity and proceed to the next step.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex-1 flex flex-col items-center text-center px-4 relative z-10">
                            <div className="w-15 h-15 rounded-2xl bg-theme-white border-2 border-blue-100 text-theme-blue flex items-center justify-center mb-6 shadow-sm">
                                <ClipboardList className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-theme-blue mb-2">Step 03</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Your Profile</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Fill in your name, barangay, and SK position, then set a secure password for your account.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="flex-1 flex flex-col items-center text-center px-4 relative z-10">
                            <div className="w-15 h-15 rounded-2xl bg-theme-white border-2 border-blue-100 text-theme-blue flex items-center justify-center mb-6 shadow-sm">
                                <Clock className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-theme-blue mb-2">Step 04</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Await Admin Approval</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Your account is reviewed by the system admin. Once approved, you can sign in and access the SK portal.
                            </p>
                        </div>

                    </div>
                </Section>

                <Section id="about" className="bg-gray-50/50">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-widest text-theme-blue">About the Platform</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
                                A Platform Made <span className="text-theme-blue">for SK</span>
                            </h2>
                            <div className="w-16 h-1.5 bg-theme-blue rounded-full mx-auto mb-6"></div>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            This portal is designed exclusively for Sangguniang Kabataan officials to efficiently manage youth data, coordinate programs, and serve their community — all from one place.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            No more manual records or scattered spreadsheets. Register as an SK official, get approved, and gain access to a complete suite of tools built for barangay youth governance.
                        </p>
                    </div>
                </Section>

                {/* CTA Section */}
                <Section className="bg-theme-blue text-white overflow-hidden relative mt-16">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-theme-white/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"></div>

                    <div className="flex flex-col items-center text-center relative z-10 py-10">
                        <h2 className="text-3xl md:text-5xl  mb-8 font-bold max-w-3xl leading-tight">Empower the youth. Strengthen your barangay.</h2>
                        <p className="text-xl text-blue-100 mb-12 max-w-2xl">
                            Register as an SK official and start managing youth profiles, programs, and announcements for your community today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/auth/register" className="px-10 py-5 rounded-2xl bg-theme-white text-theme-blue font-bold text-xl hover:shadow-2xl hover:bg-blue-50 transition cursor-pointer text-center">
                                Register as SK Official
                            </Link>
                        </div>
                    </div>
                </Section>
            </main>
        </div>
        <PublicFooter />
        </>
    );
};

export default LandingPage;