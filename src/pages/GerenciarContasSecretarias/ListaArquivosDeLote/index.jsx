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
import { ChevronRight } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import { Download } from "@mui/icons-material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { generatePath } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { postAuthMeAction } from "../../../actions/actions";
import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomCollapseTable from "../../../components/CustomCollapseTable/CustomCollapseTable";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import { ModalManager } from "../../../components/ModalManager";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useQuery from "../../../modules/AntecipacaoSalarial/hooks/useQuery";
import {
  getArquivoLote,
  postLotePagamentoCartaoReprocessar,
  postLotePagamentoVoucherReprocessar,
} from "../../../services/beneficiarios";
import {
  getDownloadArquivoExportado,
  getDownloadArquivoExportadoVoucher,
} from "../../../services/services";
import px2vw from "../../../utils/px2vw";

moment.locale("pt-br");

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

const itemColumns = [
  {
    headerText: "Erros",
    key: "descricao",
    CustomValue: (erros) => <Typography>{erros}</Typography>,
  },
];

export default function PagamentosListaArquivosDeLote() {
  const token = useAuth();
  const dispatch = useDispatch();
  const history = useHistory();
  const type = useQuery().get("type");
  const classes = useStyles();
  const id = useParams()?.id ?? "";
  const [, setLoading] = useState(false);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [showModalCadastroEmLote, setShowModalCadastroEmLote] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const screenName = () => {
    switch (type) {
      case "estabelecimento":
      case "pagamento_estabelecimento":
        return "Estabelecimento";
      case "cartao":
      case "pagamento_cartao":
      case "cancelamento_cartao":
      case "bloquear_cartao":
      case "status_cartao":
      case "segunda_via_cartao":
        return "Cartão";
      case "pagamento_voucher":
      case "voucher":
      case "voucher_embossing":
        return "Voucher";
      case "beneficiario":
        return "Beneficiários";
      case "pagamento_contrato_aluguel":
      case "contrato_aluguel":
      case "contrato_aluguel_excluir":
        return "Contrato Aluguel";
      case "notificacoes":
        return "Notificações";
      default:
        return "";
    }
  };

  const isExcluir = () => {
    switch (type) {
      case "contrato_aluguel_excluir":
        return true;
      default:
        return false;
    }
  };

  const handleDownloadVoucher = async (row) => {
    console.log(row);

    try {
      toast.warning("Carregando arquivo...");
      const { data } = await getDownloadArquivoExportadoVoucher(
        token,
        row?.exports[0]?.id,
      );
      const newWindow = window.open(data, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownload = async (row) => {
    console.log(row);

    try {
      toast.warning("Carregando arquivo...");
      const { data } = await getDownloadArquivoExportado(token, row?.id);
      const newWindow = window.open(data, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    } catch (err) {
      console.log(err);
    }
  };

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
    type === "pagamento_voucher"
      ? {
          headerText: "DATA DE PAGAMENTO",
          key: "request.data_pagamento",
          CustomValue: (data_pagamento) => {
            if (!data_pagamento) return null;
            return (
              <Typography>
                {moment.utc(data_pagamento).format("DD MMMM YYYY")}
              </Typography>
            );
          },
        }
      : {},
    type === "voucher_embossing" && {
      headerText: "Download Embossing",
      key: "",
      FullObject: (data) => (
        <IconButton
          style={{ color: APP_CONFIG.mainCollors.primary }}
          onClick={() => handleDownloadVoucher(data)}
        >
          <Download />
        </IconButton>
      ),
    },
    {
      headerText: "Download",
      key: "",
      FullObject: (data) => (
        <IconButton
          style={{ color: APP_CONFIG.mainCollors.primary }}
          onClick={() => handleDownload(data)}
        >
          <Download />
        </IconButton>
      ),
    },
    {
      headerText: "",
      key: "menu",
    },
  ];

  const getData = async (token, page) => {
    setLoading(true);
    const routeHandler = () => {
      switch (type) {
        case "pagamento_estabelecimento":
          return "pagamento-estabelecimento";
        case "pagamento_cartao":
          return "cartao-privado-pagamento";
        case "cancelamento_cartao":
          return "cartao-privado-cancelamento";
        case "bloquear_cartao":
          return "cartao-privado-bloqueio-sac";
        case "segunda_via_cartao":
          return "nova-via-cartao";
        case "status_cartao":
          return "cartao-privado-status";
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
        case "contrato_aluguel_excluir":
          return "contrato-aluguel-status";
        case "pagamento_contrato_aluguel":
          return "pagamento-contrato-aluguel";
        case "estabelecimento":
          return "estabelecimento";
        case "notificacoes":
          return "notificacao-beneficiario";
        case "voucher_embossing":
          return "embossing-beneficiario-conta";
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
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>
            Lista de Arquivos de Lote - {screenName()}
          </Typography>

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
              <Grid item xs={12} sm={8} />

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
                  <CustomButton color="purple" onClick={() => history.goBack()}>
                    <Box display="flex" alignItems="center">
                      Voltar
                    </Box>
                  </CustomButton>
                </Box>
              </Grid>

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
                    color={isExcluir() ? "red" : "purple"}
                    onClick={() => setShowModalCadastroEmLote(true)}
                  >
                    <Box display="flex" alignItems="center">
                      {isExcluir() ? "Excluir" : "Cadastrar"} em lote
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
            ARQUIVOS RECENTES
          </Typography>
        </Box>

        <Box className={classes.tableContainer}>
          <Box minWidth={!matches ? "800px" : null}>
            <TableContainer style={{ overflowX: "auto" }}>
              {data?.data && data?.per_page ? (
                <CustomCollapseTable
                  data={data?.data}
                  columns={columns}
                  itemColumns={itemColumns}
                  Editar={({ row }) => (
                    <RowMenu row={row} type={type} id={id} />
                  )}
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

      <ModalManager.CadastroEmLote
        tipo={type}
        show={showModalCadastroEmLote}
        setShow={setShowModalCadastroEmLote}
        getData={() => getData(token, page)}
      />
    </Box>
  );
}

function RowMenu({ row = {}, type = "", id = "" }) {
  const token = useAuth();

  function pathHandler() {
    if (type === "cancelamento_cartao" || type === "bloquear_cartao") {
      return generatePath(
        "/dashboard/gerenciar-contas/:id/detalhamento-acao-cartao/:subsectionId",
        {
          id,
          subsectionId: row?.id,
        },
      );
    }
    if (type === "segunda_via_cartao") {
      const path = generatePath(
        `/dashboard/gerenciar-contas/:id/segunda-via-cartao`,
        {
          id,
        },
      );
      return path + `?arquivo_id=${row?.id}`;
    }
    if (type === "notificacoes") {
      return generatePath("/dashboard/historico-notificacoes/:id", {
        id: row?.id,
      });
    }
  }

  async function handleReprocess() {
    try {
      toast.warning("Reprocessando arquivo...");
      if (type === "pagamento_cartao")
        await postLotePagamentoCartaoReprocessar(token, row?.id);
      if (type === "pagamento_contrato_aluguel")
        await postLotePagamentoVoucherReprocessar(token, row?.id);
      toast.success("Arquivo reprocessando com sucesso!");
    } catch (err) {
      toast.error(
        "Ocorreu um erro ao reprocessando o arquivo. Tente novamente mais tarde.",
      );
      console.log(err);
    }
  }

  switch (type) {
    case "cancelamento_cartao":
    case "bloquear_cartao":
    case "segunda_via_cartao":
    case "notificacoes":
      return (
        <MenuOptionsTable
          row={row}
          navigateTo={{
            icon: ChevronRight,
            path: pathHandler(),
          }}
          exportRow="audit-sgc"
        />
      );
    case "pagamento_cartao":
    case "pagamento_contrato_aluguel":
      return (
        <RefreshIcon
          style={{ color: "#202020", fontSize: "28px" }}
          onClick={handleReprocess}
        />
      );
    default:
      return null;
  }
}
