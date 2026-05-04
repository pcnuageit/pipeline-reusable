export function phoneMask(phone) {
  if (!phone || typeof phone !== "string") return "";

  //Caso já venha com máscara
  if (phone.includes("(") && phone.includes(")") && phone.includes("-"))
    return phone;

  const parsedPhone = phone?.replace(/\D/g, "").replace(/^0/, "");
  // (00) 12345-1234
  if (parsedPhone.length === 11)
    return `(${parsedPhone.substring(0, 2)}) ${parsedPhone.substring(
      2,
      7
    )}-${parsedPhone.substring(7, 12)}`;

  // (00) 1234-1234
  if (parsedPhone.length === 10)
    return `(${parsedPhone.substring(0, 2)}) ${parsedPhone.substring(
      2,
      6
    )}-${parsedPhone.substring(7, 11)}`;

  // (XX) 12345-1234
  if (parsedPhone.length === 9)
    return `(XX) ${parsedPhone.substring(0, 6)}-${parsedPhone.substring(
      6,
      10
    )}`;

  // (XX) 1234-1234
  if (parsedPhone.length === 8)
    return `(XX) ${parsedPhone.substring(0, 6)}-${parsedPhone.substring(6, 9)}`;

  return phone;
}
