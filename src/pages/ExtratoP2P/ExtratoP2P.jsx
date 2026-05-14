import { Box, Grid, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";
import { useState } from "react";
import { useSelector } from "react-redux";
import AprovacoesContainer from "../../components/AprovacoesContainer/AprovacoesContainer";
import ComprovanteAprovacaoP2P from "../../components/ComprovanteAprovacaoP2P/ComprovanteAprovacaoP2P";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomRoundedCard from "../../components/CustomRoundedCard/CustomRoundedCard";
import ExtratoP2PContainer from "../../components/ExtratoP2PContainer/ExtratoP2PContainer";
import TransferirP2PContainer from "../../components/TranferirP2PContainer/TranferirP2PContainer";
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
export default function ExtratoP2P() {
  const classes = useStyles();
  const homeRedirect = useSelector((state) => state.redirecionarTransferencia);
  const token = useAuth();
  const [metodos, setMetodos] = useState(
    homeRedirect ? "transferir" : "extrato",
  );

  function changePath(path) {
    setMetodos(path);
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Transferência P2P" />

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
                  /* height: '100px', */
                  borderRadius: "17px",
                  flexDirection: "column",

                  /* alignItems: 'center', */
                  width: "100%",
                }}
              >
                {metodos === "extrato" ? (
                  <ExtratoP2PContainer changePath={changePath} />
                ) : metodos === "transferir" ? (
                  <TransferirP2PContainer changePath={changePath} />
                ) : metodos === "aprovacoes" ? (
                  <AprovacoesContainer
                    tipoAprovacao="pagamentoTransferencia"
                    changePath={changePath}
                  />
                ) : metodos === "comprovanteAprovacao" ? (
                  <ComprovanteAprovacaoP2P changePath={changePath} />
                ) : null}
              </Box>

              <Box
                style={{
                  display: "flex",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  /* height: '100px', */
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
                  Área P2P
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
                        <Box onClick={() => setMetodos("transferir")}>
                          <CustomRoundedCard
                            title="Transferir"
                            icon="transferir"
                          />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodos("extrato")}>
                          <CustomRoundedCard title="Extrato" icon="extrato" />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodos("aprovacoes")}>
                          <CustomRoundedCard
                            title="Aprovações"
                            icon="aprovacoes"
                          />
                        </Box>
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
