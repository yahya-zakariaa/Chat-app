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
  const protectedRoute = ["/", "/profile"];
  const unProtectedRoute = ["/forgot-password", "/signup", "/login"];
  const windowWidth = useWindowWidth();
  const pathname = usePathname();
  const { isUpdatingAvatar } = useImageHandlerStore();
  const {
    user,
    isCheckingAuth,
    logout,
    checkAuth,
    initSocketConnection,
    cleanupSocket,
    setupSocketListeners,
    socket,
    isLoggingIn,
    isLoggedIn,
    onlineUsers,
  } = useAuthStore();
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
  };

  const currentComponent = useMemo(() => {
    return components[activeComponent] || null;
  }, [activeComponent]);

  useEffect(() => {
    if (
      unProtectedRoute.includes(pathname) &&
      !user &&
      !isCheckingAuth &&
      !isLoggedIn &&
      !isLoggingIn
    ) {
      setIsToggled(false);
      setActiveComponent("default");
    }
  }, [user?._id, isCheckingAuth, isLoggedIn, isLoggingIn, pathname]);

  useEffect(() => {
    if (!isCheckingAuth && !user?._id) {
      checkAuth();
    }
  }, [checkAuth, user?._id, isLoggedIn]);

  useEffect(() => {
    if (!socket?.connected && user && !isLoggingIn && !isCheckingAuth) {
      console.log("Socket connected from layout");
      initSocketConnection();
    }

    return () => {
      if (socket?.connected && user) {
        cleanupSocket();
      }
    };
  }, [
    user?._id,
    initSocketConnection,
    cleanupSocket,
    isCheckingAuth,
    isLoggingIn,
  ]);

  useEffect(() => {
    if (!socket || !user) return;
    setupSocketListeners(socket);

    return () => {
      socket.off("user-status-update");
    };
  }, [socket, onlineUsers, user?._id]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col relative justify-between gap-2 md:justify-between p-2 max-h-[100vh] h-screen overflow-hidden bg-[#000]`}
      >
        <Toaster position="top-center" containerStyle={{ zIndex: 99999999 }} />

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

        <main className="flex flex-grow md:flex-row flex-col-reverse gap-2 max-h-[90%] justify-between items-center md:items-center w-full ">
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
      </body>
    </html>
  );
}
