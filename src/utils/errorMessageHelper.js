export const errorMessageHelper = (err) => {
  if (err?.response?.data?.errors) {
    let errorMessage = "";

    for (const key in err?.response?.data?.errors) {
      errorMessage += `${err?.response?.data?.errors[key].join(" ")} `;
    }

    return errorMessage;
  }

  if (err?.response?.data?.error) {
    if (typeof err?.response?.data?.error === "string") {
      return err?.response?.data?.error;
    }

    if (err?.response?.data?.error?.message) {
      return err?.response?.data?.error?.message;
    }
    //return err?.response?.data?.error.join(" ");
    return err?.response?.data?.error;
  }

  if (err?.response?.data?.result) {
    if (Array.isArray(err?.response?.data?.result)) {
      return err?.response?.data?.result[0]?.Message;
    }

    if (err?.response?.data?.result?.Message) {
      return err?.response?.data?.result?.Message;
    }
  }

  if (err?.response?.data?.response?.Message) {
    return err?.response?.data?.response?.Message;
  }

  if (err?.response?.data?.message) {
    return err?.response?.data?.message;
  }

  if (err?.response?.data?.Message) {
    return err?.response?.data?.Message;
  }

  return "Ocorreu um erro. Tente novamente mais tarde";
};