import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-6 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-xs font-medium tracking-wide text-gray-500">
          &copy; {new Date().getFullYear()} Kabataan Statistical Profile. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-gray-600 md:justify-end">
          <Link href="/terms" className="transition hover:text-theme-dark-blue">
            Terms
          </Link>
          <Link href="/privacy-policy" className="transition hover:text-theme-dark-blue">
            Privacy Policy
          </Link>
          <a href="mailto:support@kabataanprofile.com" className="transition hover:text-theme-dark-blue">
            Contact Us: support@kabataanprofile.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
