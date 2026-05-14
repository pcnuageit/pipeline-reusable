import { isValidDoc } from "./isValidDoc";

export default function pixKeyType(key) {
  if (!key || typeof key !== "string") return "Chave inválida";

  const numericKey = key.replace(/\D/g, "");

  // Email pattern
  if (key.includes("@") && key.includes(".")) {
    return "EMAIL";
  }

  //Check if is valid document
  if (isValidDoc(numericKey)) {
    // CPF 11 digits
    if (numericKey.length === 11) {
      return "CPF";
    }

    // CNPJ 14 digits
    if (numericKey.length === 14) {
      return "CNPJ";
    }
  }

  //CPF with mask
  const maskedCPFPattern = /\*{3}\.[0-9]{3}\.[0-9]{3}-\*{2}$/i;
  if (maskedCPFPattern.test(key)) {
    return "CPF";
  }

  // TELEFONE patterns
  if (numericKey.length >= 8 && numericKey.length <= 13) {
    // 8 digits (landline)
    // 9 digits (mobile)
    // 10 digits (area code + 8 digits)
    // 11 digits (area code + 9 digits)
    // 12 digits (country code + area code + 8 digit TELEFONE)
    // 13 digits (country code + area code + 9 digit mobile)
    return "TELEFONE";
  }

  // Chave aleatória (UUID) pattern - 32 alphanumeric characters (with or without dashes)
  const uuidPattern =
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
  if (uuidPattern.test(key)) {
    return "Chave aleatória";
  }

  return "Chave inválida";
}
