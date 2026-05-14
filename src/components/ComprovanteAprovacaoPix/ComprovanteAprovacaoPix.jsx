import {
  Box,
  Button,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Print } from "@material-ui/icons";
import moment from "moment";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

import { APP_CONFIG } from "../../constants/config";
import { documentMask } from "../../utils/documentMask";

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
  line: {
    border: `1px solid ${APP_CONFIG.mainCollors.primary}`,
  },
}));

export default function ComprovanteAprovacaoPix() {
  // const id = useParams()?.subsection ?? "";
  // const token = useAuth();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.dadosBoletoGerado);
  const componentRef = useRef();
  // const [data, setData] = useState({});

  // const getData = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await getTransacaoPixId(token, id);
  //     setData(data);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const getDataCallback = useCallback(getData, [id, token]);

  // useEffect(() => {
  //   getDataCallback();
  // }, [getDataCallback, token]);

  function parseData() {
    console.log(data);
    let obj = {
      created_at: data?.data_agendamento ?? data?.created_at,
      id: data?.external_id,
      valor: data?.valor,
      tipo: data?.tipo_pix,
      status: data?.status_aprovado === "Aprovado" ? "Aprovado" : "Aguardando",
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
    <Box
      style={{
        maxWidth: "500px",
        margin: "16px",
      }}
      ref={componentRef}
    >
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
          <ReactToPrint
            trigger={() => {
              return (
                <Button style={{ display: "flex", flexDirection: "column" }}>
                  <Print
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  />
                  <Typography
                    className={classes.title}
                    style={{ margin: "0 0 0 8px" }}
                  >
                    Imprimir
                  </Typography>
                </Button>
              );
            }}
            content={() => componentRef.current}
          />
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
