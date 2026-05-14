export const getAuthToken = () => {
  const auth = JSON.parse(localStorage.getItem("@auth"));

  return auth ? auth.access_token : null;
};

export const getSgaAuthToken = (user, password) => {
  const auth = JSON.parse(localStorage.getItem("@sga_auth"));

  return auth ? auth.access_token : null;
};
