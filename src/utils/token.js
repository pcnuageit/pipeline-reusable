export const getAuthToken = () => {
  const auth = JSON.parse(localStorage.getItem("@auth"));

  return auth ? auth.access_token : null;
};
