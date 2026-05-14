import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";
const useAuth = () => {
  const history = useHistory();
  const location = useLocation();
  const auth = () => {
    const auth = JSON.parse(localStorage.getItem("@auth"));

    if (auth) {
      const timeDiference = (new Date().getTime() - auth.login_time) / 1000;

      if (timeDiference > auth.expires_in && location.pathname !== "/login") {
        localStorage.removeItem("@auth");
        toast.warning("Seu tempo de acesso expirou!", { autoClose: true });
        history.push("/login");
      }
      return auth;
    } else {
      return { access_token: null };
    }
  };
  return auth().access_token;
};

export default useAuth;
