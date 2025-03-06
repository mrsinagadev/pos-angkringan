import secureLocalStorage from "react-secure-storage";
import Login from "./Login.jsx";

const Logout = () => {
  secureLocalStorage.removeItem("acessToken");
  secureLocalStorage.removeItem("refreshToken");
  secureLocalStorage.removeItem("user");
  return (
    <>
      <Login />
    </>
  );
};

export default Logout;