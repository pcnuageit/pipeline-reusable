/**
 * Validates if a string is a valid CPF or CNPJ document
 * @param {string} value - The string to be validated
 * @returns {boolean} - Returns true if the input is a valid CPF or CNPJ
 */
export function isValidDoc(value) {
  // Remove non-digit characters
  const cleanValue = value.replace(/\D/g, "");

  // Check if it's a CPF (11 digits) or CNPJ (14 digits)
  if (cleanValue.length === 11) {
    return isValidCPF(cleanValue);
  } else if (cleanValue.length === 14) {
    return isValidCNPJ(cleanValue);
  }

  return false;
}

/**
 * Validates if a string is a valid CPF document
 * @param {string} cpf - The CPF string (digits only)
 * @returns {boolean} - Returns true if the input is a valid CPF
 */
export function isValidCPF(value) {
  const cpf = value.replace(/\D/g, "");

  // Check for known invalid CPFs
  if (
    cpf === "00000000000" ||
    cpf === "11111111111" ||
    cpf === "22222222222" ||
    cpf === "33333333333" ||
    cpf === "44444444444" ||
    cpf === "55555555555" ||
    cpf === "66666666666" ||
    cpf === "77777777777" ||
    cpf === "88888888888" ||
    cpf === "99999999999"
  ) {
    return false;
  }

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cpf.charAt(9)) !== firstDigit) {
    return false;
  }

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }

  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;

  return parseInt(cpf.charAt(10)) === secondDigit;
}

/**
 * Validates if a string is a valid CNPJ document
 * @param {string} cnpj - The CNPJ string (digits only)
 * @returns {boolean} - Returns true if the input is a valid CNPJ
 */
export function isValidCNPJ(value) {
  const cnpj = value.replace(/\D/g, "");

  // Check for known invalid CNPJs
  if (
    cnpj === "00000000000000" ||
    cnpj === "11111111111111" ||
    cnpj === "22222222222222" ||
    cnpj === "33333333333333" ||
    cnpj === "44444444444444" ||
    cnpj === "55555555555555" ||
    cnpj === "66666666666666" ||
    cnpj === "77777777777777" ||
    cnpj === "88888888888888" ||
    cnpj === "99999999999999"
  ) {
    return false;
  }

  // Validate first check digit
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  // Validate second check digit
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === parseInt(digits.charAt(1));
}
