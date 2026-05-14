import { Box, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { Print } from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getHistoricoTransacao } from "../../services/beneficiarios";
import translateCardTransactionType from "../../utils/translateCardTransactionType";
import { translateStatus } from "../../utils/translateStatus";
import { Comprovante } from "./components/Comprovante";

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "16px 0",
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: APP_CONFIG.mainCollors.primary,
    margin: "20px 0",
    textAlign: "center",
  },
}));

export default function ComprovanteTransacoesCartao() {
  const id = useParams()?.id ?? "";
  const token = useAuth();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getHistoricoTransacao(token, id);
      setData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getDataCallback = useCallback(getData, [id, token]);

  useEffect(() => {
    getDataCallback();
  }, [getDataCallback, token]);

  function parseData() {
    let obj = {
      created_at: data?.created_at,
      status: translateStatus(data?.status),
      valor: data?.valor,
      tipo: translateCardTransactionType(data?.tipo_operacao),
      id: data?.nsu,
      external_msk: data?.concorrencia_cartao?.external_msk,
      beneficio: data?.concorrencia_cartao?.tipo_beneficio?.nome_beneficio,
      descricao: data?.descricao,
      origem: {
        nome:
          data?.transactionable_from.razao_social ??
          data?.transactionable_from.nome,
        documento:
          data?.transactionable_from.cnpj ??
          data?.transactionable_from.documento,
      },
      destino: {
        nome:
          data?.transactionable_to.razao_social ??
          data?.transactionable_to.nome,
        documento:
          data?.transactionable_to.cnpj ?? data?.transactionable_to.documento,
      },
    };

    if (data?.aprovado) {
      obj.titulo = "Comprovante de transferência";
    } else {
      obj.titulo = obj?.status;
    }

    return obj;
  }

  if (loading)
    return (
      <Box width="80vw">
        <LinearProgress color="secondary" />
      </Box>
    );

  return (
    <Box style={{ maxWidth: "500px" }}>
      <Box className={classes.row}>
        <img
          src={APP_CONFIG.assets.smallColoredLogo}
          width={"200px"}
          alt="Logo"
        />

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box style={{ cursor: "pointer" }} onClick={() => window.print()}>
            <Print
              style={{
                display: "block",
                margin: "0 auto",
                color: APP_CONFIG.mainCollors.primary,
              }}
            />
            <Typography className={classes.title} style={{ margin: "0" }}>
              Imprimir
            </Typography>
          </Box>
        </Box>
      </Box>

      <Comprovante data={parseData()} />
    </Box>
  );
}
