import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  TableContainer,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { postAuthMeAction } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import "../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../hooks/useAuth";
import useQuery from "../../modules/AntecipacaoSalarial/hooks/useQuery";
import { getArquivoLote } from "../../services/beneficiarios";
import px2vw from "../../utils/px2vw";

import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import { CadastroEmLote } from "./ModalCadastro";

moment.locale("pt-br");

const columns = [
  {
    headerText: "DATA",
    key: "created_at",
    CustomValue: (created_at) => {
      return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
    },
  },
  { headerText: "Nome", key: "name" },
  {
    headerText: "Processo",
    key: "processed",
    CustomValue: (processed) => {
      return (
        <Typography>
          {processed === 0
            ? "Processando"
            : processed === 1
              ? "Processado"
              : null}
        </Typography>
      );
    },
  },
  {
    headerText: "DATA DE PAGAMENTO",
    key: "data_pagamento",
    CustomValue: (data_pagamento) => {
      return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
    },
  },

  // {
  //   headerText: "",
  //   key: "menu",
  // },
];

const itemColumns = [
  {
    headerText: "Erros",
    key: "descricao",
    CustomValue: (erros) => <Typography>{erros}</Typography>,
  },
];

export default function ListaArquivosDeLoteConcorrencia() {
  const token = useAuth();
  const dispatch = useDispatch();
  const type = useQuery().get("type");
  const classes = useStyles();
  const { id } = useParams();
  const [, setLoading] = useState(false);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [showModalCadastroEmLote, setShowModalCadastroEmLote] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const screenName = () => {
    switch (type) {
      case "pagamento_estabelecimento":
        return "Estabelecimento";
      case "pagamento_cartao":
      case "cartao":
        return "Cartão";
      case "pagamento_voucher":
      case "voucher":
        return "Voucher";
      case "beneficiario":
        return "Beneficiários";
      case "pagamento_contrato_aluguel":
      case "contrato_aluguel":
        return "Contrato Aluguel";
      default:
        return "";
    }
  };

  const getData = async (token, page) => {
    setLoading(true);
    const routeHandler = () => {
      switch (type) {
        case "pagamento_estabelecimento":
          return "pagamento-estabelecimento";
        case "pagamento_cartao":
          return "cartao-privado-pagamento";
        case "pagamento_voucher":
          return "pagamento-aluguel";
        case "beneficiario":
          return "beneficiario";
        case "cartao":
          return "cartao-privado";
        case "voucher":
          return "beneficiario-conta";
        case "contrato_aluguel":
          return "contrato-aluguel";
        case "pagamento_contrato_aluguel":
          return "pagamento-contrato-aluguel";
        default:
          return "";
      }
    };
    try {
      const { data } = await getArquivoLote(token, routeHandler(), id, page);
      setData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <CustomHeader
          pageTitle={`Lista de Arquivos de Lote - ${screenName()}`}
        />
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <RefreshIcon></RefreshIcon>
            </IconButton>
          </Box>
        </Box>

        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            <Grid container spacing={3} style={{ alignItems: "center" }}>
              <Grid item xs={12} sm={9} />

              {/* <Grid item xs={12} sm={2}>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <CustomButton color="purple" onClick={() => history.goBack()}>
                    <Box display="flex" alignItems="center">
                      Voltar
                    </Box>
                  </CustomButton>
                </Box>
              </Grid> */}

              <Grid item xs={12} sm={1} />
              <Grid item xs={12} sm={2}>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <CustomButton
                    color="purple"
                    onClick={() => setShowModalCadastroEmLote(true)}
                  >
                    <Box display="flex" alignItems="center">
                      Cadastrar em lote
                    </Box>
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Typography
            className={classes.pageTitle}
            style={{
              marginLeft: "30px",
              paddingBottom: "16px",
              marginBottom: "1px",
            }}
          >
            CADASTROS RECENTES
          </Typography>
        </Box>

        <Box className={classes.tableContainer}>
          <Box minWidth={!matches ? "800px" : null}>
            <TableContainer style={{ overflowX: "auto" }}>
              {data?.data && data?.per_page ? (
                <CustomCollapseTable
                  compacta
                  data={data?.data}
                  columns={columns}
                  itemColumns={itemColumns}
                  Editar={() => null}
                  EditarCollapse={() => null}
                  conta={data?.data?.conta}
                />
              ) : (
                <LinearProgress color="secondary" />
              )}
            </TableContainer>
          </Box>

          <Box
            display="flex"
            alignSelf="flex-end"
            marginTop="8px"
            justifyContent="space-between"
          >
            <Pagination
              variant="outlined"
              color="secondary"
              size="large"
              count={data?.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </Box>
        </Box>
      </Box>

      <CadastroEmLote
        tipo={type}
        show={showModalCadastroEmLote}
        setShow={setShowModalCadastroEmLote}
        getData={() => getData(token, page)}
      />
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "25px",
    width: px2vw("100%"),
    "@media (max-width: 1440px)": {
      width: "950px",
    },
    "@media (max-width: 1280px)": {
      width: "850px",
    },
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));
