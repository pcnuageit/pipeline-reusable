import { Box, Grid, Typography } from "@material-ui/core";
import { useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";

import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomRoundedCard from "../../components/CustomRoundedCard/CustomRoundedCard";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import useAuth from "../../hooks/useAuth";

import AprovacoesContainer from "../../components/AprovacoesContainer/AprovacoesContainer";
import PagarCobrancaWallet from "../../components/PagarCobrancaWallet/PagarCobrancaWallet";
import WalletListaCobrancasEnviadas from "../../components/WalletListaCobrancasEnviadas/WalletListaCobrancasEnviadas";
import WalletListaCobrancasRecebidas from "../../components/WalletListaCobrancasRecebidas/WalletListaCobrancasRecebidas";
import WalletNovaCobranca from "../../components/WalletNovaCobranca/WalletNovaCobranca";
import { APP_CONFIG } from "../../constants/config";

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

    marginTop: "100px",
    marginLeft: "30px",
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

export default function WalletVBank() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const token = useAuth();

  const [loading, setLoading] = useState(false);
  const [metodos, setMetodos] = useState("listaCobrancasRecebidas");

  function changePath(path) {
    setMetodos(path);
  }
  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Wallet" />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box style={{ display: "flex" }}>
              <Box
                style={{
                  display: "flex",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  borderRadius: "17px",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                {metodos === "listaCobrancasRecebidas" ? (
                  <WalletListaCobrancasRecebidas changePath={changePath} />
                ) : metodos === "pagarCobrancaWallet" ? (
                  <PagarCobrancaWallet changePath={changePath} />
                ) : metodos === "listaCobrancasEnviadas" ? (
                  <WalletListaCobrancasEnviadas changePath={changePath} />
                ) : metodos === "aprovacoes" ? (
                  <AprovacoesContainer
                    tipoAprovacao="pagamentoWallet"
                    changePath={changePath}
                  />
                ) : metodos === "novaCobranca" ? (
                  <WalletNovaCobranca changePath={changePath} />
                ) : null}
              </Box>

              <Box
                style={{
                  display: "flex",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  borderRadius: "17px",
                  flexDirection: "column",
                  height: "300px",
                  minWidth: "30%",
                  marginLeft: "10px",
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
                  Área Wallet
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "10px",
                    marginBottom: 10,
                  }}
                >
                  <Box
                    style={{
                      width: "90%",
                      height: "1px",
                      backgroundColor: APP_CONFIG.mainCollors.primary,
                    }}
                  />
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "60%",
                    }}
                  >
                    <Grid container spacing={2} style={{ marginTop: "10px" }}>
                      <Grid item sm={4} xs={12}>
                        <Box
                          onClick={() => setMetodos("listaCobrancasEnviadas")}
                        >
                          <CustomRoundedCard
                            title="Minhas cobranças"
                            icon="extrato"
                          />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box
                          onClick={() => setMetodos("listaCobrancasRecebidas")}
                        >
                          <CustomRoundedCard
                            title="Cobranças recebidas"
                            icon="extrato"
                          />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodos("novaCobranca")}>
                          <CustomRoundedCard
                            title="Nova cobrança"
                            icon="pagamento"
                          />
                        </Box>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <Grid item sm={12} xs={12}>
                          <Box onClick={() => setMetodos("aprovacoes")}>
                            <CustomRoundedCard
                              title="Aprovações"
                              icon="aprovacoes"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
