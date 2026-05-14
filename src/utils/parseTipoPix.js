export function parseTipoPix(type) {
  switch (type) {
    case 0:
    case "0":
      return "CPF";
    case 1:
    case "1":
      return "CNPJ";
    case 2:
    case "2":
      return "EMAIL";
    case 3:
    case "3":
      return "TELEFONE";
    case 4:
    case "4":
      return "EVP";
    default:
      return type;
  }
}
