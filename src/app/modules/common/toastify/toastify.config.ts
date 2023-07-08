import { toast } from "react-toastify";

type TypeOptions = "info" | "success" | "warning" | "error" | "default";

const showToast = (message: string, type: TypeOptions) => {
  console.log("Yes");
  toast(message, {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    type: type,
  })
};

export { showToast };
