"use client";
import "./globals.css";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { useToggleComponents } from "@/store/useToggleComponents";
import { useAuthStore } from "@/store/useAuthStore";
import useImageHandlerStore from "@/store/useImageHandlerStore";
import useWindowWidth from "@/hooks/useWindowWidth";

const Chats = dynamic(() => import("@/components/Chat"), {
  loading: () => <p>Loading...</p>,
});
const DiscoverFriends = dynamic(() => import("@/components/DiscoverFriends"), {
  loading: () => <p>Loading...</p>,
});
const Notifications = dynamic(() => import("@/components/Notifications"), {
  loading: () => <p>Loading...</p>,
});
const UserProfile = dynamic(() => import("@/components/UserProfile"), {
  loading: () => <p>Loading...</p>,
});
const Friends = dynamic(() => import("@/components/Friends"), {
  loading: () => <p>Loading...</p>,
});
const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  loading: () => <p>Loading...</p>,
});
const Navbar = dynamic(() => import("@/components/Navbar"), {
  loading: () => <p>Loading...</p>,
});
const ImageCropperLayer = dynamic(
  () => import("@/components/ImageCropperLayer"),
  {
    loading: () => <p>Loading...</p>,
  }
);

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

export default function RootLayout({ children }) {
  const protectedRoute = ["/"];
  const unProtectedRoute = ["/forgot-password", "/signup", "/login"];
  const windowWidth = useWindowWidth();
  const pathname = usePathname();
  const { isUpdatingAvatar } = useImageHandlerStore();
  const { user, isCheckingAuth, logout } =
    useAuthStore();
  const {
    setActiveComponent,
    activeComponent,
    setIsToggled,
    isToggled,
    reset,
  } = useToggleComponents();

  const components = {
    descoverFriends: <DiscoverFriends setIsToggled={setIsToggled} />,
    notifications: <Notifications setIsToggled={setIsToggled} />,
    userProfile: <UserProfile setIsToggled={setIsToggled} />,
    friends: <Friends setIsToggled={setIsToggled} />,
    chat: <Chats setIsToggled={setIsToggled} />,
  };

  const currentComponent = useMemo(() => {
    return components[activeComponent] || null;
  }, [activeComponent]);

  useEffect(() => {
    if (unProtectedRoute.includes(pathname) && !user?._id && !isCheckingAuth) {
      setIsToggled(false);
      setActiveComponent("default");
    }
  }, [user?._id, isCheckingAuth, pathname]);



  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <div className="layout flex flex-col relative justify-between gap-2 md:justify-between p-2 max-h-[100vh] h-screen overflow-hidden bg-[#000]">
          <Toaster
            position="top-center"
            containerStyle={{ zIndex: 99999999 }}
          />

          {isUpdatingAvatar && <ImageCropperLayer />}

          {protectedRoute.includes(pathname) && (
            <Navbar
              setIsToggled={setIsToggled}
              setActiveComponent={setActiveComponent}
              user={user}
              isCheckingAuth={isCheckingAuth}
            />
          )}

          {isToggled && windowWidth <= 1024 && (
            <div
              onClick={() => setIsToggled(false)}
              className="md:hidden fixed top-0 left-0 w-screen h-screen bg-[#000] bg-opacity-60 z-[9999]"
            >
              {currentComponent}
            </div>
          )}

          <main className="flex flex-grow md:flex-row overflow-hidden flex-col-reverse gap-2 max-h-[90%] justify-between items-center md:items-center w-full ">
            {protectedRoute.includes(pathname) && (
              <Sidebar
                logout={logout}
                reset={reset}
                user={user}
                setActiveComponent={setActiveComponent}
                setIsToggled={setIsToggled}
              />
            )}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
