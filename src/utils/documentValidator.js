export function isCPF(value) {
  const cpf = value.replace(/\D/g, ""); // Remove caracteres não numéricos do CPF

  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit === 10 || digit === 11) {
    digit = 0;
  }
  if (digit !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit === 10 || digit === 11) {
    digit = 0;
  }
  if (digit !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

export function isCNPJ(value) {
  const cnpj = value.replace(/\D/g, ""); // Remove caracteres não numéricos do CNPJ

  if (cnpj.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  let sum = 0;
  let factor = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * factor;
    factor = factor === 2 ? 9 : factor - 1;
  }
  let digit = 11 - (sum % 11);
  if (digit < 0) {
    digit += 11;
  }
  if (digit !== parseInt(cnpj.charAt(12))) {
    return false;
  }

  // Calcula o segundo dígito verificador
  sum = 0;
  factor = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * factor;
    factor = factor === 2 ? 9 : factor - 1;
  }
  digit = 11 - (sum % 11);
  if (digit < 0) {
    digit += 11;
  }
  if (digit !== parseInt(cnpj.charAt(13))) {
    return false;
  }

  return true;
}
