import { CircularProgress } from "@material-ui/core";
import { ViewList } from "@material-ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";

import { getExportTable } from "../../services/beneficiarios";

import TableHeaderButton from "./TableHeaderButton";

const API_URL = `${process.env.REACT_APP_API_URL}`;

export default function ExportTableButtons({
  token,
  path, // extrato || aluguel-conta || beneficiario || beneficiario/contas || beneficiario/cartoes-privados || cartao-privado-pagamento || pagamento-estabelecimento || pagamento-aluguel || contrato-aluguel || contrato-aluguel-pagamento
  apiPath, // pagamento-pix
  page,
  filters,
}) {
  const [loading, setLoading] = useState(false);

  const handleExportTable = async (type) => {
    let url = `${API_URL}/concorrencia/${path}/export`;
    if (apiPath) {
      url = `${API_URL}/${apiPath}`;
    }

    setLoading(type);
    toast.warn(
      `Exportando arquivo ${type}. Você poderá fazer o download na área "Arquivos exportados"`,
    );
    try {
      await getExportTable(token, url, type, page, filters);
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro ao exportar o arquivo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableHeaderButton
        text="Exportar"
        onClick={() => handleExportTable("xlsx")}
        Icon={
          loading === "xlsx"
            ? (props) => <CircularProgress size={22} color="white" {...props} />
            : ViewList
        }
      />

      <TableHeaderButton
        text="Exportar PDF"
        onClick={() => handleExportTable("pdf")}
        Icon={
          loading === "pdf"
            ? (props) => <CircularProgress size={22} color="white" {...props} />
            : ViewList
        }
      />
    </>
  );
}
