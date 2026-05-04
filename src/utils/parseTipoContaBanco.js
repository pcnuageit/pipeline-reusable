export function parseTipoContaBanco(type) {
  switch (type) {
    case "conta_corrente":
      return "Conta Corrente";
    case "conta_salario":
      return "Conta salário";
    case "conta_poupanca":
      return "Conta poupança";
    case "conta_pagamento":
      return "Conta pré-paga";
    default:
      return type;
  }
}
