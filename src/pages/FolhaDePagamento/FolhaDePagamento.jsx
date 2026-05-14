import { Box, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { loadExtratoFilter, loadUserData } from "../../actions/actions";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomSelectCard from "../../components/CustomSelectCard/CustomSelectCard";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
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

export default function FolhaDePagamento() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
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

  useEffect(() => {
    dispatch(
      loadExtratoFilter(
        token,
        page,
        debouncedId,
        filters.day,
        filters.order,
        filters.mostrar,
        filters.tipo,
        userData.id,
      ),
    );
  }, [
    filters.day,
    filters.order,
    filters.mostrar,
    filters.tipo,
    page,
    debouncedId,
    userData.id,
  ]);

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
        <CustomHeader
          pageTitle={
            userType.isBanking ? "Folha de Pagamento" : "Gestão de Benefício"
          }
        />

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
                // alignItems: "center",
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
                  {userType.isBanking ? (
                    <CustomSelectCard
                      title="Autorizar Pagamento de Salários"
                      icon="check"
                      url="folha-de-pagamento/acao/autorizar-pagamentos-de-salarios"
                    />
                  ) : (
                    <Box>
                      <CustomSelectCard
                        title="Autorizar Recarga de Benefícios"
                        icon="check"
                        url="folha-de-pagamento/acao/autorizar-pagamentos-de-salarios-conc"
                      />
                      {/* <CustomSelectCard
                        title="Autorizar Pagamento Estabelecimentos"
                        icon="check"
                        url="folha-de-pagamento/acao/autorizar-pagamentos-de-salarios-bene"
                      /> */}
                      {/* <CustomSelectCard
                        title="Lista de Pagamento de Estabelecimentos"
                        icon="list"
                        url="folha-de-pagamento/acao/lista-folhas-de-pagamento-bene"
                      /> */}
                    </Box>
                  )}

                  {userType.isBanking ? (
                    <CustomSelectCard
                      title="Folhas de Pagamento"
                      icon="list"
                      url="folha-de-pagamento/acao/lista-folhas-de-pagamento"
                    />
                  ) : (
                    <Box>
                      <CustomSelectCard
                        title="Lista de Recarga do Cartão de Benefícios"
                        icon="list"
                        url="folha-de-pagamento/acao/lista-folhas-de-pagamento-conc"
                      />
                      <CustomSelectCard
                        title="Lista de Pagamento de Voucher"
                        icon="list"
                        url="folha-de-pagamento/acao/lista-folhas-de-pagamento-voucher"
                      />
                    </Box>
                  )}

                  {userType.isBanking ? (
                    <CustomSelectCard
                      title="Funcionários e Grupos"
                      icon="personAdd"
                      url="folha-de-pagamento/acao/lista-funcionarios-e-grupos"
                    />
                  ) : null}

                  {userType.isBanking ? (
                    <CustomSelectCard
                      title="Consultar pagamentos"
                      icon="consult"
                      url="folha-de-pagamento/acao/consultar-pagamentos"
                    />
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
