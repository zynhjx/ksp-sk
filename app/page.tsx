import Image from "next/image";
import React from "react";
import Link from "next/link";
import {ChevronRight, UserRound, Zap, BadgeCheck} from "lucide-react";
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
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 my-6">Why Join us?</h2>
                        <div className="w-20 h-1.5 bg-theme-blue rounded-full mb-6"></div>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            Being registered means you&apos;re counted, heard, and connected to programs that directly benefit you and your community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
                            title="Your Own Digital Profile"
                            description="Create and manage your personal youth profile that officially represents you in your barangay's records — all in one place."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                            title="Access Programs & Opportunities"
                            description="Stay updated on livelihood, scholarship, sports, and community programs available for the youth in your area."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                            title="Safe & Private"
                            description="Your personal information is protected with secure access. Only you and authorized officials can view your data."
                        />
                        {/* <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                            title="Automated Reporting"
                            description="Generate reports with a single click, saving hours of manual paperwork."
                        /> */}
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                            title="Be Heard by Your Leaders"
                            description="Share feedback on programs and initiatives directly with your SK officials so decisions are made with you in mind."
                        />
                        {/* <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
                            title="Rapid Deployment"
                            description="Get your barangay set up and running in less than 30 minutes with our easy onboarding."
                        /> */}
                    </div>

                    {/* <div className="grid md:grid-cols-2 gap-8">
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
                            title="Your Own Digital Profile"
                            description="Create and manage your personal youth profile that represents you in your barangay's records — all in one place."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                            title="Access Programs & Opportunities"
                            description="Stay updated on livelihood, scholarship, sports, and community programs available for the youth in your area."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                            title="Be Heard by Your Leaders"
                            description="Share feedback on programs and initiatives directly with your SK officials so decisions are made with you in mind."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                            title="Safe & Private"
                            description="Your personal information is protected with enterprise-level security. Only authorized officials can access your data."
                        />
                    </div> */}
                </Section>

                {/* How It Works Section */}
                <Section id="how-it-works" className="bg-gray-50/50">
                    <div className="flex flex-col items-center mb-14 text-center">
                        <span className="text-sm font-semibold uppercase tracking-widest text-theme-blue">How It Works</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
                            Joining is <span className="text-theme-blue">Simple</span>
                        </h2>
                        <div className="w-16 h-1.5 bg-theme-blue rounded-full"></div>
                    </div>

                    <div className="relative flex flex-col md:flex-row items-stretch gap-6 md:gap-0">

                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-7.5 left-[calc(16.67%)] right-[calc(16.67%)] h-px border-t-2 border-dashed border-blue-200 z-0" />

                        {/* Step 1 */}
                        <div className="flex-1 flex flex-col items-center text-center px-6 relative z-10">
                            <div className="w-15 h-15 rounded-2xl bg-theme-blue text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
                                <UserRound className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-theme-blue mb-2">Step 01</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Sign up and fill in your basic info. It only takes a few minutes and no documents needed to get started.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex-1 flex flex-col items-center text-center px-6 relative z-10">
                            <div className="w-15 h-15 rounded-2xl bg-theme-white border-2 border-blue-100 text-theme-blue flex items-center justify-center mb-6 shadow-sm">
                                <BadgeCheck className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-theme-blue mb-2">Step 02</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Get Officially Registered</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Your profile gets recorded in your barangay&apos;s youth database, making you officially recognized by your SK.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex-1 flex flex-col items-center text-center px-6 relative z-10">
                            <div className="w-15 h-15 rounded-2xl bg-theme-white border-2 border-blue-100 text-theme-blue flex items-center justify-center mb-6 shadow-sm">
                                <Zap className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-theme-blue mb-2">Step 03</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Access Opportunities</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Unlock eligibility for livelihood programs, events, and more — all tailored for the youth in your community.
                            </p>
                        </div>

                    </div>
                </Section>

                <Section id="about" className="bg-gray-50/50">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-widest text-theme-blue">About the Platform</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
                                A Platform Made <span className="text-theme-blue">For You</span>
                            </h2>
                            <div className="w-16 h-1.5 bg-theme-blue rounded-full mx-auto mb-6"></div>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            This is your space as a young member of the community. Register once, and you&apos;re officially part of your barangay&apos;s youth records — making you eligible for programs and opportunities meant for you.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            No paperwork, no long lines. Just a simple profile that represents you and keeps you connected to what&apos;s happening in your community.
                        </p>
                    </div>
                </Section>

                {/* CTA Section */}
                <Section className="bg-theme-blue text-white overflow-hidden relative mt-16">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-theme-white/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"></div>

                    <div className="flex flex-col items-center text-center relative z-10 py-10">
                        <h2 className="text-3xl md:text-5xl  mb-8 font-bold max-w-3xl leading-tight">Be seen. Be heard. Be part of your community.</h2>
                        <p className="text-xl text-blue-100 mb-12 max-w-2xl">
                            Your voice matters. Take part in programs, share your ideas, and help build a better barangay.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/auth/register" className="px-10 py-5 rounded-2xl bg-theme-white text-theme-blue font-bold text-xl hover:shadow-2xl hover:bg-blue-50 transition cursor-pointer text-center">
                                Get Started for Free
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