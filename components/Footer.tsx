import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      {/* <footer className="bg-white py-20 px-6 border-t border-gray-100 flex justify-center items-center">
        <div className="w-full max-w-7xl grid md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-1 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Image
                src="/dark-theme-logo.svg"
                alt="logo"
                width={120}
                height={40}
                className="mb-6 h-8 w-auto"
              />
            </div>
            <p className="text-gray-500 leading-relaxed text-sm">
              Empowering Sangguniang Kabataan officials with data-driven tools for better youth governance.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs text-center md:text-left">
              Platform
            </h4>
            <ul className="space-y-4 text-sm text-gray-600 font-medium text-center md:text-left">
              <li>
                <a href="#features" className="hover:text-(--theme-blue) transition">
                  Features
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-(--theme-blue) transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  Updates
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs text-center md:text-left">
              Resources
            </h4>
            <ul className="space-y-4 text-sm text-gray-600 font-medium text-center md:text-left">
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  PYDP Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  DILG Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs text-center md:text-left">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-600 font-medium text-center md:text-left">
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--theme-blue) transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer> */}
      <div className="py-8 bg-gray-50 text-center text-xs text-gray-400 font-medium tracking-wide uppercase border-t border-gray-100">
        &copy; {new Date().getFullYear()} Kabataan Statistical Profile. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
