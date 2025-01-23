import { toast } from "react-hot-toast";
 const showToast = (message, type = "success") => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  } else if (type === "loading") {
    toast.loading(message);
  }
};
export default showToast
