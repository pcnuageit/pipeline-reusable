import { Box, LinearProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { loadUserData } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import { getExtratoEstabelecimento } from "../../../services/beneficiarios";

import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";

moment.locale();

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
    marginTop: "24px",
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

const columns = [
  {
    headerText: "ID",
    key: "idReembolso",
  },
  {
    headerText: "Vencimento",
    key: "dtVencimento",
  },
  {
    headerText: "Fechamento",
    key: "dtFechamento",
  },
  {
    headerText: "Quantidade",
    key: "qtd",
  },
  {
    headerText: "Valor",
    key: "vlReembolso",
    CustomValue: (valor) => (
      <Typography>
        R${" "}
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },
  {
    headerText: "Status",
    key: "statusReembolso",
  },
  {
    headerText: "Permite Antecipação",
    key: "lgPermiteAntecipacao",
    CustomValue: (v) => <Typography>{v ? "Sim" : "Não"}</Typography>,
  },
];

export default function PagamentosFuturos() {
  const dispatch = useDispatch();
  const token = useAuth();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [extratoConcorrencia, setExtratoConcorrencia] = useState("");
  const [page, setPage] = useState(1);

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getExtratoEstabelecimento(token, page);
      setExtratoConcorrencia(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [token, page]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token, dispatch]);

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Histórico de Reembolso" />

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
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                ></Box>
              </Box>

              {!loading && extratoConcorrencia?.per_page ? (
                <>
                  <Box>
                    <CustomTable
                      data={extratoConcorrencia.data}
                      columns={columns}
                    />
                  </Box>
                  <Box alignSelf="start" marginTop="8px">
                    {
                      <Pagination
                        variant="outlined"
                        color="secondary"
                        size="large"
                        count={extratoConcorrencia.last_page}
                        onChange={(e, value) => setPage(value)}
                        page={page}
                      />
                    }
                  </Box>
                </>
              ) : (
                <LinearProgress />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
