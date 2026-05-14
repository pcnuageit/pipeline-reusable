import { Box, Grid, Typography } from "@material-ui/core";
import { useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";

import AprovacoesContainer from "../../components/AprovacoesContainer/AprovacoesContainer";
import ComprovanteAprovacaoPagamento from "../../components/ComprovanteAprovacaoPagamento/ComprovanteAprovacaoPagamento";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomRoundedCard from "../../components/CustomRoundedCard/CustomRoundedCard";
import ListaDePagamentos from "../../components/ListaDePagamentos/ListaDePagamentos";
import PagarBoletos from "../../components/PagarBoletos/PagarBoletos";
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

export default function PaginaPagamentos() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const token = useAuth();

  const [metodos, setMetodos] = useState("pagamentos");

  function changePath(path) {
    setMetodos(path);
  }

  return (
    <Box className={classes.root}>
      {/* <LoadingScreen isLoading={loading} /> */}

      <Box className={classes.main}>
        <CustomHeader pageTitle="Pagamentos" />

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
                  width: "100%",
                  /* alignItems: 'center', */
                }}
              >
                {metodos === "pagamentos" ? (
                  <ListaDePagamentos changePath={changePath} />
                ) : metodos === "pagar" ? (
                  <PagarBoletos changePath={changePath} />
                ) : metodos === "aprovacoes" ? (
                  <AprovacoesContainer
                    tipoAprovacao="pagamentoConta"
                    changePath={changePath}
                  />
                ) : metodos === "comprovanteAprovacao" ? (
                  <ComprovanteAprovacaoPagamento changePath={changePath} />
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
                  Área de Pagamentos
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
                    <Grid container spacing={6} style={{ marginTop: "10px" }}>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodos("pagar")}>
                          <CustomRoundedCard title="Pagar" icon="pagamento" />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodos("pagamentos")}>
                          <CustomRoundedCard
                            title="Pagamentos"
                            icon="extrato"
                          />
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
