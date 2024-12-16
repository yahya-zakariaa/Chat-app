"use client";
import { useAuthStore } from "@/store/useAuthStore.js";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import defaultAvatar from "../../public/default-avatar.png";
import Link from "next/link";
export default function Home() {
  const {
    user,
    checkAuth,
    isCheckingAuth,
    logout,
    isLoggingOut,
    updateUserPic,
    isUpdatingProfile,
  } = useAuthStore();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState();
  const handelCheckAuth = async () => {

    try{
      await checkAuth();
      
    }
    catch(error){
      router.push("/login");

    }
  };

  const handelUpdateProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateUserPic({ avatar: base64Image });
    };
  };

  useEffect(() => {
    handelCheckAuth();
  }, [isLoggingOut]);

  return (
    <>
      <main className="w-full flex relative">
   
        

        <div className="main-layout   w-[100%] flex justify-between   h-[100vh] ">
          <div className="chats-section  lg:w-[50%] w-full h-full  bg-[#050a19] border-r  border-gray-800 flex flex-col ">
            <div className="chat-header h-[12%]  py-3 flex justify-between items-center md:px-6 px-4 ">
              <div className="title mb-0.5 text-[30px] text-white   font-bold">
                Chats
              </div>
              <div className="search-bar w-[60%]  mb-1 ">
                <input
                  type="text"
                  className="w-full px-4 py-1.5 rounded-lg"
                  placeholder="Search Frindes"
                />
              </div>
            </div>
            <div className="chats  h-[50%] py-2 min-h-[88%]  overflow-auto scroll  gap-1 w-full flex flex-col items-center justify-start  px-1">
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  5
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  4
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/1
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
              <div className="chat    rounded-lg w-full min-h-[80px] h-[80px] flex relative  justify-start items-center   px-2">
                <div className="massage-count absolute left-[5px] bottom-[5px] border-[#dbdbdbd2]  bg-[#0f225c] w-[25px] h-[25px] rounded-full flex items-center justify-center text-[12px]">
                  5
                </div>
                <div className="massage-count absolute right-[10px] top-[13px] rounded-full flex items-center justify-center text-[14px] text-[#dbdbdbd2]">
                  2019/10/5
                </div>
                <div className="user-image min-w-[60px] mr-3 w-[60px] h-[60px] rounded-full bg-black"></div>
                <div className="user-data flex flex-col justify-start flex-grow max-w-[78%] mb-2">
                  <div className="user-name text-[18px] font-bold">
                    yahya zakaria
                  </div>
                  <div className="user-chat line-clamp-1 text-[#dbdbdbd2]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi voluptatem at, praesentium velit tenetur mollitia
                    dolore quae placeat nam maiores.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-side flex-col justify-between pt-20 items-center lg:w-[50%] lg:flex hidden bg-[#050a19] h-full  ">
            <div className="content flex-col justify-start flex items-center">
              <h1 className="  font-bold text-[26px] mb-10">
                Welcome, <span className=" border-b-2">{user?.username}</span>   to Nexus chat
              </h1>
              <div className="user-image-container relative">
                <input
                  type="file"
                  id={"main-section-upload-image"}
                  onChange={handelUpdateProfilePic}
                  disabled={isUpdatingProfile}
                  accept="image/*"
                  className="w-[45px] cursor-pointer inline-flex z-[6] opacity-0 rounded-full  h-[45px] top-[63%]  border-[#050a19] border-[7px] right-[-1%] bg-[#0f225c] absolute text-[20px] font-bold "
                />
                <div className=" absolute cursor-pointer z-[1] w-fit h-fit top-[63%] right-0 bg-blue-950 px-3 py-3 flex justify-center items-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 56 56"
                  >
                    <path
                      fill="#fff"
                      d="M7.809 50.348H48.19c4.875 0 7.36-2.438 7.36-7.266V18.543c0-4.828-2.485-7.242-7.36-7.242h-5.484c-1.828 0-2.39-.375-3.445-1.547l-1.899-2.11c-1.148-1.288-2.343-1.992-4.781-1.992h-9.328c-2.414 0-3.61.704-4.781 1.992l-1.899 2.11c-1.031 1.148-1.617 1.547-3.445 1.547h-5.32c-4.875 0-7.36 2.414-7.36 7.242v24.539c0 4.828 2.485 7.266 7.36 7.266m20.18-7.5c-7.079 0-12.774-5.696-12.774-12.82c0-7.126 5.695-12.82 12.773-12.82c7.125 0 12.797 5.694 12.797 12.82c0 7.124-5.695 12.82-12.797 12.82m16.851-18.54c-1.594 0-2.906-1.288-2.906-2.882a2.906 2.906 0 1 1 5.812 0c0 1.594-1.312 2.883-2.906 2.883m-16.85 14.977a9.247 9.247 0 0 0 9.258-9.258a9.247 9.247 0 0 0-9.258-9.257c-5.11 0-9.234 4.125-9.234 9.257c0 5.133 4.148 9.258 9.234 9.258"
                    />
                  </svg>
                </div>
                <Image
                  width={150}
                  height={150}
                  src={selectedImage || user?.avatar || defaultAvatar}
                  alt="user avatar"
                  blurDataURL={selectedImage || user?.avatar || defaultAvatar}
                  className="user-image w-[150px] h-[150px]  rounded-full mb-4 mx-auto"
                />
              </div>
              <Link
                href="/profile"
                className="font-bold text-[18px] px-5 py-1 mt-3 rounded-lg bg-blue-950"
              >
                veiw profile
              </Link>
            </div>
            <footer className="py-3 flex flex-col gap-3 justify-center  items-center w-full">
              <div className="  flex justify-center gap-10 items-center w-full">
                <Link
                  href={"#"}
                  className="font-medium hover:underline text-gray-400 text-[13px]"
                >
                  contact us
                </Link>
                <Link
                  href={"#"}
                  className="font-medium hover:underline text-gray-400 text-[13px]"
                >
                  services
                </Link>
                <Link
                  href={"#"}
                  className="font-medium hover:underline text-gray-400 text-[13px]"
                >
                  support
                </Link>
                <Link
                  href={"#"}
                  className="font-medium hover:underline text-gray-400 text-[13px]"
                >
                  terms and condations
                </Link>
              </div>
              <div className="copyRight w-full text-center text-[13px] text-gray-400">
                <i className="fa fa-copyright"></i> @ Copy Right 2024
              </div>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}
