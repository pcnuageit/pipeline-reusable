import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { loadUserData } from "../../actions/actions";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomSelectCard from "../../components/CustomSelectCard/CustomSelectCard";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  responsiveWrapper: {
    display: "flex",
    [theme.breakpoints.down(1400)]: {
      flexDirection: "column",
    },
  },
  responsiveWrapperWide: {
    display: "flex",
    flexDirection: "column",
    marginTop: "30px",
    [theme.breakpoints.down(1400)]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down(1100)]: {
      flexDirection: "column",
    },
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
export default function Adquirencia() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
    day: " ",
    order: "",
    mostrar: "",
    tipo: "",
  });
  const debouncedId = useDebounce(filters.id, 800);
  const userData = useSelector((state) => state.userData);
  const [page, setPage] = useState(1);

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  /* 
	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []); */

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Adquirencia" />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              /* width: '100%', */
              display: "flex",
              flexDirection: "column",
              /* alignItems: 'center', */
            }}
          >
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                alignItems: "center",
                borderRadius: "17px",
                flexDirection: "column",
                /* width: '90%', */
              }}
            >
              <Box
                style={{
                  /* width: '100%', */
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  /* height: '800px', */
                  borderRadius: 27,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box
                  className={classes.responsiveWrapperWide}
                  style={{
                    /* marginTop: '30px', */
                    display: "flex",

                    padding: "30px",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      /* alignSelf: 'center', */
                      marginLeft: "30px",
                    }}
                  >
                    <Box
                      className={classes.responsiveWrapper}
                      style={{
                        display: "flex",
                      }}
                    >
                      <CustomSelectCard
                        title="Máquina virtual / Cartão"
                        icon="card"
                        url="adquirencia/acao/maquina-virtual-cartao"
                      />

                      <CustomSelectCard
                        title="Link de pagamento"
                        icon="link"
                        url="adquirencia/acao/link-de-pagamento"
                      />

                      <CustomSelectCard
                        title="Cobrança Assinaturas"
                        icon="loop"
                        url="adquirencia/acao/cobranca-recorrente"
                      />
                    </Box>
                  </Box>
                  <Box
                    style={{
                      display: "flex",

                      marginLeft: "30px",
                    }}
                  >
                    <Box
                      className={classes.responsiveWrapper}
                      style={{
                        display: "flex",
                      }}
                    >
                      <CustomSelectCard
                        title="Histórico de transações"
                        icon="list"
                        url="adquirencia/acao/historico-de-transacoes"
                      />

                      <CustomSelectCard
                        title="Pagadores"
                        icon="person"
                        url="adquirencia/acao/pagadores"
                      />

                      <CustomSelectCard
                        title="Lançamentos futuros"
                        icon="time"
                        url="adquirencia/acao/lancamentos-futuros"
                      />
                    </Box>
                  </Box>
                  <Box
                    style={{
                      display: "flex",

                      marginLeft: "30px",
                    }}
                  >
                    <Box
                      className={classes.responsiveWrapper}
                      style={{
                        display: "flex",
                      }}
                    >
                      <CustomSelectCard
                        title="Tarifas"
                        icon="fare"
                        url="adquirencia/acao/tarifas"
                      />
                      <CustomSelectCard
                        title="Terminais - POS"
                        icon="terminal"
                        url="adquirencia/acao/terminais-pos"
                      />
                      <CustomSelectCard
                        title="Exportações Solicitadas"
                        icon="inventory"
                        url="adquirencia/acao/exportacoes-solicitadas"
                      />
                    </Box>
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
