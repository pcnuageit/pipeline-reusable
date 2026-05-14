import {
  Box,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { Button } from "@mui/material";
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

const ComprovanteAprovacaoPagamento = ({ title, changePath, ...rest }) => {
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

      {dadosBoleto && dadosBoleto.conta ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
            minWidth: "400px",
          }}
          ref={componentRef}
        >
          <Box style={{ marginTop: "30px", padding: "15px" }}>
            <Box>
              <img src={APP_CONFIG.assets.smallColoredLogo}></img>
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
                Dados do boleto
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
                Nome do pagador
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                {dadosBoleto.conta.nome}
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
                Documento do pagador
              </Typography>
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                ***
                {dadosBoleto.conta.documento.substring(3, 6)}
                {dadosBoleto.conta.documento.substring(6, 11)}
                -**
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
                ID
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
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default ComprovanteAprovacaoPagamento;
