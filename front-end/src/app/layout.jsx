"use client";
import "./globals.css";
import localFont from "next/font/local";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useToggleComponents } from "@/store/useToggleComponents";
import { useAuthStore } from "@/store/useAuthStore";
import DescoverFriends from "@/components/DescoverFriends";
import Notifications from "@/components/Notifications";
import useWindowWidth from "@/hooks/useWindowWidth";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import useImageHandlerStore from "@/store/useImageHandlerStore";
import ImageCropperLayer from "@/components/ImageCropperLayer";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const metadata = {
  title: "Blue Chat",
  description: "",
};

export default function RootLayout({ children }) {
  const protectedRoute = ["/", "/profile"];
  const unProtectedRoute = ["/forgot-password", "/signup", "/login"];
  const {
    user,
    isCheckingAuth,
    isUpdatingProfile,
    isLoggingOut,
    logout,
    checkAuth,
  } = useAuthStore();
  const { setActiveComponent, activeComponent } = useToggleComponents();
  const { isUpdatingAvatar } = useImageHandlerStore();
  const windowWidth = useWindowWidth();
  const router = useRouter();
  const pathname = usePathname();
  const [isToggled, setIsToggled] = useState(false);
  const components = {
    descoverFriends: <DescoverFriends setIsToggled={setIsToggled} />,
    notifications: <Notifications setIsToggled={setIsToggled} />,
  };
  const [currentComponent, setCurrentComponent] = useState(
    components[activeComponent]
  );

  const handleCheckAuth = async () => {
    try {
      if (pathname === ("/signup" || "/forgot-password")) return;

      await checkAuth();
    } catch (error) {
      if (unProtectedRoute.includes(pathname))
        return toast.error("Session expired - Login again");

      router.push("/login");
      return toast.error("Session expired - Login again");
    }
  };
  useEffect(() => {
    setCurrentComponent(components[activeComponent]);
  }, [activeComponent]);

  useEffect(() => {
    handleCheckAuth();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  flex flex-col relative justify-start gap-2 md:justify-between p-2 max-h-[100vh] h-screen overflow-hidden bg-[#000]`}
      >
        <Toaster posation="top-center" containerStyle={{ zIndex: 999999 }} />
        {(isCheckingAuth && !user) ||
          (isLoggingOut && (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-[999999]">
              <div className="w-[300px] flex items-center justify-center flex-col gap-4 h-[200px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%] rounded-lg bg-gray-900 absolute z-[99999]">
                <span className="loader"></span>
                <h4 className="text-[18px] font-bold">Loading..</h4>
              </div>
            </div>
          ))}
        {isUpdatingProfile && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-[999999]">
            <div className="w-[300px] flex items-center justify-center flex-col gap-4 h-[200px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%] rounded-lg bg-[#1a1a1a] absolute z-[99999]">
              <span className="loader"></span>
              <h4 className="text-[18px] font-bold">update picture..</h4>
            </div>
          </div>
        )}
        {protectedRoute.includes(pathname) && (
          <Navbar
            setIsToggled={setIsToggled}
            setActiveComponent={setActiveComponent}
            user={user}
          />
        )}

        {isToggled && windowWidth <= 1000 && (
          <div
            onClick={() => setIsToggled(false)}
            className="md:hidden fixed top-0 left-0 w-screen h-screen bg-[#000] bg-opacity-60 z-[9999]"
          >
            {currentComponent}
          </div>
        )}
        {isUpdatingAvatar && <ImageCropperLayer />}
        <main className="flex flex-grow md:flex-row flex-col-reverse gap-2 justify-between items-start md:items-end w-full h-[88%] ">
          {protectedRoute.includes(pathname) && <Sidebar logout={logout} />}
          {children}
        </main>
      </body>
    </html>
  );
}
