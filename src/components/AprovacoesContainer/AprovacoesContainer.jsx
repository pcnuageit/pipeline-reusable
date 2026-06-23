import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  IconButton,
  LinearProgress,
  makeStyles,
  Modal,
  TableContainer,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Payments, Visibility } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import PixIcon from "@mui/icons-material/Pix";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deletePagamentoPixAprovarAction,
  getPagamentoAprovarAction,
  getPagamentoPixAprovarAction,
  getPagamentoTEDAprovarAction,
  getPagamentoTransferenciaAprovarAction,
  getPagamentoWalletAprovarAction,
  loadHistoricoTransferencia,
  loadTedTransactionsList,
  postPagamentoAprovarAction,
  postPagamentoPixAprovarAction,
  postPagamentoTEDAprovarAction,
  postPagamentoTransferenciaAprovarAction,
  postPagamentoWalletAprovarAction,
  setDadosBoleto,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import CustomButton from "../CustomButton/CustomButton";
import CustomCollapseTablePix from "../CustomCollapseTablePix/CustomCollapseTablePix";
import CustomRoundedCard from "../CustomRoundedCard/CustomRoundedCard";
import ModalAprovadores from "../ExtratoPixContainer/ModalAprovadores";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../MenuOptionsTable";

moment.locale();

const useStyles = makeStyles((theme) => ({
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",

    top: "10%",
    left: "25%",
    /* transform: 'translate(-50%, -50%)', */
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    /* bgcolor: 'background.paper', */
    border: "0px solid #000",
    boxShadow: 24,
    /* p: 5, */
  },
  currencyField: {
    fontFamily: "Montserrat-Regular",
    /* fontWeight: 'bold', */
    color: "white",
  },
  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
  deleteButton: {
    borderRadius: "27px",
    minWidth: "20px !important",
    marginRight: "30px",
    boxShadow: "none",
  },
}));

const AprovacoesContainer = ({ tipoAprovacao, title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const pagamentoPixAprovar = useSelector((state) => state.pagamentoPixAprovar);
  const pagamentoAprovar = useSelector((state) => state.pagamentoAprovar);
  const pagamentoTEDAprovar = useSelector((state) => state.pagamentoTEDAprovar);
  const pagamentoTransferenciaAprovar = useSelector(
    (state) => state.pagamentoTransferenciaAprovar,
  );
  const pagamentoWalletAprovar = useSelector(
    (state) => state.pagamentoWalletAprovar,
  );
  const [openModal, setOpenModal] = useState(false);

  const [registros, setRegistros] = useState([]);
  const [aprovarTodos, setAprovarTodos] = useState(false);
  const [cancelarSelecionado, setCancelarSelecionado] = useState(false);
  const [rowId, setRowId] = useState("");
  const [dataToken, setDataToken] = useState("");
  const [errors, setErrors] = useState("");
  const dispatch = useDispatch();
  const token = useAuth();
  const [page, setPage] = useState(1);
  const [showAprovadoresModal, setShowAprovadoresModal] = useState(false);
  const statusCobranca = {
    1: "Aberto",
    2: "Pago",
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const getData = async () => {
    setLoading(true);
    try {
      if (tipoAprovacao === "pagamentoPix") {
        await dispatch(getPagamentoPixAprovarAction(token, page));
      }
      if (tipoAprovacao === "pagamentoConta") {
        await dispatch(getPagamentoAprovarAction(token, page));
      }
      if (tipoAprovacao === "pagamentoTED") {
        await dispatch(getPagamentoTEDAprovarAction(token, page));
      }
      if (tipoAprovacao === "pagamentoTransferencia") {
        await dispatch(getPagamentoTransferenciaAprovarAction(token, page));
      }
      if (tipoAprovacao === "pagamentoWallet") {
        await dispatch(getPagamentoWalletAprovarAction(token, page));
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [token, page]);

  const AprovarTodos = async () => {
    setLoading(true);
    if (tipoAprovacao === "pagamentoPix") {
      const resAprovarTodos = await dispatch(
        postPagamentoPixAprovarAction(token, true, true, [], dataToken),
      );
      if (resAprovarTodos) {
        setErrors(resAprovarTodos);
        toast.error("Falha ao aprovar pagamento");
      } else {
        dispatch(getPagamentoPixAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setOpenModal(false);
        changePath("extrato");
      }
    } else if (tipoAprovacao === "pagamentoConta") {
      const resAprovarTodos = await dispatch(
        postPagamentoAprovarAction(token, true, true, [], dataToken),
      );
      if (resAprovarTodos) {
        setErrors(resAprovarTodos);
        toast.error("Falha ao aprovar pagamento");
      } else {
        dispatch(getPagamentoAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setOpenModal(false);
        changePath("extrato");
      }
    } else if (tipoAprovacao === "pagamentoTED") {
      const resAprovarTodos = await dispatch(
        postPagamentoTEDAprovarAction(token, true, true, [], dataToken),
      );
      if (resAprovarTodos) {
        setErrors(resAprovarTodos);
        toast.error("Falha ao aprovar pagamento");
      } else {
        dispatch(getPagamentoTEDAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setOpenModal(false);
        changePath("extrato");
      }
    } else if (tipoAprovacao === "pagamentoTransferencia") {
      const resAprovarTodos = await dispatch(
        postPagamentoTransferenciaAprovarAction(
          token,
          true,
          true,
          [],
          dataToken,
        ),
      );
      if (resAprovarTodos) {
        setErrors(resAprovarTodos);
        toast.error("Falha ao aprovar pagamento");
      } else {
        dispatch(getPagamentoTransferenciaAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setOpenModal(false);
        changePath("extrato");
      }
    } else if (tipoAprovacao === "pagamentoWallet") {
      const resAprovarTodos = await dispatch(
        postPagamentoWalletAprovarAction(token, true, true, [], dataToken),
      );
      if (resAprovarTodos) {
        setErrors(resAprovarTodos);
        toast.error("Falha ao aprovar pagamento");
      } else {
        dispatch(getPagamentoWalletAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setOpenModal(false);
        changePath("listaCobrancasRecebidas");
      }
    }
    setLoading(false);
  };

  const AprovarSelecionados = async () => {
    setLoading(true);

    if (registros.length === 0) {
      toast.warning("Selecione um pagamento para aprovar");
      setLoading(false);
      return;
    }

    if (tipoAprovacao === "pagamentoPix") {
      const resAprovarSelecionados = await dispatch(
        postPagamentoPixAprovarAction(token, true, false, registros, dataToken),
      );
      if (resAprovarSelecionados) {
        toast.error("Falha ao aprovar pagamento");
        setErrors(resAprovarSelecionados);
        setLoading(false);
      } else {
        await dispatch(getPagamentoPixAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setLoading(false);
        setOpenModal(false);
        changePath("extrato");
      }
    } else if (tipoAprovacao === "pagamentoConta") {
      const resAprovarSelecionados = await dispatch(
        postPagamentoAprovarAction(token, true, false, registros, dataToken),
      );
      if (resAprovarSelecionados) {
        setErrors(resAprovarSelecionados);
        toast.error("Falha ao aprovar pagamento");
        setLoading(false);
      } else {
        await dispatch(getPagamentoAprovarAction(token));

        toast.success("Pagamentos aprovados");
        setLoading(false);
        setOpenModal(false);
        changePath("extrato");
      }
    } else if (tipoAprovacao === "pagamentoTED") {
      const resAprovarSelecionados = await dispatch(
        postPagamentoTEDAprovarAction(token, true, false, registros, dataToken),
      );
      if (resAprovarSelecionados) {
        setErrors(resAprovarSelecionados);
        toast.error("Falha ao aprovar pagamento");
        setLoading(false);
      } else {
        await dispatch(getPagamentoTEDAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setLoading(false);
        setOpenModal(false);
        changePath("extrato");
        await dispatch(loadTedTransactionsList(token, "", "", "", ""));
      }
    } else if (tipoAprovacao === "pagamentoTransferencia") {
      const resAprovarSelecionados = await dispatch(
        postPagamentoTransferenciaAprovarAction(
          token,
          true,
          false,
          registros,
          dataToken,
        ),
      );
      if (resAprovarSelecionados) {
        setErrors(resAprovarSelecionados);
        toast.error("Falha ao aprovar pagamento");
        setLoading(false);
      } else {
        await dispatch(getPagamentoTransferenciaAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setLoading(false);
        setOpenModal(false);
        await dispatch(loadHistoricoTransferencia(token, 1, "", "", 10));
        changePath("extrato");
      }
    } else if (tipoAprovacao === "pagamentoWallet") {
      const resAprovarSelecionados = await dispatch(
        postPagamentoWalletAprovarAction(
          token,
          true,
          false,
          registros,
          dataToken,
        ),
      );
      if (resAprovarSelecionados) {
        setErrors(resAprovarSelecionados);
        toast.error("Falha ao aprovar pagamento");
        setLoading(false);
      } else {
        await dispatch(getPagamentoWalletAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setLoading(false);
        setOpenModal(false);
        changePath("listaCobrancasRecebidas");
      }
    }
  };

  const cancelarAprovacao = async (id) => {
    setLoading(true);
    if (tipoAprovacao === "pagamentoPix") {
      const restExcluirAprovacao = await dispatch(
        deletePagamentoPixAprovarAction(token, [rowId][0]),
      );
      if (restExcluirAprovacao) {
        toast.error("Falha ao excluir transação");
        setLoading(false);
      } else {
        await dispatch(getPagamentoPixAprovarAction(token));
        toast.success("Transação excluída com sucesso!");
        setLoading(false);
        setOpenModal(false);
      }
    } else if (tipoAprovacao === "pagamentoConta") {
      const restExcluirAprovacao = await dispatch(
        postPagamentoAprovarAction(token, false, false, [rowId], dataToken),
      );
      if (restExcluirAprovacao) {
        toast.error("Falha ao excluir transação");
        setLoading(false);
      } else {
        await dispatch(getPagamentoAprovarAction(token));
        toast.success("Transação excluída com sucesso!");
        setLoading(false);
        setOpenModal(false);
      }
    } else if (tipoAprovacao === "pagamentoTED") {
      const restExcluirAprovacao = await dispatch(
        postPagamentoTEDAprovarAction(token, false, false, [rowId], dataToken),
      );
      if (restExcluirAprovacao) {
        toast.error("Falha ao excluir transação");
        setLoading(false);
      } else {
        await dispatch(getPagamentoTEDAprovarAction(token));
        toast.success("Transação excluída com sucesso!");
        setLoading(false);
        setOpenModal(false);
      }
    } else if (tipoAprovacao === "pagamentoTransferencia") {
      const restExcluirAprovacao = await dispatch(
        postPagamentoTransferenciaAprovarAction(
          token,
          false,
          false,
          [rowId],
          dataToken,
        ),
      );
      if (restExcluirAprovacao) {
        toast.error("Falha ao excluir transação");
        setLoading(false);
      } else {
        await dispatch(getPagamentoTransferenciaAprovarAction(token));
        toast.success("Transação excluída com sucesso!");
        setLoading(false);
        setOpenModal(false);
      }
    } else if (tipoAprovacao === "pagamentoWallet") {
      const restExcluirAprovacao = await dispatch(
        postPagamentoWalletAprovarAction(
          token,
          false,
          false,
          [rowId],
          dataToken,
        ),
      );
      if (restExcluirAprovacao) {
        toast.error("Falha ao excluir transação");
        setLoading(false);
      } else {
        await dispatch(getPagamentoWalletAprovarAction(token));
        toast.success("Transação excluída com sucesso!");
        setLoading(false);
        setOpenModal(false);
      }
    }
  };

  const columnsPix = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                marginRight: "0px",
                justifyContent: "space-around",
              }}
            >
              <Checkbox
                color="primary"
                checked={registros.includes(id)}
                onChange={() => {
                  if (registros.includes(id)) {
                    setRegistros(registros.filter((item) => item !== id));
                  } else {
                    setRegistros([...registros, id]);
                  }
                }}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => {
                  setCancelarSelecionado(true);
                  setOpenModal(true);
                  setRowId(id);
                }}
              >
                <DeleteIcon style={{ color: "#ED757D" }} />
              </Button>
            </Box>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return (
          <>
            <Typography style={{ width: "50px", marginRight: "10px" }}>
              {moment.utc(created_at).format("DD MMMM")}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "",
      key: "",
      CustomValue: (created_at) => {
        return (
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              height: "50px",
              width: "50px",
              borderRadius: "32px",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <PixIcon style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },
    {
      headerText: "Tipo",
      key: "tipo_pix",
      CustomValue: (tipo_pix) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "13px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Pix {tipo_pix}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Nome",
      key: "",
      FullObject: (data) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "13px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {data.response?.pix_chave_consulta
                ? data.response?.pix_chave_consulta?.owner?.name
                : data.response?.cashout_webhook
                  ? data.response?.cashout_webhook?.PayeeName
                  : data.response?.payee_response
                    ? data.response?.payee_response?.owner?.name
                    : null}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <Box width="85px">
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Box>
        );
      },
    },
    {
      headerText: "Status",
      key: "",
      FullObject: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <Typography>{data.status_aprovado}</Typography>
            {data.status_aprovado === "Error" && (
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip title={data?.response?.pix_out?.result?.Message ?? ""}>
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tooltip>

                <MenuOptionsTable row={data} JSONResponse={data?.response} />
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      headerText: "Aprovadores",
      key: "",
      FullObject: (obj) => (
        <IconButton onClick={() => setShowAprovadoresModal(obj?.aprovacoes)}>
          <Visibility style={{ color: APP_CONFIG.mainCollors.primary }} />
        </IconButton>
      ),
    },
    {
      headerText: "",
      key: "",
      FullObject: (data) => {
        return (
          <>
            <Button
              onClick={() => {
                dispatch(setDadosBoleto(data));

                changePath("comprovanteAprovacao");
              }}
              variant="outlined"
              color="primary"
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "10px",
                color: APP_CONFIG.mainCollors.primary,
                borderRadius: 20,
              }}
            >
              Visualizar
            </Button>
          </>
        );
      },
    },
  ];

  const itemColumnsPix = [
    {
      headerText: "",
      key: "pagador",
      CustomValue: (nome) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Nome: {nome?.owner_name ?? nome?.name}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "",
      key: "chave_recebedor",
      CustomValue: (chave) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Chave: {chave || "Agência e conta"}
            </Typography>
          </>
        );
      },
    },
  ];

  const columnsTED = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                marginRight: "0px",
                justifyContent: "space-around",
              }}
            >
              <Checkbox
                color="primary"
                checked={registros.includes(id)}
                onChange={() => {
                  if (registros.includes(id)) {
                    setRegistros(registros.filter((item) => item !== id));
                  } else {
                    setRegistros([...registros, id]);
                  }
                }}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => {
                  setCancelarSelecionado(true);
                  setOpenModal(true);
                  setRowId(id);
                }}
              >
                <DeleteIcon style={{ color: "#ED757D" }} />
              </Button>
            </Box>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return (
          <>
            <Typography style={{ width: "40px" }}>
              {moment.utc(created_at).format("DD MMMM")}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "",
      key: "",
      CustomValue: (created_at) => {
        return (
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              height: "50px",
              width: "50px",

              borderRadius: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CompareArrowsIcon style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },

    {
      headerText: "Origem",
      key: "nome",
    },
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        );
      },
    },
    {
      headerText: "Status",
      key: "",
      FullObject: (data) => {
        return (
          <>
            {data.status_aprovado === "Error" ? (
              <>
                {data.status_aprovado}
                <Tooltip title={data.fitbank.Message}>
                  <Box marginLeft="12px">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </Box>
                </Tooltip>
              </>
            ) : (
              <Typography>{data.status_aprovado}</Typography>
            )}
          </>
        );
      },
    },
    {
      headerText: "",
      key: "",
      FullObject: (data) => {
        return (
          <>
            <Button
              onClick={() => {
                dispatch(setDadosBoleto(data));

                changePath("comprovanteAprovacao");
              }}
              variant="outlined"
              color="primary"
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "10px",
                color: APP_CONFIG.mainCollors.primary,
                borderRadius: 20,
              }}
            >
              Visualizar
            </Button>
          </>
        );
      },
    },
  ];

  const itemColumnsTED = [
    {
      headerText: "Data",
      key: "banco",
      CustomValue: (banco) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Banco: {banco}
              <br />
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "agencia",
      CustomValue: (agencia) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Agência: {agencia}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "conta",
      CustomValue: (conta) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Conta: {conta}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "nome",
      CustomValue: (nome) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Nome: {nome}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Data: {moment.utc(created_at).format("DD/MM/YYYY")}
            </Typography>
          </>
        );
      },
    },
  ];

  const columnsP2P = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                marginRight: "0px",
                justifyContent: "space-around",
              }}
            >
              <Checkbox
                color="primary"
                checked={registros.includes(id)}
                onChange={() => {
                  if (registros.includes(id)) {
                    setRegistros(registros.filter((item) => item !== id));
                  } else {
                    setRegistros([...registros, id]);
                  }
                }}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => {
                  setCancelarSelecionado(true);
                  setOpenModal(true);
                  setRowId(id);
                }}
              >
                <DeleteIcon style={{ color: "#ED757D" }} />
              </Button>
            </Box>
          </>
        );
      },
    },
    /* {
			headerText: '',
			key: 'id',
			CustomValue: (id) => {
				return (
					<>
						<Box
							style={{
								display: 'flex',
								alignSelf: 'center',
								marginRight: '20px',
								justifyContent: 'flex-end',
							}}
						>
							<Button onClick={() => excluirAprovacao(id)}>
								<DeleteIcon style={{ color: '#ED757D' }} />
							</Button>
						</Box>
					</>
				);
			},
		}, */
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return (
          <>
            <Typography style={{ width: "40px", marginRight: "10px" }}>
              {moment.utc(created_at).format("DD MMMM")}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "",
      key: "",
      CustomValue: (created_at) => {
        return (
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              height: "50px",
              width: "50px",

              borderRadius: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CompareArrowsIcon style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },

    {
      headerText: "Origem",
      key: "origem.nome",
    },

    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <Box width="85px">
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Box>
        );
      },
    },
    {
      headerText: "Status",
      key: "",
      FullObject: (data) => {
        return (
          <>
            {data.status === "Error" ? (
              <>
                {data.status}
                <Tooltip title={data.status}>
                  <Box marginLeft="12px">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </Box>
                </Tooltip>
              </>
            ) : (
              <Typography>{data.status}</Typography>
            )}
          </>
        );
      },
    },
  ];

  const itemColumnsP2P = [
    {
      headerText: "Data",
      key: "origem",
      CustomValue: (origem) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              <strong>Origem</strong> <br />
              Agência: {origem?.qi_tech_account?.account_branch} <br />
              Conta: {origem?.qi_tech_account?.account_number}
              {origem?.qi_tech_account?.account_digit} <br />
              Nome: {origem.nome} <br />
              Tipo: {origem.tipo}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "destino",
      CustomValue: (destino) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              <strong>Destino</strong> <br />
              Agência: {destino?.qi_tech_account?.account_branch} <br />
              Conta: {destino?.qi_tech_account?.account_number}
              {destino?.qi_tech_account?.account_digit} <br />
              Nome: {destino.nome} <br />
              Tipo: {destino.tipo}
            </Typography>
          </>
        );
      },
    },
  ];

  const columnsPagamentos = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                marginRight: "0px",
                justifyContent: "space-around",
              }}
            >
              <Checkbox
                color="primary"
                checked={registros.includes(id)}
                onChange={() => {
                  if (registros.includes(id)) {
                    setRegistros(registros.filter((item) => item !== id));
                  } else {
                    setRegistros([...registros, id]);
                  }
                }}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => {
                  setCancelarSelecionado(true);
                  setOpenModal(true);
                  setRowId(id);
                }}
              >
                <DeleteIcon style={{ color: "#ED757D" }} />
              </Button>
            </Box>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return (
          <>
            <Typography style={{ width: "40px" }}>
              {moment.utc(created_at).format("DD MMMM")}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "",
      key: "",
      CustomValue: (created_at) => {
        return (
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              height: "50px",
              width: "50px",

              borderRadius: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArticleIcon style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },

    {
      headerText: "Status",
      key: "",
      FullObject: (data) => {
        return (
          <>
            {data.status === "Error" ? (
              <>
                {data.status}
                <Tooltip title={data.status}>
                  <Box marginLeft="12px">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </Box>
                </Tooltip>
              </>
            ) : (
              <Typography>{data.status}</Typography>
            )}
          </>
        );
      },
    },
    {
      headerText: "Origem",
      key: "nome",
    },
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <Box width="85px">
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Box>
        );
      },
    },
  ];

  const itemColumnsPagamentos = [
    {
      headerText: "Data",
      key: "data_vencimento",
      CustomValue: (vencimento) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Vencimento: {moment.utc(vencimento).format("DD/MM/YYYY")}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "descricao",
      CustomValue: (descricao) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Descrição: {descricao}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "codigo_barras",
      CustomValue: (digitavel) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Código de Barras: {digitavel}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "desconto",
      CustomValue: (desconto) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Desconto: R${" "}
              {parseFloat(desconto).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "juros",
      CustomValue: (juros) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Juros: R${" "}
              {parseFloat(juros).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Valor: R${" "}
              {parseFloat(valor).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </>
        );
      },
    },
  ];

  const columnsWallet = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                marginRight: "0px",
                justifyContent: "space-around",
              }}
            >
              <Checkbox
                color="primary"
                checked={registros.includes(id)}
                onChange={() => {
                  if (registros.includes(id)) {
                    setRegistros(registros.filter((item) => item !== id));
                  } else {
                    setRegistros([...registros, id]);
                  }
                }}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => {
                  setCancelarSelecionado(true);
                  setOpenModal(true);
                  setRowId(id);
                }}
              >
                <DeleteIcon style={{ color: "#ED757D" }} />
              </Button>
            </Box>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM")}</>;
      },
    },
    {
      headerText: "",
      key: "",
      CustomValue: (created_at) => {
        return (
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              height: "50px",
              width: "50px",

              borderRadius: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Payments style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (status) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "13px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {status}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Nome",
      key: "conta.nome",
      CustomValue: (nome) => {
        return <> {nome}</>;
      },
    },
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <Box width="85px">
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Box>
        );
      },
    },
  ];

  const itemColumnsWallet = [
    {
      headerText: "Data",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Id: {id}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "data_vencimento",
      CustomValue: (vencimento) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Vencimento: {moment.utc(vencimento).format("DD/MM/YYYY")}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "descricao",
      CustomValue: (descricao) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Descrição: {descricao}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "conta",
      CustomValue: (conta) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Nome: {conta.nome}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Valor: R${" "}
              {parseFloat(valor).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </>
        );
      },
    },
  ];

  const Editar = (row) => {
    return <CustomRoundedCard icon="pix" />;
  };

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        Aprovações
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
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            label=""
            InputProps={{
              endAdornment: (
                <SearchIcon
                  style={{
                    fontSize: "25px",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                />
              ),
            }}
          />
        </Box>
        <Box
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <CustomButton
            variant="contained"
            /* type="submit" */
            color="purple"
            onClick={() => {
              setOpenModal(true);
              setAprovarTodos(false);
              setCancelarSelecionado(false);
            }}
          >
            <Typography
              style={{
                fontSize: "15px",
                color: "white",
              }}
            >
              Aprovar selecionados
            </Typography>
          </CustomButton>
          <CustomButton
            variant="contained"
            /* type="submit" */
            color="purple"
            onClick={() => {
              setOpenModal(true);
              setAprovarTodos(true);
              setCancelarSelecionado(false);
            }}
          >
            <Typography
              style={{
                fontSize: "15px",
                color: "white",
              }}
            >
              Aprovar todos
            </Typography>
          </CustomButton>
        </Box>

        <Box
          style={{
            marginTop: "30px",
            marginBottom: "30px",
            width: "100%",
            padding: "10px",
          }}
        >
          {loading ? (
            <LinearProgress />
          ) : tipoAprovacao === "pagamentoPix" ? (
            <>
              {pagamentoPixAprovar?.data?.length > 0 ? (
                <>
                  <Box minWidth={!matches ? "500px" : null}>
                    <TableContainer
                      style={{
                        overflowX: "auto",
                        overflowY: "hidden",
                      }}
                    >
                      <CustomCollapseTablePix
                        checkBoxAprovacoes
                        itemColumns={itemColumnsPix}
                        data={pagamentoPixAprovar.data}
                        columns={columnsPix}
                        Editar={Editar}
                      />
                    </TableContainer>
                  </Box>
                  <Box
                    alignSelf="flex-end"
                    marginTop="8px"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Pagination
                      variant="outlined"
                      color="secondary"
                      size="large"
                      count={pagamentoPixAprovar.last_page}
                      onChange={handleChangePage}
                      page={page}
                    />
                    <Button
                      style={{
                        minWidth: "5px",
                        height: "40px",
                        borderRadius: "27px",
                        border: "solid",
                        borderWidth: "1px",
                        borderColor: "grey",
                      }}
                      onClick={() => window.location.reload()}
                    >
                      <RefreshIcon style={{ fontSize: 25, color: "grey" }} />
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography
                  style={{
                    textAlign: "center",
                  }}
                >
                  Não há pagamentos para serem aprovados.
                </Typography>
              )}
            </>
          ) : tipoAprovacao === "pagamentoConta" ? (
            <>
              {pagamentoAprovar?.data?.length > 0 ? (
                <>
                  <Box minWidth={!matches ? "500px" : null}>
                    <TableContainer
                      style={{
                        overflowX: "auto",
                        overflowY: "hidden",
                      }}
                    >
                      <CustomCollapseTablePix
                        itemColumns={itemColumnsPagamentos}
                        data={pagamentoAprovar.data}
                        columns={columnsPagamentos}
                        Editar={Editar}
                      />
                    </TableContainer>
                  </Box>

                  <Box
                    alignSelf="flex-end"
                    marginTop="8px"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Pagination
                      variant="outlined"
                      color="secondary"
                      size="large"
                      count={pagamentoAprovar.last_page}
                      onChange={handleChangePage}
                      page={page}
                    />
                    <Button
                      style={{
                        minWidth: "5px",
                        height: "40px",
                        borderRadius: "27px",
                        border: "solid",
                        borderWidth: "1px",
                        borderColor: "grey",
                      }}
                      onClick={() => window.location.reload()}
                    >
                      <RefreshIcon style={{ fontSize: 25, color: "grey" }} />
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography
                  style={{
                    textAlign: "center",
                  }}
                >
                  Não há pagamentos para serem aprovados.
                </Typography>
              )}
            </>
          ) : tipoAprovacao === "pagamentoTED" ? (
            <>
              {pagamentoTEDAprovar?.data?.length > 0 ? (
                <>
                  <Box minWidth={!matches ? "500px" : null}>
                    <TableContainer
                      style={{
                        overflowX: "auto",
                        overflowY: "hidden",
                      }}
                    >
                      <CustomCollapseTablePix
                        itemColumns={itemColumnsTED}
                        data={pagamentoTEDAprovar.data}
                        columns={columnsTED}
                        Editar={Editar}
                      />
                    </TableContainer>
                  </Box>
                  <Box
                    alignSelf="flex-end"
                    marginTop="8px"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Pagination
                      variant="outlined"
                      color="secondary"
                      size="large"
                      count={pagamentoTEDAprovar.last_page}
                      onChange={handleChangePage}
                      page={page}
                    />
                    <Button
                      style={{
                        minWidth: "5px",
                        height: "40px",
                        borderRadius: "27px",
                        border: "solid",
                        borderWidth: "1px",
                        borderColor: "grey",
                      }}
                      onClick={() => window.location.reload()}
                    >
                      <RefreshIcon style={{ fontSize: 25, color: "grey" }} />
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography
                  style={{
                    textAlign: "center",
                  }}
                >
                  Não há pagamentos para serem aprovados.
                </Typography>
              )}
            </>
          ) : tipoAprovacao === "pagamentoTransferencia" ? (
            <>
              {pagamentoTransferenciaAprovar?.data?.length > 0 ? (
                <>
                  <Box minWidth={!matches ? "500px" : null}>
                    <TableContainer
                      style={{
                        overflowX: "auto",
                        overflowY: "hidden",
                      }}
                    >
                      <CustomCollapseTablePix
                        itemColumns={itemColumnsP2P}
                        data={pagamentoTransferenciaAprovar.data}
                        columns={columnsP2P}
                        Editar={Editar}
                      />
                    </TableContainer>
                  </Box>
                  <Box
                    alignSelf="flex-end"
                    marginTop="8px"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Pagination
                      variant="outlined"
                      color="secondary"
                      size="large"
                      count={pagamentoTransferenciaAprovar.last_page}
                      onChange={handleChangePage}
                      page={page}
                    />
                    <Button
                      style={{
                        minWidth: "5px",
                        height: "40px",
                        borderRadius: "27px",
                        border: "solid",
                        borderWidth: "1px",
                        borderColor: "grey",
                      }}
                      onClick={() => window.location.reload()}
                    >
                      <RefreshIcon style={{ fontSize: 25, color: "grey" }} />
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography
                  style={{
                    textAlign: "center",
                  }}
                >
                  Não há pagamentos para serem aprovados.
                </Typography>
              )}
            </>
          ) : tipoAprovacao === "pagamentoWallet" ? (
            <>
              {pagamentoWalletAprovar?.data?.length > 0 ? (
                <>
                  <Box minWidth={!matches ? "500px" : null}>
                    <TableContainer
                      style={{
                        overflowX: "auto",
                        overflowY: "hidden",
                      }}
                    >
                      <CustomCollapseTablePix
                        itemColumns={itemColumnsWallet}
                        data={pagamentoWalletAprovar.data}
                        columns={columnsWallet}
                        Editar={Editar}
                      />
                    </TableContainer>
                  </Box>
                  <Box
                    alignSelf="flex-end"
                    marginTop="8px"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Pagination
                      variant="outlined"
                      color="secondary"
                      size="large"
                      count={pagamentoWalletAprovar.last_page}
                      onChange={handleChangePage}
                      page={page}
                    />
                    <Button
                      style={{
                        minWidth: "5px",
                        height: "40px",
                        borderRadius: "27px",
                        border: "solid",
                        borderWidth: "1px",
                        borderColor: "grey",
                      }}
                      onClick={() => window.location.reload()}
                    >
                      <RefreshIcon style={{ fontSize: 25, color: "grey" }} />
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography
                  style={{
                    textAlign: "center",
                  }}
                >
                  Não há pagamentos para serem aprovados.
                </Typography>
              )}
            </>
          ) : null}
        </Box>

        <ModalAprovadores
          show={showAprovadoresModal}
          setShow={setShowAprovadoresModal}
        />

        <Modal open={openModal} onBackdropClick={() => setOpenModal(false)}>
          <Box className={classes.modal}>
            <Box
              className={classes.closeModalButton}
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon />
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: "16px",
                  color: APP_CONFIG.mainCollors.primary,
                  fontWeight: "bold",
                }}
              >
                Preencha o campo com o token do seu aplicativo.
              </Typography>

              <ReactCodeInput
                value={dataToken}
                onChange={(e) => setDataToken(e)}
                type="number"
                fields={6}
                inputStyle={{
                  fontFamily: "monospace",
                  margin: "4px",
                  marginTop: "30px",
                  MozAppearance: "textfield",
                  width: "30px",
                  borderRadius: "28px",
                  fontSize: "20px",
                  height: "50px",
                  paddingLeft: "7px",

                  color: APP_CONFIG.mainCollors.primary,
                  border: `1px solid ${APP_CONFIG.mainCollors.primary}`,
                }}
              />
              {errors.token ? (
                <FormHelperText
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    fontFamily: "Montserrat-ExtraBold",
                    color: "red",
                  }}
                >
                  {errors.token.join(" ")}
                </FormHelperText>
              ) : null}

              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "30px",
                }}
              >
                <LoadingScreen isLoading={loading} />
                <Box style={{ marginTop: "10px" }}>
                  <CustomButton
                    variant="contained"
                    color="purple"
                    style={{ marginTop: "10px" }}
                    onClick={() =>
                      aprovarTodos
                        ? AprovarTodos()
                        : cancelarSelecionado
                          ? cancelarAprovacao()
                          : AprovarSelecionados()
                    }
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Aprovar
                    </Typography>
                  </CustomButton>
                </Box>
              </Box>
              <Box style={{ alignSelf: "center", marginTop: "50px" }}>
                <img
                  src={APP_CONFIG.assets.tokenImageSvg}
                  style={{ width: "80%" }}
                  alt="tokenImageSVG"
                />
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default AprovacoesContainer;
