import { api } from "../services/api";

const useSgaAuth = () => {
  const setNewToken = async (authResponse) => {
    console.log("setNewToken");

    await localStorage.setItem(
      "@sga_auth",
      JSON.stringify({
        ...authResponse.data,
        login_time: new Date().getTime(),
      }),
    );
  };

  const getNewToken = async () => {
    console.log("getNewToken");

    try {
      const url = `/api-sga/login`;
      const response = await api.post(url);
      setNewToken(response);

      return response.data;
    } catch (error) {
      return { access_token: null };
    }
  };

  const auth = () => {
    const auth = JSON.parse(localStorage.getItem("@sga_auth"));

    if (auth) {
      const timeDiference = (new Date().getTime() - auth.login_time) / 1000;
      if (timeDiference > auth.expires_in) {
        console.log("Token expirou------");
        return getNewToken();
      }

      console.log("Token está válido------");
      return auth;
    } else {
      console.log("Token inesistente------");
      return getNewToken();
    }
  };

  return auth().access_token;
};

export default useSgaAuth;
