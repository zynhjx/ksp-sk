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

  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>
    );
  }

  return <Footer />;
};

export default PublicFooter;