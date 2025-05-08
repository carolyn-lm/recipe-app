import { toast } from "react-toastify";

export const displayToast = (message, type = "success") => {
    const options = {
        position: "bottom-right",
        autoClose: 2000
    };

    if (type === "success") {
        toast.success(message, options);
    } else {
        toast.error(message, options);
    }
}