import {
  Box,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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

const QrCodeCobrancaGerado = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const dadosCobrancaGerada = useSelector((state) => state.qrCodeCobrancaDados);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${dadosCobrancaGerada.id}`;

  function copyToClipBoard(text) {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  }

  async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "qrcode";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Typography className={classes.boxTitle}>Dados da cobrança</Typography>
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
        {dadosCobrancaGerada.id && (
          <>
            <Box className={classes.dataContainer}>
              <Box width={"90%"}>
                <Typography className={classes.title}>ID:</Typography>
                <Typography className={classes.text}>
                  {dadosCobrancaGerada.id}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dataContainer}>
              <Box width={"90%"}>
                <Typography className={classes.title}>QR code:</Typography>
                <img
                  src={qrCodeUrl}
                  alt="qrCode"
                  style={{ height: 250, width: 250, marginBottom: 10 }}
                />
                <br />
                <CustomButton
                  color="black"
                  onClick={() => {
                    downloadImage(qrCodeUrl);
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: "white",
                    }}
                  >
                    Baixar QrCode
                  </Typography>
                </CustomButton>
              </Box>
            </Box>
            <Box
              style={{ alignItems: "center", marginBottom: 20 }}
              className={classes.dataContainer}
            >
              <Box width={"80%"}>
                <Typography className={classes.title}>Link:</Typography>
                <Typography className={classes.text}>
                  {dadosCobrancaGerada.link}
                </Typography>
              </Box>
              <Box width={"10%"}>
                <IconButton
                  type="button"
                  onClick={() => {
                    copyToClipBoard(dadosCobrancaGerada.link);
                  }}
                >
                  <ContentCopyIcon className={classes.copyIcon} />
                </IconButton>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default QrCodeCobrancaGerado;
