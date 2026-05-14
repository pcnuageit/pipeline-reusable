import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import VisaLogo from "../../assets/vBankPJAssets/visa.svg";
import VisaLogoRoxa from "../../assets/vBankPJAssets/visaRoxa.svg";
import { APP_CONFIG } from "../../constants/config";

export default function CartaoPre({
  dados,
  desativado = false,
  visualizarCartao,
  index,
}) {
  const classes = useStyles();
  const userData = useSelector((state) => state.userData);

  return (
    <Box
      onClick={() => {
        visualizarCartao(dados, index);
      }}
      className={
        !desativado == false ? classes.cartao : classes.cartaoDesativado
      }
    >
      {dados.response != null ? (
        <>
          <img
            className={classes.vbankLogo}
            src={
              !desativado == false
                ? APP_CONFIG.assets.smallWhiteLogo
                : APP_CONFIG.assets.favicon
            }
            alt="logo"
          />
          <img
            className={classes.visaLogo}
            src={!desativado == false ? VisaLogo : VisaLogoRoxa}
            alt="logo"
          />
          <span className={classes.nome}>
            {dados?.card_data != undefined
              ? `${dados?.card_data?.name.split(" ")[0]} ${dados?.card_data?.name.split(" ").pop()}`
              : `${userData.nome.split(" ")[0]} ${userData.nome.split(" ").pop()}`}{" "}
            - {dados.response.card_type == "VIRTUAL" ? "Virtual" : "Físico"}
          </span>

          {dados.response.card_type == "VIRTUAL" ? (
            <Box className={classes.dados}>
              <span className={classes.numCartao}>
                {dados?.card_data?.number}
              </span>
              <Box className={classes.info}>
                <span className={classes.val}>
                  VAL {dados?.card_data?.expiration}
                </span>
                <span className={classes.ccv}>CCV {dados?.card_data?.cvv}</span>
              </Box>
            </Box>
          ) : (
            <Box className={classes.dados}>
              <span className={classes.numCartao}>
                **** **** **** {dados.response.last_four}
              </span>
              <Box className={classes.info}>
                {/* <span className={classes.val}>VAL {dados?.card_data?.expiration}</span> */}
                {/* <span className={classes.ccv}>CCV ***</span> */}
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          <img
            className={classes.vbankLogo}
            src={
              !desativado == false
                ? APP_CONFIG.assets.smallWhiteLogo
                : APP_CONFIG.assets.favicon
            }
            alt="logo"
          />
          <img
            className={classes.visaLogo}
            src={!desativado == false ? VisaLogo : VisaLogoRoxa}
            alt="logo"
          />
          <span className={classes.nome}>Aguardando confirmação</span>
          <Box className={classes.dados}>
            <span className={classes.numCartao}>**** **** **** ****</span>
            <Box className={classes.info}>
              <span className={classes.val}>VAL 00/00</span>
              <span className={classes.ccv}>CCV ***</span>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  cartao: {
    cursor: "pointer",
    width: 330,
    height: 200,
    background: APP_CONFIG.mainCollors.buttonGradientVariant,
    borderRadius: 25,
    padding: 15,
    position: "relative",
    color: "white",
    transition: "0.2s",
  },
  cartaoDesativado: {
    transition: "0.2s",
    cursor: "pointer",
    width: 300,
    height: 170,
    background: "transparent",
    borderRadius: 25,
    border: `1px solid ${APP_CONFIG.mainCollors.primary}`,
    padding: 15,
    position: "relative",
    color: APP_CONFIG.mainCollors.primary,
  },
  nome: {
    display: "block",
    position: "absolute",
    left: 15,
    bottom: 15,
    fontSize: 14,
    textTransform: "uppercase",
  },
  vbankLogo: {
    //width: "70px",
    height: "20px",
    right: 15,
    position: "absolute",
  },
  visaLogo: {
    width: "35px",
    right: 15,
    bottom: 15,
    position: "absolute",
  },
  info: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  dados: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    position: "absolute",
    bottom: 60,
  },
  numCartao: {},
  val: {},
  ccv: {},
}));
