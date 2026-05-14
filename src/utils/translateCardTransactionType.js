export default function translateCardTransactionType(type = "") {
  switch (type) {
    case "C":
      return "Crédito";
    case "D":
      return "Débito";
    case "E":
      return "Estorno";
    default:
      return type;
  }
}
