import { CircularProgress } from "@material-ui/core";
import { BorderAll, PictureAsPdf } from "@material-ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";

import { getExportTable } from "../../services/beneficiarios";

import TableHeaderButton from "../TableHeaderButton";

const API_URL = `${process.env.REACT_APP_API_URL}`;

export function ExportTableButtons({
  token,
  path, // extrato || aluguel-conta || beneficiario || beneficiario/contas || beneficiario/cartoes-privados || cartao-privado-pagamento || pagamento-estabelecimento || pagamento-aluguel || contrato-aluguel || contrato-aluguel-pagamento || transacoes
  apiPath, // pagamento-pix || conta/notificacao/export
  page,
  filters,
  hasPermission = true,
}) {
  const [loading, setLoading] = useState({
    xlsx: false,
    pdf: false,
  });

  const handleExportTable = async (type) => {
    let url = `${API_URL}/concorrencia/${path}/export`;
    if (apiPath) {
      url = `${API_URL}/${apiPath}`;
    }

    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const { data } = await getExportTable(token, url, type, page, filters);
      toast.warn(
        data?.message ??
          `Exportando arquivo ${type}. Você poderá fazer o download na área "Arquivos exportados"`,
      );
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro ao exportar o arquivo. Tente novamente.");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  if (!hasPermission) return null;

  return (
    <>
      <TableHeaderButton
        text="Exportar"
        onClick={() => handleExportTable("xlsx")}
        disabled={loading?.xlsx}
        Icon={
          loading?.xlsx
            ? (props) => <CircularProgress size={22} color="white" {...props} />
            : BorderAll
        }
      />

      <TableHeaderButton
        text="Exportar PDF"
        onClick={() => handleExportTable("pdf")}
        disabled={loading?.pdf}
        Icon={
          loading?.pdf
            ? (props) => <CircularProgress size={22} color="white" {...props} />
            : PictureAsPdf
        }
      />
    </>
  );
}
