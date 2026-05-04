import { Box, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { Print } from "@material-ui/icons";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getTransacaoPixId } from "../../services/services";
import { documentMask } from "../../utils/documentMask";
import { translateStatus } from "../../utils/translateStatus";

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "16px 0",
    gap: "1rem",
    "& > *:not(:first-child)": {
      textAlign: "right",
    },
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: APP_CONFIG.mainCollors.primary,
    margin: "20px 0",
    textAlign: "center",
  },
  line: {
    border: `1px solid ${APP_CONFIG.mainCollors.primary}`,
  },
}));

export default function ComprovantePix() {
  const id = useParams()?.subsection ?? "";
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
      created_at: data?.data_agendamento ?? data?.created_at,
      id: data?.external_id,
      valor: data?.valor,
      tipo: data?.tipo_pix,
      status:
        data?.status === "sent" ? "Aprovado" : translateStatus(data?.status),
      titulo:
        data?.status === "succeeded" ||
        data?.status === "sent" ||
        data?.status === "received"
          ? "Comprovante de transferência"
          : "Aguardando",
      descricao: data?.descricao,
      competencia:
        data?.pagamento_contrato_aluguel?.competencia ??
        data?.pagamento_aluguel_conta?.folha?.competencia,
      origem: {
        nome: data?.conta?.razao_social || data?.conta?.nome,
        documento: data?.conta?.cnpj || data?.conta?.documento,
        banco: data?.banco_pagou,
      },
      destino: {
        nome:
          data?.nome_recebedor ??
          data?.consulta_sent?.target_account?.owner_name,
        documento: data?.documento_recebedor,
        banco: data?.banco,
      },
    };

    //Recebimento
    const recebimentoTransactionDetails =
      data?.response?.webhook?.data?.transaction_details;
    if (recebimentoTransactionDetails) {
      obj.origem.nome = recebimentoTransactionDetails?.payer_name;
      obj.origem.documento =
        recebimentoTransactionDetails?.payer_document_number;

      obj.destino.nome = recebimentoTransactionDetails?.receiver_name;
      obj.destino.documento =
        recebimentoTransactionDetails?.receiver_document_number;

      if (recebimentoTransactionDetails?.pix_message) {
        obj.descricao = recebimentoTransactionDetails?.pix_message;
      }
    }
    const recebimentoOrigin = data?.response?.webhook?.data?.origin;
    if (recebimentoOrigin) {
      obj.origem.nome = recebimentoOrigin?.name;
      obj.origem.documento = recebimentoOrigin?.document;
    }
    const recebimentoDestination = data?.response?.webhook?.data?.destination;
    if (recebimentoDestination) {
      obj.destino.nome = recebimentoDestination?.name;
      obj.destino.documento = recebimentoDestination?.document;
    }

    //Devolução
    const devolucaoOrigin = data?.response?.webhook?.data?.source_account;
    if (devolucaoOrigin) {
      obj.origem.nome = devolucaoOrigin?.owner_name;
      obj.origem.documento = devolucaoOrigin?.owner_document_number;
      obj.destino.nome = data?.conta?.razao_social || data?.conta?.nome;
      obj.destino.documento = data?.conta?.cnpj || data?.conta?.documento;
    }
    const devolucaoPixMsg = data?.response?.webhook?.data?.pix_message;
    if (devolucaoPixMsg) {
      obj.descricao = devolucaoPixMsg;
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

function Comprovante({ data = {} }) {
  const classes = useStyles();

  return (
    <Box>
      <Typography
        style={{
          color: APP_CONFIG.mainCollors.primary,
          fontSize: "20px",
        }}
      >
        {data?.titulo}
      </Typography>

      <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
        {moment.utc(data?.created_at).format("DD/MM/YYYY, HH:mm")}
      </Typography>

      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Status
        </Typography>

        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          {data.status}
        </Typography>
      </Box>

      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Valor
        </Typography>

        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            R${" "}
            {parseFloat(data?.valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Typography>
      </Box>

      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Tipo de transferência
        </Typography>

        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          {data?.tipo}
        </Typography>
      </Box>

      {data?.id ? (
        <Box className={classes.row}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            ID
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.id}
          </Typography>
        </Box>
      ) : null}

      {data?.descricao ? (
        <Box style={{ marginBottom: "16px" }}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Descrição
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.descricao}
          </Typography>
        </Box>
      ) : null}

      {data?.competencia ? (
        <Box style={{ marginBottom: "16px" }}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Competência
          </Typography>

          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.competencia}
          </Typography>
        </Box>
      ) : null}

      <Details titulo="Destino" data={data?.destino} />

      <Details titulo="Origem" data={data?.origem} />

      <Details titulo="Beneficiário" data={data?.beneficiario} />
    </Box>
  );
}

function Details({ titulo, data = {} }) {
  const classes = useStyles();

  if (!data.nome && !data.documento && !data.banco) return null;

  return (
    <>
      <Box className={classes.line} />

      <Typography className={classes.title}>{titulo}</Typography>

      <Box className={classes.line} />
      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Nome
        </Typography>
        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          {data?.nome}
        </Typography>
      </Box>

      <Box className={classes.row}>
        <Typography
          style={{
            fontFamily: "Montserrat-ExtraBold",
            color: APP_CONFIG.mainCollors.primary,
          }}
        >
          Documento
        </Typography>
        <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
          {documentMask(data?.documento)}
        </Typography>
      </Box>

      {data?.banco ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            marginBottom: "40px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Instituição
          </Typography>
          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            {data?.banco}
          </Typography>
        </Box>
      ) : null}
    </>
  );
}
