import { axiosInstance } from "@/lib/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isResetCodeSend: false,
  isResetCodeVerified: false,

  // auth actions
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");

      set({ user: res.data.data.user });
      return res;
    } catch (error) {
      set({ user: null });
      if (error.status == 500) {
        toast.error("conection time out, try again ");
      }
      return error;
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (username, email, password) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("auth/register", {
        username,
        email,
        password,
      });

      set({ user: res.data.data.user });
      toast.success("Account has been created ");
      return res;
    } catch (error) {
      console.log(error);
      if (error.response.data.message.startsWith("Email already exists")) {
        return toast.error("Email already exists");
      }
      toast.error("something went woreng, try again");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("auth/login", {
        email,
        password,
      });
      console.log(res.data);

      set({ user: res.data.data.user });
      toast.success("Logged in successfully");
      return res;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("auth/logout");
      toast.error("Logged out successfully");
    } catch (error) {
      toast.error("something went woreng, try again");
    } finally {
      set({ isLoggingOut: false });
    }
  },
  sendVerificationCode :async (email) => {

    try {
      const res = await axiosInstance.post("auth/reset-code", { email });
      if (res.status === 200) {
        toast.success("code send via email");
        set({ isResetCodeSend: true });
      }
      return res;
    } catch (error) {
      console.log(error)
      set({ isResetCodeSend: false });
      toast.error(error.data.message);
    }
  },
  verifiedResetCode:async(code,email)=>{
try{
  const res = await axiosInstance.post("auth/verified-code",{code,email});
  if(res.status == 200 ){
    set({ isResetCodeVerified: true });
    toast.success("code verified successfully");
  }
}catch(error){
  set({ isResetCodeVerified: false });
  toast.error("Invalid code")
}
  },
  resetPassword: async(userId,password)=>{
    try{
      const res = await axiosInstance.post("auth/reset-password",{userId,password})
      if(res.status === 200){
        console.log("password reseted")
      }
    }catch(error){
      console.log("error in reset password",error)
    }
  }
  ,
  // user profile action
  updateUserPic: async (pic) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("auth/update-profile", pic);
      set({ user: res.data.data.user });
      toast.success("Profile picture updated");
    } catch (error) {
      if (error.status !== 401) {
        return toast.error("something want woreng, try again");
      }
      return error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  updateUsername: async (username) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("auth/update-username", { username });
      set({ user: res.data.data.user });
      toast.success("Username updated");
    } catch (error) {
      if (error.status !== 401) {
        return toast.error("something want worng, try again");
      }
      return error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
