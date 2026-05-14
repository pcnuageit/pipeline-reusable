import useQuery from "../../modules/AntecipacaoSalarial/hooks/useQuery";
import ComprovantePix from "./ComprovantePix";
import ComprovanteTransacoesCartao from "./ComprovanteTransacoesCartao";
import PrintFolhaDePagamento from "./PrintFolhaDePagamento";

export default function Print() {
  const type = useQuery()?.get("type") ?? "";

  switch (type) {
    case "pagamento_cartao":
    case "pagamento_voucher":
      // case "pagamento_estabelecimento":
      return <PrintFolhaDePagamento />;
    case "comprovante_pix":
      return <ComprovantePix />;
    case "comprovante_transacoes_cartao":
      return <ComprovanteTransacoesCartao />;
    default:
      return null;
  }
}
