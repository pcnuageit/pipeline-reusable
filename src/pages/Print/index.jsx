import useQuery from "../../modules/AntecipacaoSalarial/hooks/useQuery";
import ComprovantePix from "./ComprovantePix";
import PrintFolhaDePagamento from "./PrintFolhaDePagamento";

export default function Print() {
  const type = useQuery()?.get("type") ?? "";

  switch (type) {
    case "pagamento_cartao":
    case "pagamento_voucher":
    case "pagamento_estabelecimento":
      return <PrintFolhaDePagamento />;
    case "comprovante_pix":
      return <ComprovantePix />;
    default:
      return null;
  }
}
