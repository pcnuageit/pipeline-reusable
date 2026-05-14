import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AprovacoesContainer from "../../components/AprovacoesContainer/AprovacoesContainer";
import ChavesContainer from "../../components/ChavesContainer/ChavesContainer";
import CobrarContainer from "../../components/CobrarContainer/CobrarContainer";
import ComprovanteAprovacaoPix from "../../components/ComprovanteAprovacaoPix/ComprovanteAprovacaoPix";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomRoundedCard from "../../components/CustomRoundedCard/CustomRoundedCard";
import DepositarContainer from "../../components/DepositarContainer/DepositarContainer";
import ExtratoPixContainer from "../../components/ExtratoPixContainer/ExtratoPixContainer";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import PixCopiaeColaContainer from "../../components/PixCopiaeColaContainer/PixCopiaeColaContainer";
import TransferirContainer from "../../components/TransferirContainer/TransferirContainer";
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
export default function ExtratoPix() {
  const classes = useStyles();
  const homeRedirect = useSelector((state) => state.redirecionarTransferencia);
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [metodosPix, setMetodosPix] = useState(
    homeRedirect ? "transferir" : "extrato",
  );

  function changePath(path) {
    setMetodosPix(path);
  }

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Pix" />

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

                  /* alignItems: 'center', */
                }}
              >
                {metodosPix === "extrato" ? (
                  <ExtratoPixContainer changePath={changePath} />
                ) : metodosPix === "transferir" ? (
                  <TransferirContainer changePath={changePath} />
                ) : metodosPix === "pixcopiaecola" ? (
                  <PixCopiaeColaContainer />
                ) : metodosPix === "cobrar" ? (
                  <CobrarContainer changePath={changePath} />
                ) : metodosPix === "depositar" ? (
                  <DepositarContainer changePath={changePath} />
                ) : metodosPix === "chaves" ? (
                  <ChavesContainer />
                ) : metodosPix === "aprovacoes" ? (
                  <AprovacoesContainer
                    tipoAprovacao="pagamentoPix"
                    changePath={changePath}
                  />
                ) : metodosPix === "comprovanteAprovacao" ? (
                  <ComprovanteAprovacaoPix />
                ) : null}
              </Box>

              <Box
                minWidth={!matches ? null : "1300px"}
                style={{
                  display: "flex",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  /* height: '100px', */
                  borderRadius: "17px",
                  flexDirection: "column",
                  height: "450px",
                  minWidth: "420px",
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
                  Área pix
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "10px",
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
                        <Box onClick={() => setMetodosPix("transferir")}>
                          <CustomRoundedCard
                            title="Transferir"
                            icon="transferir"
                          />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodosPix("pixcopiaecola")}>
                          <CustomRoundedCard
                            title="Pix copia e cola"
                            icon="copia-e-cola"
                          />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodosPix("chaves")}>
                          <CustomRoundedCard title="Chaves" icon="chaves" />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: "10px" }}>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodosPix("cobrar")}>
                          <CustomRoundedCard title="Cobrar" icon="cobrar" />
                        </Box>
                      </Grid>
                      {/* <Grid item sm={4} xs={12}>
												<Box
													onClick={() =>
														setMetodosPix('depositar')
													}
												>
													<CustomRoundedCard
														title="Depositar"
														icon="depositar"
													/>
												</Box>
											</Grid> */}
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodosPix("aprovacoes")}>
                          <CustomRoundedCard
                            title="Aprovações"
                            icon="aprovacoes"
                          />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodosPix("extrato")}>
                          <CustomRoundedCard title="Extrato" icon="extrato" />
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
