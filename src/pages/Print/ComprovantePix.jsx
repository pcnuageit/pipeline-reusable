import { Box, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { Print } from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getTransacaoPixId } from "../../services/services";
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

export default function ComprovantePix() {
  const id = useParams()?.id ?? "";
  const token = useAuth();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getTransacaoPixId(token, id);
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
      id: data?.external_id,
      valor: data?.valor,
      tipo: data?.tipo_pix,
      status: data?.status == "sent" ? "Aprovado" : "Aguardando",
      descricao: data?.descricao,
      origem: {
        nome: data?.conta?.razao_social || data?.conta?.nome,
        documento: data?.conta?.cnpj || data?.conta?.documento,
        banco: data?.banco_pagou,
      },
      destino: {
        nome: data?.nome_recebedor,
        documento: data?.documento_recebedor,
        banco: data?.banco,
      },
    };

    if (obj?.status === "Aprovado") {
      obj.titulo = "Comprovante de transferência";
    } else {
      obj.titulo = obj?.status;
    }

    //Recebimento
    const transactionDetails =
      data?.response?.webhook?.data?.transaction_details;
    if (transactionDetails) {
      obj.origem.nome = transactionDetails?.payer_name;
      obj.origem.documento = transactionDetails?.payer_document_number;

      obj.destino.nome = transactionDetails?.receiver_name;
      obj.destino.documento = transactionDetails?.receiver_document_number;

      if (transactionDetails?.pix_message) {
        obj.descricao = transactionDetails?.pix_message;
      }
    }

    //Dados beneficiários
    const contaUser = data?.pagamento_aluguel_conta?.conta?.user;
    if (contaUser) {
      obj.beneficiario = {
        nome: contaUser?.nome,
        documento: contaUser?.documento,
      };
    }

    const locatarioUser =
      data?.pagamento_contrato_aluguel?.contrato_aluguel?.locatario?.user;
    if (locatarioUser) {
      obj.beneficiario = {
        nome: locatarioUser?.nome,
        documento: locatarioUser?.documento,
      };
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
