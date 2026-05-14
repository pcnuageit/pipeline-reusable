import { Box, Grid, Typography } from "@material-ui/core";
import { useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";

import BoletoGerado from "../../components/BoletoGerado/BoletoGerado";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomRoundedCard from "../../components/CustomRoundedCard/CustomRoundedCard";
import GerarBoleto from "../../components/GerarBoleto/GerarBoleto";
import ListaDeBoletos from "../../components/ListaDeBoletos/ListaDeBoletos";
import ListaDePagadores from "../../components/ListaDePagadores/ListaDePagadores";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import NovoPagador from "../../components/NovoPagador/NovoPagador";
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

export default function PaginaBoletos() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const token = useAuth();

  const [loading, setLoading] = useState(false);
  const [metodos, setMetodos] = useState("listaBoletos");

  function changePath(path) {
    setMetodos(path);
  }
  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Boleto" />

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
                {metodos === "listaBoletos" ? (
                  <ListaDeBoletos changePath={changePath} />
                ) : metodos === "listaPagadores" ? (
                  <ListaDePagadores changePath={changePath} />
                ) : metodos === "gerarBoleto" ? (
                  <GerarBoleto changePath={changePath} />
                ) : metodos === "boletoGerado" ? (
                  <BoletoGerado changePath={changePath} />
                ) : metodos === "novoPagador" ? (
                  <NovoPagador changePath={changePath} rowPagador={false} />
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
                  Área de Boletos/Pagadores
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
                        <Box onClick={() => setMetodos("listaPagadores")}>
                          <CustomRoundedCard
                            title="Pagadores"
                            icon="pagamento"
                          />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodos("listaBoletos")}>
                          <CustomRoundedCard title="Boletos" icon="extrato" />
                        </Box>
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <Box onClick={() => setMetodos("novoPagador")}>
                          <CustomRoundedCard
                            title="Novo pagador"
                            icon="person"
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
