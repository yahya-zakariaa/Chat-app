"use client";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  const { user, checkAuth, isCheckingAuth, logout, isLoggingOut , isUpdatingProfile } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const pagesWithSidebar = ["/profile", "/"];
  const handelCheckAuth = async () => {
    const res = await checkAuth();
    if (res?.status == 401) {
      router.push("/login");
    }
  };

  useEffect(() => {
    handelCheckAuth();
  }, [isLoggingOut]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  flex max-h-[100vh] overflow-hidden`}
      >
        <Toaster posation="top-center" />
        {isCheckingAuth && !user && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-[999999]">
            <div className="w-[300px] flex items-center justify-center flex-col gap-4 h-[200px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%] rounded-lg bg-gray-900 absolute z-[99999]">
              <span className="loader"></span>
              <h4 className="text-[18px] font-bold">Loading..</h4>
            </div>
          </div>
        )}
        {isUpdatingProfile && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-[999999]">
            <div className="w-[300px] flex items-center justify-center flex-col gap-4 h-[200px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%] rounded-lg bg-gray-900 absolute z-[99999]">
              <span className="loader"></span>
              <h4 className="text-[18px] font-bold">update picture..</h4>
            </div>
          </div>
        ) }
        {pagesWithSidebar.includes(pathname) && (
          <div className="sidebar flex flex-row md:flex-col md:py-2 justify-between items-center md:h-[100vh] lg:w-[5%] md:w-[7%] w-[80%] left-[50%] translate-x-[-50%] md:translate-x-0 h-fit  md:rounded-none rounded-2xl shadow-3xl  md:bg-[#050a19] bg-[#0b1942c6] md:backdrop-blur-0 backdrop-blur-md md:relative fixed md:top-0 bottom-2 md:left-0 z-[9999]">
            <div className="logo w-full h-[60px]  items-center justify-center md:flex hidden">
              logo
            </div>
            <ul className="flex flex-row  md:flex-col justify-evenly md:justify-center items-center py-3 mb-[-5px] h-fit w-full gap-5 ">
              <li className="order-3 md:order-1">
                <button className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
                    />
                  </svg>
                </button>
              </li>
              <li className="order-4 md:order-2">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="currentColor"
                      fillOpacity="0"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.10"
                    >
                      <path
                        strokeDasharray="20"
                        strokeDashoffset="20"
                        d="M12 5c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3Z"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          dur="1.2s"
                          values="20;0"
                        />
                      </path>
                      <path
                        strokeDasharray="36"
                        strokeDashoffset="36"
                        d="M12 14c4 0 7 2 7 3v2h-14v-2c0 -1 3 -3 7 -3Z"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          begin="1.5s"
                          dur="1.5s"
                          values="36;0"
                        />
                      </path>
                      <animate
                        fill="freeze"
                        attributeName="fill-opacity"
                        begin="3.3s"
                        dur="1.5s"
                        values="0;1"
                      />
                    </g>
                  </svg>
                </button>
              </li>
              <li className="md:order-3 order-5">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"
                    />
                  </svg>
                </button>
              </li>
              <li className="order-2 md:order-4 ">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="34"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#fff"
                      d="M84 120a44 44 0 1 1 44 44a44 44 0 0 1-44-44m126.16 57.18a8.21 8.21 0 0 0-10.86 2.41a87 87 0 0 1-5.52 6.85A79.8 79.8 0 0 0 172 165.1a4 4 0 0 0-4.84.32a59.8 59.8 0 0 1-78.26 0a4 4 0 0 0-4.9-.32a79.7 79.7 0 0 0-21.79 21.31A87.66 87.66 0 0 1 40.37 136h15.4a8.2 8.2 0 0 0 6.69-3.28a8 8 0 0 0-.8-10.38l-24-24a8 8 0 0 0-11.32 0l-24 24a8 8 0 0 0-.8 10.38A8.2 8.2 0 0 0 8.23 136H24.3a104 104 0 0 0 188.18 52.67a8 8 0 0 0-2.32-11.49m45.23-52.24A8 8 0 0 0 248 120h-16.3A104 104 0 0 0 43.52 67.33a8 8 0 0 0 13 9.34A88 88 0 0 1 215.63 120H200a8 8 0 0 0-5.66 13.66l24 24a8 8 0 0 0 11.32 0l24-24a8 8 0 0 0 1.73-8.72"
                    />
                  </svg>
                </button>
              </li>
              <li className="order-1 md:order-4 ">
                <button
                  onClick={() => {
                    logout();
                    checkAuth();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="356"
                    height="36"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#ff2323"
                      d="M15 2h-1c-2.828 0-4.243 0-5.121.879C8 3.757 8 5.172 8 8v8c0 2.828 0 4.243.879 5.121C9.757 22 11.172 22 14 22h1c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16V8c0-2.828 0-4.243-.879-5.121C19.243 2 17.828 2 15 2"
                      opacity="0.6"
                    />
                    <path
                      fill="#ff9494"
                      d="M8 8c0-1.538 0-2.657.141-3.5H8c-2.357 0-3.536 0-4.268.732S3 7.143 3 9.5v5c0 2.357 0 3.535.732 4.268S5.643 19.5 8 19.5h.141C8 18.657 8 17.538 8 16z"
                      opacity="0.4"
                    />
                    <path
                      fill="#ffdddd"
                      fillRule="evenodd"
                      d="M4.47 11.47a.75.75 0 0 0 0 1.06l2 2a.75.75 0 0 0 1.06-1.06l-.72-.72H14a.75.75 0 0 0 0-1.5H6.81l.72-.72a.75.75 0 1 0-1.06-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
