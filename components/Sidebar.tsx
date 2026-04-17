'use client'

import {
  CircleUser,
  LogOutIcon,
  HomeIcon,
  LucideIcon,
  LucideLayoutDashboard,
  Calendar,
  LightbulbIcon,
  Sidebar as SidebarIcon,
  ChevronRight,
  Megaphone,
  ChevronUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from 'tailwind-merge';
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const toTitleCase = (str: string = "") => {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const youthNavs = [
  {name: "Home", icon: LucideLayoutDashboard, path: "/home"},
  {name: "Programs", icon: Calendar, path: "/programs"},
  {name: "Suggestions", icon: LightbulbIcon, path: "/suggestions"},
  {name: "Announcements", icon: Megaphone, path: "/announcements"}
]

const skNavs = [
  {name: "Dashboard", icon: LucideLayoutDashboard, path: "/dashboard"},
  {name: "Programs", icon: HomeIcon, path: "home"},
  {name: "Suggestions", icon: HomeIcon, path: "dwadaw"},
]

const adminNavs = [
  {name: "Dashboard", icon: LucideLayoutDashboard, path: "/dashboard"},
  {name: "Programs", icon: HomeIcon, path: "home"},
  {name: "Suggestions", icon: HomeIcon, path: "dwadaw"},
]


const Sidebar = ({ type } : { type: string }) => {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar()
  const { user, setUser } = useAuth()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 1280px)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1280px)");

    const listener = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const userNavs = () => {
    if (type === "admin") {
      return adminNavs
    } else if (type === "sk") {
      return skNavs
    } else {
      return youthNavs
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // include cookies if using session/cookie auth
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null); // clears auth context regardless of response
      router.push("/auth")
    }
    
  };

  return (
    <aside className={twMerge(
      "overflow-visible absolute top-0 bottom-0 left-0 xl:static bg-theme-white text-black box-border flex flex-col z-50 border-r border-gray-300",
      isOpen ? "w-70" : "w-auto",
      !isOpen && "max-w-18 -translate-x-full md:translate-x-0"
    )}>
      <header className={twMerge(
        "bg-transparent h-12.5 flex relative items-center p-3 box-content border-gray-300 border-b"
      )}>
        <div className={twMerge(
          "relative h-10 w-20",
          !isOpen && "hidden"
        )}>
          <Image
            src={"/LogoTextDark.svg"}
            alt={"logo"}
            fill
            loading="eager"
            style={{ objectFit: "contain" }}
            className={"ml-2"}
          />
        </div>
        <button onClick={() => toggleSidebar()}
          className={twMerge(
            "p-3 cursor-pointer hover:bg-white/10 rounded-2xl border-none",
            isOpen && "ml-auto"
          )
        }>
          <SidebarIcon size={24}/>
        </button>
      </header>
      <nav className={twMerge(
        "p-3 overflow-hidden box-border",

      )}>
        <ul className={"flex flex-col gap-y-3"}>
          {userNavs().map((nav: {name: string, icon: LucideIcon, path: string}) => (
            <li key={nav.name}>
              <Link href={nav.path}
                onClick={isMobile ? () => closeSidebar() : undefined}
                className={twMerge(
                "flex gap-x-4 p-3 rounded-xl items-center",
                pathname !== nav.path && "hover:bg-theme-dark-blue/20",
                pathname === nav.path && "bg-theme-dark-blue text-white"
              )}>
                <nav.icon
                  size={24}
                />
                <span className={twMerge(!isOpen && "hidden", "text-sm")}>{nav.name}</span>
                {pathname === nav.path && isOpen && (
                  <ChevronRight size={20} color={"white"} className={"ml-auto"}/>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <footer
        className={twMerge(
          "hidden md:block mt-auto h-auto p-2 border-t border-gray-300",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={twMerge("flex hover:cursor-pointer p-2 items-center hover:bg-black/10 rounded-md ",
              isOpen && "gap-x-3 "
            )}>
              <div className="flex rounded-lg h-10 w-10 bg-theme-dark-blue justify-center items-center text-white text-lg font-bold">{user?.first_name.charAt(0).toUpperCase()}</div>
              <div className={twMerge(
                "flex flex-1 flex-col justify-center min-w-0",
                !isOpen && "hidden",
              )}>
                <span className={"text-sm truncate"}>{`${toTitleCase(user?.first_name)} ${toTitleCase(user?.last_name)}`}</span>
                <span className={"text-xs text-gray-500 truncate"}>{user?.email}</span>
              </div>
              <div className={twMerge("p-2",
                !isOpen && "hidden"
              )}>
                <ChevronUp size={20} color="gray"/>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-3 py-2 min-w-65">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className={twMerge("flex items-center rounded-md gap-x-3 mb-2")}>
                  <div className="flex rounded-lg h-10 w-10 bg-theme-dark-blue justify-center items-center text-white text-lg font-bold">{user?.first_name.charAt(0).toUpperCase()}</div>
                  <div className={twMerge(
                    "flex flex-1 flex-col justify-center min-w-0")}>
                    <span className={"text-sm truncate"}>{`${toTitleCase(user?.first_name)} ${toTitleCase(user?.last_name)}`}</span>
                    <span className={"text-xs text-gray-500 truncate"}>{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem className="p-2"><CircleUser /> Profile</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="p-2" 
                    variant="destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <LogOutIcon /> Logout
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be signed out and need to log in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => {
                      e.preventDefault(); // optional if logout is async
                      handleLogout();
                    }}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>

    </aside>
  )
}
export default Sidebar
