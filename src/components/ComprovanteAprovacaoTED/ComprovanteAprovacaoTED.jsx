import {
  Box,
  Button,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import moment from "moment";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const useStyles = makeStyles((theme) => ({
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",

    top: "10%",
    left: "25%",
    /* transform: 'translate(-50%, -50%)', */
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    /* bgcolor: 'background.paper', */
    border: "0px solid #000",
    boxShadow: 24,
    /* p: 5, */
  },
  boxTitle: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: "16px",
    color: APP_CONFIG.mainCollors.primary,
    marginTop: "30px",
  },
  line: {
    width: "90%",
    height: "1px",
    backgroundColor: APP_CONFIG.mainCollors.primary,
  },
  lineGrey: {
    width: "100%",
    height: "1px",
    backgroundColor: "grey",
    marginTop: "10px",
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: "20px",
    color: APP_CONFIG.mainCollors.primary,
    fontWeight: "bold",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    color: APP_CONFIG.mainCollors.primary,
    fontWeight: "normal",
  },
  copyIcon: {
    color: APP_CONFIG.mainCollors.primary,
    fontSize: "30px",
  },
  dataContainer: { display: "flex", marginTop: 20, width: "100%" },
}));

const ComprovanteAprovacaoTED = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const dadosBoleto = useSelector((state) => state.dadosBoletoGerado);
  const componentRef = useRef();
  function copyToClipBoard(text) {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  }

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Box
        style={{
          display: "flex",
          alignItems: "baseline",
          alignSelf: "center",
          width: "90%",
          justifyContent: "space-between",
        }}
      >
        <Typography className={classes.boxTitle}>
          Dados do comprovante
        </Typography>

        <ReactToPrint
          trigger={() => {
            return (
              <Button>
                <PrintIcon
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                />
              </Button>
            );
          }}
          content={() => componentRef.current}
        />
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Box className={classes.line} />
      </Box>

      {dadosBoleto && dadosBoleto.conta_model ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
          }}
          ref={componentRef}
        >
          <Box style={{ marginTop: "30px", padding: "15px" }}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <img src={APP_CONFIG.assets.smallColoredLogo}></img>
              </Box>
            </Box>
            <Box style={{ marginTop: "20px" }}>
              <Typography
                style={{
                  color: APP_CONFIG.mainCollors.primary,
                  fontSize: "20px",
                }}
              >
                {dadosBoleto.status_aprovado === "Aprovado"
                  ? "Comprovante de transferência"
                  : "Aguardando Aprovação"}
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {moment.utc(dadosBoleto.created_at).format("DD/MM/YYYY")}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Valor
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                R${" "}
                {parseFloat(dadosBoleto.valor).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Tipo de transferência
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.tipo_conta}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                ID da transação
              </Typography>
              <Typography
                style={{
                  color: APP_CONFIG.mainCollors.primary,
                  maxInlineSize: "min-content",
                }}
              >
                {dadosBoleto.id}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Descrição
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.descricao}
              </Typography>
            </Box>

            <Box className={classes.lineGrey} />
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              >
                Destino
              </Typography>
            </Box>
            <Box className={classes.lineGrey} />
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Banco
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.banco}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Nome
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.nome}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Agência
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.agencia}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Conta
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.conta}
              </Typography>
            </Box>
            <Box className={classes.lineGrey} />
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              >
                Origem
              </Typography>
            </Box>
            <Box className={classes.lineGrey} />
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Banco
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.conta_model.banco} - FITBANK
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                {dadosBoleto.conta_model.tipo === "Pessoa Jurídica"
                  ? "Razão Social"
                  : "Nome"}
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.conta_model.tipo === "Pessoa Jurídica"
                  ? dadosBoleto.conta_model.razao_social
                  : dadosBoleto.conta_model.nome}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Agência
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.conta_model.agencia}
              </Typography>
            </Box>
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
                Conta
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.conta_model.conta}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default ComprovanteAprovacaoTED;
