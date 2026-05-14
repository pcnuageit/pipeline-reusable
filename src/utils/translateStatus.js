export function translateStatus(status = "") {
  switch (status) {
    case "created":
      return "Criado";
    case "success":
    case "succeeded":
      return "Sucesso";
    case "confirmed":
      return "Confirmado";
    case "pending":
      return "Pendente";
    case "processing":
      return "Processando";
    case "failed":
      return "Falha";
    case "ErrorBalance":
      return "Erro saldo";
    case "rejected":
      return "Rejeitado";
    case "canceled":
      return "Cancelado";
    case "Error":
    case "error":
      return "Erro";
    default:
      return status;
  }
}
