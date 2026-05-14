import { Box, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useLocation, useParams } from "react-router-dom";
import { loadUserData } from "../../actions/actions";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomSelectCard from "../../components/CustomSelectCard/CustomSelectCard";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dadosBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: "30px",
    marginLeft: "0px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
}));

export default function FolhaDePagamento() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const me = useSelector((state) => state.me);
  const type = new URLSearchParams(useLocation().search).get("type"); //beneficio || cartao
  const is_contrato = new URLSearchParams(useLocation().search).get(
    "is_contrato",
  );
  const id = useParams()?.id ?? "";
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const token = useAuth();

  const hasPermission = () => {
    return me?.tipo_beneficios?.find((obj) => obj.id === id);
  };

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [dispatch, token]);

  if (!hasPermission()) return null;

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Beneficiários" />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                borderRadius: "17px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  height: "800px",
                  borderRadius: 27,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box
                  display="flex"
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      fontSize: "16px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "30px",
                      marginLeft: "40px",
                    }}
                  >
                    Selecione a ação que você deseja realizar
                  </Typography>
                </Box>

                <Box
                  style={{
                    display: "flex",
                    flexDirection: !matches ? "flex" : "column",
                  }}
                >
                  <CustomSelectCard
                    title="Beneficiários"
                    icon="personAdd"
                    url={generatePath(":id/acao/lista-beneficiarios", { id })}
                  />

                  {type === "cartao" ? (
                    <>
                      <CustomSelectCard
                        title="Cartões Privados"
                        icon="card"
                        url={generatePath(":id/acao/lista-cartoes", { id })}
                      />

                      {/* <CustomSelectCard
                        title="Cartões Pré"
                        icon="card"
                        url={generatePath(":id/acao/lista-cartoes-pre", { id })}
                      /> */}
                    </>
                  ) : null}

                  {type === "beneficiario" ? (
                    <>
                      <CustomSelectCard
                        title="Voucher"
                        icon="card"
                        url={generatePath(":id/acao/lista-vouchers", { id })}
                      />

                      <CustomSelectCard
                        title="Pagamentos agendados"
                        icon="list"
                        url={generatePath(":id/acao/lista-transacao-pix", {
                          id,
                        })}
                      />
                    </>
                  ) : null}

                  {/* <CustomSelectCard
                    title="Cartões Pré"
                    icon="card"
                    url="beneficiarios/acao/lista-cartoes-pre"
                  /> */}

                  {/* <CustomSelectCard
                    title="Transferências"
                    icon="transferencia"
                    url="beneficiarios/acao/transacoes"
                  /> */}
                </Box>

                {type === "beneficiario" && is_contrato === "true" ? (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: !matches ? "flex" : "column",
                    }}
                  >
                    <CustomSelectCard
                      title="Contrato de Aluguel"
                      icon="list"
                      url={generatePath(":id/acao/lista-contrato-aluguel", {
                        id,
                      })}
                    />

                    <CustomSelectCard
                      title="Pagamento contrato de aluguel "
                      icon="list"
                      url={generatePath(":id/acao/pagamento-contrato-aluguel", {
                        id,
                      })}
                    />
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
