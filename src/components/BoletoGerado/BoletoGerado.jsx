import {
  Box,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import CustomButton from "../CustomButton/CustomButton";
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
    marginLeft: "40px",
  },
  line: {
    width: "90%",
    height: "1px",
    backgroundColor: APP_CONFIG.mainCollors.primary,
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

const BoletoGerado = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const dadosBoleto = useSelector((state) => state.dadosBoletoGerado);

  function copyToClipBoard(text) {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  }

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Typography className={classes.boxTitle}>Dados do boleto</Typography>
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

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
          padding: "0 40px",
        }}
      >
        {dadosBoleto.id && (
          <>
            <Box className={classes.dataContainer}>
              <Box width={"90%"}>
                <Typography className={classes.title}>
                  Dados do documento:
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"90%"}>
                <Typography className={classes.title}>ID:</Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.id}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"30%"}>
                <Typography className={classes.title}>Vencimento:</Typography>
                <Typography className={classes.text}>
                  {moment.utc(dadosBoleto.data_vencimento).format("DD/MM/YYYY")}
                </Typography>
              </Box>
              <Box width={"30%"}>
                <Typography className={classes.title}>Descrição:</Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.descricao}
                </Typography>
              </Box>
              <Box width={"30%"}>
                <Typography className={classes.title}>Valor:</Typography>
                <Typography className={classes.text}>
                  R${" "}
                  {parseFloat(dadosBoleto.valor).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"45%"}>
                <Typography className={classes.title}>
                  Instrução linha 1:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.instrucao1}
                </Typography>
              </Box>
              <Box width={"45%"}>
                <Typography className={classes.title}>
                  Instrução linha 2:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.instrucao2}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"90%"}>
                <Typography className={classes.title}>
                  Instrução linha 3:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.instrucao3}
                </Typography>
              </Box>
            </Box>
            <Box
              style={{ alignItems: "center" }}
              className={classes.dataContainer}
            >
              <Box width={"80%"}>
                <Typography className={classes.title}>
                  Linha digitáve:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.linha_digitavel}
                </Typography>
              </Box>
              <Box width={"10%"}>
                <IconButton
                  type="button"
                  onClick={() => {
                    copyToClipBoard(dadosBoleto.linha_digitavel);
                  }}
                >
                  <ContentCopyIcon className={classes.copyIcon} />
                </IconButton>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"30%"}>
                <Typography className={classes.title}>
                  Número do documento:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.numero_documento}
                </Typography>
              </Box>
              <Box width={"30%"}>
                <Typography className={classes.title}>
                  Tipo de desconto:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.tipo_desconto}
                </Typography>
              </Box>
              <Box width={"30%"}>
                <Typography className={classes.title}>
                  Valor do desconto:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.valor_desconto}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"30%"}>
                <Typography className={classes.title}>
                  Tipo de juros:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.tipo_juros}
                </Typography>
              </Box>
              <Box width={"30%"}>
                <Typography className={classes.title}>
                  Valor do juros:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.valor_juros}
                </Typography>
              </Box>
              <Box width={"30%"}>
                <Typography className={classes.title}>
                  Tipo da multa:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.tipo_multa}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"90%"}>
                <Typography className={classes.title}>
                  Valor da multa:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.valor_multa}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"90%"}>
                <Typography className={classes.title}>
                  Dados do pagador:
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"45%"}>
                <Typography className={classes.title}>
                  Nome do pagador:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.pagador.nome}
                </Typography>
              </Box>
              <Box width={"45%"}>
                <Typography className={classes.title}>
                  Documento do pagador:
                </Typography>
                <Typography className={classes.text}>
                  {dadosBoleto.pagador.documento}
                </Typography>
              </Box>
            </Box>

            <Box
              style={{
                marginTop: "30px",
                marginBottom: "15px",
              }}
            >
              <CustomButton
                color="purple"
                onClick={() => {
                  window.open(dadosBoleto.url);
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Visualizar documento
                </Typography>
              </CustomButton>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default BoletoGerado;
