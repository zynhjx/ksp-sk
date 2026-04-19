'use client'

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const privateRoutePrefixes = [
  "/dashboard",
  "/programs",
  "/suggestions",
  "/announcements",
  "/profile",
  "/youth-profiles",
  "/onboarding",
];

const PublicFooter = () => {
  const pathname = usePathname();

  const shouldHideFooter = privateRoutePrefixes.some((prefix) => pathname.startsWith(prefix));

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
};

export default PublicFooter;