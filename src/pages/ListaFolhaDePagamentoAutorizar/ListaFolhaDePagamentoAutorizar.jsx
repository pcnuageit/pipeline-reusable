import {
  Box,
  Checkbox,
  FormHelperText,
  LinearProgress,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getFolhaDePagamentoAprovarAction,
  loadUserData,
  postFolhaPagamentoAprovarAction,
  setAutorizarPagamentoModal,
  setHeaderLike,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

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
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    boxShadow: "none",
    borderRadius: "0px",
    alignSelf: "center",
    modal: {
      outline: " none",
      display: "flex",
      flexDirection: "column",
      alignSelf: "center",
      position: "absolute",
      top: "10%",
      left: "35%",
      width: "30%",
      height: "80%",
      backgroundColor: "white",
      border: "0px solid #000",
      boxShadow: 24,
    },

    closeModalButton: {
      alignSelf: "end",
      padding: "5px",
      "&:hover": {
        backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
        cursor: "pointer",
      },
    },
  },
}));

const a11yProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default function ListaFolhaDePagamentoAutorizar() {
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
  const autorizarModal = useSelector((state) => state.autorizarModal);
  const autorizarTodos = useSelector((state) => state.autorizarTodos);
  const headerLike = useSelector((state) => state.headerLike);
  const listaFolhaDePagamentoAprovar = useSelector(
    (state) => state.folhaDePagamentoAprovar,
  );
  const [errors, setErrors] = useState("");
  const [registros, setRegistros] = useState([]);
  const [dataToken, setDataToken] = useState("");
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(getFolhaDePagamentoAprovarAction(token, page, headerLike));
  }, [token, page, headerLike]);

  useEffect(() => {
    return () => {
      dispatch(setHeaderLike(""));
    };
  }, []);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleAprovarPagamento = async () => {
    setLoading(true);
    if (autorizarTodos) {
      const resAutorizarTodos = await dispatch(
        postFolhaPagamentoAprovarAction(token, true, true, [], dataToken),
      );
      if (resAutorizarTodos) {
        setErrors(resAutorizarTodos);
        toast.error("Falha ao aprovar pagamento");
        setLoading(false);
      } else {
        dispatch(getFolhaDePagamentoAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setLoading(false);
        dispatch(setAutorizarPagamentoModal(false));
      }
    }
    if (autorizarTodos === false) {
      const resAutorizarSelecionados = await dispatch(
        postFolhaPagamentoAprovarAction(
          token,
          true,
          false,
          registros,
          dataToken,
        ),
      );
      if (resAutorizarSelecionados) {
        setErrors(resAutorizarSelecionados);
        toast.error("Falha ao aprovar pagamento");
        setLoading(false);
      } else {
        dispatch(getFolhaDePagamentoAprovarAction(token));
        toast.success("Pagamentos aprovados");
        setLoading(false);
        dispatch(setAutorizarPagamentoModal(false));
      }
    }
  };

  const columns = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box
            /* style={{
								display: 'flex',
								alignSelf: 'center',
								
								justifyContent: 'flex-end',
							}} */
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
            </Box>
          </>
        );
      },
    },
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
      },
    },
    { headerText: "DESCRIÇÃO", key: "descricao" },
    { headerText: "STATUS", key: "status_aprovado" },
    {
      headerText: "DATA DE PAGAMENTO",
      key: "data_pagamento",
      CustomValue: (data_pagamento) => {
        return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
      },
    },
    { headerText: "", key: "menu" },
  ];

  const itemColumns = [
    {
      headerText: "Nome",
      key: "conta.nome",
      CustomValue: (nome) => (
        <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
      ),
    },
    {
      headerText: "Agência",
      key: "conta.agencia",
      CustomValue: (documento) => (
        <Typography style={{ lineBreak: "anywhere" }}>{documento}</Typography>
      ),
    },
    {
      headerText: "Conta",
      key: "conta.conta",
      CustomValue: (celular) => (
        <Typography style={{ lineBreak: "anywhere" }}>{celular}</Typography>
      ),
    },
    {
      headerText: "Email",
      key: "conta.email",
      CustomValue: (email) => (
        <Typography style={{ lineBreak: "anywhere" }}>{email}</Typography>
      ),
    },
    {
      headerText: "CPF",
      key: "conta.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "Contato",
      key: "conta.celular",
      CustomValue: (celular) => (
        <Typography style={{ lineBreak: "anywhere" }}>
          {celular ? phoneMask(celular) : "*"}
        </Typography>
      ),
    },
    {
      headerText: "Tipo Pagamento",
      key: "conta.documento",
      CustomValue: (tipo_pagamento) => (
        <Typography style={{ lineBreak: "loose" }}>{tipo_pagamento}</Typography>
      ),
    },
    {
      headerText: "Valor",
      key: "valor_pagamento",
      CustomValue: (valor) => (
        <Typography style={{ lineBreak: "loose" }}>
          R$
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      ),
    },
    {
      headerText: "Status Transação",
      key: "status",
      CustomValue: (status) => (
        <Typography style={{ lineBreak: "loose" }}>{status}</Typography>
      ),
    },
  ];

  const Editar = (row) => {
    const handleEditarFolha = () => {
      const path = generatePath("cadastrar-folha-de-pagamento/:id", {
        id: row.row.id,
      });
      history.push(path);
    };

    return (
      <Box>
        <Box style={{ display: "flex" }}>
          <Box onClick={() => handleEditarFolha()}>
            <EditIcon
              style={{
                fontSize: "25px",

                color: APP_CONFIG.mainCollors.primary,
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Autorizar Pagamento de Salários"
          isSearchVisible={true}
          routeForCreatePayroll
          autorizarButtons
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
                alignItems: "center",
                borderRadius: "17px",
                flexDirection: "column",
                minWidth: "100%",

                /* alignItems: 'center', */
              }}
            >
              <Box
                style={{
                  width: "100%",

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
                  <Box
                    style={
                      value === 3
                        ? {
                            width: "100%",
                            borderTopRightRadius: 27,
                            borderTopLeftRadius: 27,
                          }
                        : {
                            width: "100%",
                            borderTopRightRadius: 27,
                            borderTopLeftRadius: 27,
                          }
                    }
                  >
                    {listaFolhaDePagamentoAprovar.data &&
                    listaFolhaDePagamentoAprovar.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomCollapseTable
                            columns={columns ? columns : null}
                            itemColumns={itemColumns}
                            data={listaFolhaDePagamentoAprovar.data}
                            Editar={Editar}
                          />
                        </Box>
                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={listaFolhaDePagamentoAprovar.last_page}
                            onChange={handleChangePage}
                            page={page}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <LinearProgress color="secondary" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal
        open={autorizarModal}
        onBackdropClick={() => dispatch(setAutorizarPagamentoModal(false))}
      >
        <Box className={classes.modal}>
          <Box
            className={classes.closeModalButton}
            onClick={() => dispatch(setAutorizarPagamentoModal(false))}
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
            {autorizarTodos ? (
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: "16px",
                  color: "#F1C40F",
                  fontWeight: "bold",
                }}
              >
                Você irá autorizar TODOS os pagamentos
              </Typography>
            ) : (
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: "16px",
                  color: "#F1C40F",
                  fontWeight: "bold",
                }}
              >
                Você irá autorizar apenas os pagamentos selecionados
              </Typography>
            )}

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
                  onClick={() => handleAprovarPagamento()}
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
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
