import { Checkbox } from "@chakra-ui/react";
import {
  Box,
  FormHelperText,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { /* Checkbox, */ Pagination } from "@mui/material";
import { find, isEmpty } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteFolhaDePagamentoFuncionarioAction,
  getFolhaDePagamentoShowAction,
  getFuncionarioAction,
  getFuncionarioGrupoAction,
  loadUserData,
  postFolhaPagamentoAction,
  postFolhaPagamentoFuncionarioMultiAction,
  postPagamentoAprovarAction,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomEmployeeCard from "../../components/CustomEmployeeCard/CustomEmployeeCard";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";

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

  inputLabelNoShrink: {
    transform: "translate(45px, 15px) scale(1)",
  },
  currencyInput: {
    borderColor: APP_CONFIG.mainCollors.primary,
    borderTopColor: APP_CONFIG.mainCollors.primary,
    borderWidth: 3,
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

export default function CadastrarFolhaDePagamento() {
  const classes = useStyles();
  const theme = useTheme();
  const { subsectionId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const userType = useSelector((state) => state.userType);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
    day: " ",
    order: "",
    mostrar: "",
    tipo: "",
  });

  const userData = useSelector((state) => state.userData);
  const listaFuncionarios = useSelector((state) => state.funcionarios);
  const listaGrupos = useSelector((state) => state.grupos);
  const folhaDePagamentoShow = useSelector(
    (state) => state.folhaDePagamentoShow,
  );
  const [page, setPage] = useState(1);
  const [hoveredCards, setHoveredCards] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [errors, setErrors] = useState("");
  const [buscarLike, setBuscarLike] = useState("");
  const debouncedLike = useDebounce(buscarLike, 800);
  const [openModal, setOpenModal] = useState(false);
  const [openModalGrupo, setOpenModalGrupo] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [grupo_id, setGrupo_id] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const shrink = buscarLike.length > 0;
  const [dataToken, setDataToken] = useState("");
  const [registro, setRegistro] = useState([]);
  const [dadosPagamento, setDadosPagamento] = useState({
    data_pagamento: "",
    descricao: "",
  });
  const naming = userType.isBanking ? "funcionários" : "beneficiários";
  const cards = [
    { icon: "personAdd", title: `Selecionando ${naming}` },
    { icon: "groupAdd", title: "Selecionando grupos" },
  ];

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(getFuncionarioAction(token, grupo_id, page, debouncedLike));
  }, [token, grupo_id, page, debouncedLike]);

  useEffect(() => {
    dispatch(getFuncionarioGrupoAction(token));
  }, [token]);

  useEffect(() => {
    const fetch = async () => {
      const { funcionarios } = await dispatch(
        getFolhaDePagamentoShowAction(token, subsectionId),
      );
      setFuncionarios(
        funcionarios &&
          funcionarios.map((item) => {
            return {
              conta_funcionario_id: item.conta_funcionario_id,
              tipo_pagamento:
                item.tipo_pagamento === "Salário"
                  ? 1
                  : item.tipo_pagamento === "Férias"
                    ? 2
                    : item.tipo_pagamento === "13º"
                      ? 3
                      : item.tipo_pagamento === "Bônus"
                        ? 4
                        : item.tipo_pagamento === "Benefícios"
                          ? 5
                          : null,
              valor_pagamento: Number(item.valor_pagamento),
            };
          }),
      );
    };
    if (subsectionId) {
      fetch();
    }
  }, [token, subsectionId]);

  const handleRedirectCadastrarFuncionarios = () => {
    const path = generatePath(
      "/dashboard/folha-de-pagamento/acao/cadastrar-funcionarios-e-grupos",
    );
    history.push(path);
  };

  const handleSelecionarGrupo = async () => {
    await dispatch(
      getFuncionarioAction(token, grupo_id, "", buscarLike, "", ""),
    );
    setOpenModalGrupo(false);
  };

  const handleIncluir = async (autorizar) => {
    setLoading(true);
    const resFolhaPagamento = await dispatch(
      postFolhaPagamentoAction(
        token,
        subsectionId
          ? folhaDePagamentoShow.data_pagamento
          : dadosPagamento.data_pagamento,
        subsectionId
          ? folhaDePagamentoShow.descricao
          : dadosPagamento.descricao,
      ),
    );
    if (resFolhaPagamento) {
      const resFolhaPagamentoFuncionarioMulti = await dispatch(
        postFolhaPagamentoFuncionarioMultiAction(
          token,
          funcionarios,
          resFolhaPagamento.id,
        ),
      );
      if (resFolhaPagamentoFuncionarioMulti) {
        toast.success("Folha de pagamento criada com sucesso");
        if (autorizar) {
          setRegistro([resFolhaPagamento.id]);
          setOpenModal(true);
        }
        setLoading(false);
      } else {
        toast.error("Falha ao criar folha de pagamento múltipla");
        setErrors(resFolhaPagamentoFuncionarioMulti);
        setLoading(false);
      }
    } else {
      toast.error("Falha ao criar folha de pagamento");
      setLoading(false);
    }
  };

  const handleEditar = async (autorizar) => {
    const resFolhaPagamentoFuncionarioMulti = await dispatch(
      postFolhaPagamentoFuncionarioMultiAction(
        token,
        funcionarios,
        subsectionId,
      ),
    );
    if (resFolhaPagamentoFuncionarioMulti) {
      toast.success("Folha de pagamento criada com sucesso");
      if (autorizar) {
        setRegistro([subsectionId]);
        setOpenModal(true);
      }
      setLoading(false);
    } else {
      toast.error("Falha ao criar folha de pagamento múltipla");
      setErrors(resFolhaPagamentoFuncionarioMulti);
      setLoading(false);
    }
  };

  const handleAutorizar = async () => {
    setLoading(true);
    const resAutorizar = await dispatch(
      postPagamentoAprovarAction(token, true, false, registro, dataToken),
    );
    if (resAutorizar) {
      toast.error("Error ao autorizar folha de pagamento");
      setErrors(resAutorizar);
      setLoading(false);
    } else {
      toast.success("Folha de pagamento autorizada com sucesso");
      setOpenModal(false);
      setLoading(false);
    }
  };

  const handleExcluirFuncionario = async (
    conta_funcionario_id,
    funcionarioId,
  ) => {
    if (
      folhaDePagamentoShow.funcionarios.find(
        (item) => item.conta_funcionario_id === conta_funcionario_id,
      )
    ) {
      await dispatch(
        deleteFolhaDePagamentoFuncionarioAction(token, funcionarioId),
      );
    }
  };

  const validateCheckAll = () => {
    if (funcionarios && funcionarios.length && funcionarios.data) {
      if (funcionarios.length === listaFuncionarios.data.length) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleCheckAll = () => {
    if (listaFuncionarios.data && listaFuncionarios.data.length > 0) {
      if (!isEmpty(funcionarios)) {
        setFuncionarios([]);
      } else {
        setFuncionarios(
          listaFuncionarios.data.map((item) => {
            return {
              conta_funcionario_id: item.conta_funcionario_id,
              tipo_pagamento: "",
              valor_pagamento: "",
            };
          }),
        );
      }
    }
  };

  const columns = [
    {
      headerText: "",
      key: "",
      FullObject: (data) => {
        return (
          <Checkbox
            defaultValue={funcionarios.find(
              (item) => item.conta_funcionario_id === data.conta_funcionario_id,
            )}
            style={{
              color: APP_CONFIG.mainCollors.primary,
              border: "solid",
              borderWidth: 2,
              borderRadius: 2,
              borderColor: "#5F5F5F",
              width: "23px",
              height: "23px",
            }}
            isChecked={funcionarios.find(
              (item) => item.conta_funcionario_id === data.conta_funcionario_id,
            )}
            onChange={() => {
              if (
                funcionarios.find(
                  (item) =>
                    item.conta_funcionario_id === data.conta_funcionario_id,
                )
              ) {
                setFuncionarios(
                  funcionarios.filter(
                    (item) =>
                      item.conta_funcionario_id !== data.conta_funcionario_id,
                  ),
                );
                if (subsectionId) {
                  handleExcluirFuncionario(
                    data.conta_funcionario_id,
                    data.funcionario.id,
                  );
                }
              } else {
                setFuncionarios([
                  ...funcionarios,
                  {
                    conta_funcionario_id: data.conta_funcionario_id,
                    tipo_pagamento: "",
                    valor_pagamento: "",
                  },
                ]);
              }
            }}
          />
        );
      },
    },

    {
      headerText: "NOME",
      key: "funcionario.nome",
    },
    {
      headerText: "CPF",
      key: "funcionario.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "TIPO DE PAGAMENTO",
      key: "conta_funcionario_id",
      CustomValue: (conta_funcionario_id, index) => {
        return (
          <>
            <Select
              style={{ color: APP_CONFIG.mainCollors.secondary }}
              variant="outlined"
              fullWidth
              /* 	error={
								errors.tipo_pagamento
									? find(
											funcionarios,
											(item) =>
												item.conta_funcionario_id ===
												conta_funcionario_id
									  )?.errors.tipo_pagamento || ' '
									: null
							} */
              /* helperText={
								find(
									funcionarios,
									(item) =>
										item.conta_funcionario_id === conta_funcionario_id
								)?.errors.tipo_pagamento
									? errors.tipo_pagamento
									: '' || ' '
							} */
              value={
                find(
                  funcionarios,
                  (item) => item.conta_funcionario_id === conta_funcionario_id,
                )?.tipo_pagamento || " "
              }
              onChange={(e) =>
                setFuncionarios(
                  funcionarios.map((item) => {
                    return item.conta_funcionario_id === conta_funcionario_id
                      ? {
                          ...item,
                          tipo_pagamento: Number(e.target.value),
                        }
                      : item;
                  }),
                )
              }
            >
              <MenuItem
                value={" "}
                style={{ color: APP_CONFIG.mainCollors.secondary }}
              >
                Selecionar
              </MenuItem>

              <MenuItem
                value={"1"}
                style={{ color: APP_CONFIG.mainCollors.secondary }}
              >
                Salário
              </MenuItem>
              <MenuItem
                value={"2"}
                style={{ color: APP_CONFIG.mainCollors.secondary }}
              >
                Férias
              </MenuItem>
              <MenuItem
                value={"3"}
                style={{ color: APP_CONFIG.mainCollors.secondary }}
              >
                13º
              </MenuItem>
              <MenuItem
                value={"4"}
                style={{ color: APP_CONFIG.mainCollors.secondary }}
              >
                Bônus
              </MenuItem>
              <MenuItem
                value={"5"}
                style={{ color: APP_CONFIG.mainCollors.secondary }}
              >
                Benefícios
              </MenuItem>
            </Select>
          </>
        );
      },
    },
    {
      headerText: "VALOR DO PAGAMENTO",
      key: "conta_funcionario_id",
      CustomValue: (conta_funcionario_id) => {
        return (
          <>
            <CurrencyInput
              className={classes.currencyInput}
              variant="outlined"
              style={{
                /* width: '80%', */
                alignSelf: "center",
                textAlign: "center",
                height: 45,
                fontSize: 15,
                borderRadius: 27,
                borderWidth: 1,

                borderColor: APP_CONFIG.mainCollors.primary,
                borderTopColor: APP_CONFIG.mainCollors.primary,
                color: APP_CONFIG.mainCollors.primary,
                backgroundColor: "transparent",
                fontFamily: "Montserrat-Regular",
              }}
              decimalSeparator=","
              thousandSeparator="."
              prefix="R$ "
              onChangeEvent={(event, maskedvalue, floatvalue) =>
                setFuncionarios(
                  funcionarios.map((item) => {
                    return item.conta_funcionario_id === conta_funcionario_id
                      ? {
                          ...item,
                          valor_pagamento: Number(floatvalue),
                        }
                      : item;
                  }),
                )
              }
              value={
                find(
                  funcionarios,
                  (item) => item.conta_funcionario_id === conta_funcionario_id,
                )?.valor_pagamento || ""
              }
            />
          </>
        );
      },
    },
  ];

  const Editar = (row) => {
    return <Box></Box>;
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "50px",
            marginLeft: "50px",
          }}
          component={Link}
          onClick={() => history.goBack()}
        >
          <ArrowBackIosIcon
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontSize: "30px",
            }}
          />
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,

              marginLeft: "15px",
            }}
          >
            {subsectionId
              ? `Editar ${userType.isBanking ? "folha de" : ""} pagamento`
              : `Inclusão de pagamento de ${
                  userType.isBanking ? "salários" : "benefícios"
                }`}
          </Typography>
        </Box>

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
                width: "90%",
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
                    marginTop: "10px",
                    marginLeft: "40px",
                  }}
                >
                  Como você deseja incluir o pagamento?
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  marginLeft: "40px",
                  marginBottom: "50px",
                }}
              >
                {cards.map((item, index) => (
                  <Box
                    onMouseOver={() => setHoveredCards(index)}
                    onMouseLeave={() => setHoveredCards(null)}
                    onClick={() => {
                      if (index === 0) {
                        setGrupo_id("");
                      }
                      if (index === 1) {
                        setOpenModalGrupo(true);
                      }

                      setSelectedCard(index === selectedCard ? null : index);
                    }}
                  >
                    <CustomEmployeeCard
                      cardStyle={
                        index === selectedCard
                          ? true
                          : index === hoveredCards
                            ? true
                            : false
                      }
                      icon={item.icon}
                      title={item.title}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                marginTop: "10px",
                borderRadius: "17px",
                flexDirection: "column",
                width: "90%",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
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
                    marginTop: "10px",
                    marginLeft: "40px",
                  }}
                >
                  {subsectionId
                    ? `Adicione ou remova ${naming} dessa folha de pagamento`
                    : `Selecionar ${naming} para pagamento`}
                </Typography>
                <Box
                  style={{
                    alignSelf: "center",
                    marginTop: "10px",
                    width: "99%",
                    height: "1px",
                    backgroundColor: APP_CONFIG.mainCollors.primary,
                  }}
                />
              </Box>
              <Box
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  fullWidth
                  value={buscarLike}
                  onChange={(e) => setBuscarLike(e.target.value)}
                  InputLabelProps={{
                    shrink: shrink,
                    className: shrink ? undefined : classes.inputLabelNoShrink,
                  }}
                  variant="outlined"
                  label="Buscar por nome, CPF, agência ou conta..."
                  style={{ width: "100%" }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        style={{
                          fontSize: "30px",
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      />
                    ),
                  }}
                />
                <Box
                  style={{
                    display: "flex",
                    marginTop: "20px",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    isChecked={validateCheckAll()}
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                      border: "solid",
                      borderWidth: 2,
                      borderRadius: 2,
                      borderColor: "#5F5F5F",
                      width: "23px",
                      height: "23px",
                    }}
                    color="primary"
                    onChange={() => handleCheckAll()}
                  />
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginLeft: "10px",
                    }}
                  >
                    Selecionar todos os {naming} dessa página
                  </Typography>
                </Box>
                <Box style={{ display: "flex", justifyContent: "end" }}>
                  <CustomButton
                    variant="contained"
                    /* type="submit" */
                    color="purple"
                    onClick={() => handleRedirectCadastrarFuncionarios()}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "10px",
                        color: "white",
                      }}
                    >
                      CADASTRAR NOVO {naming.slice(0, -1).toUpperCase()}
                    </Typography>
                  </CustomButton>
                </Box>
                <Box style={{ marginTop: "30px" }}>
                  {listaFuncionarios.data &&
                  listaFuncionarios.data.length > 0 ? (
                    <>
                      <Box minWidth={!matches ? "800px" : null}>
                        <CustomTable
                          columns={columns ? columns : null}
                          data={listaFuncionarios.data}
                          Editar={Editar}
                        />
                      </Box>
                      <Box alignSelf="flex-end" marginTop="8px">
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={listaFuncionarios.last_page}
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
                <Box
                  style={{
                    alignSelf: "center",
                    marginTop: "30px",
                    width: "99%",
                    height: "1px",
                    backgroundColor: APP_CONFIG.mainCollors.primary,
                  }}
                />
                <Box style={{ marginTop: "20px" }}>
                  <Typography
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      fontSize: "16px",
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Dados do pagamento
                  </Typography>
                  <Box style={{ marginTop: "30px", width: "175px" }}>
                    <TextField
                      disabled={subsectionId}
                      variant="outlined"
                      InputLabelProps={{
                        color: APP_CONFIG.mainCollors.secondary,
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type={subsectionId ? "" : "date"}
                      value={
                        subsectionId
                          ? moment
                              .utc(folhaDePagamentoShow.data_pagamento)
                              .format("DD MMM YYYY")
                          : dadosPagamento.data_pagamento
                      }
                      onChange={(e) =>
                        setDadosPagamento({
                          ...dadosPagamento,
                          data_pagamento: e.target.value,
                        })
                      }
                    />
                  </Box>
                  <Box style={{ marginTop: "30px", width: "175px" }}>
                    <TextField
                      disabled={subsectionId}
                      variant="outlined"
                      label={subsectionId ? "" : "Descrição"}
                      onChange={(e) =>
                        setDadosPagamento({
                          ...dadosPagamento,
                          descricao: e.target.value,
                        })
                      }
                      value={
                        subsectionId
                          ? folhaDePagamentoShow.descricao
                          : dadosPagamento.descricao
                      }
                    />
                  </Box>
                  <Box style={{ display: "flex", marginTop: "40px" }}>
                    {subsectionId ? (
                      <CustomButton
                        variant="contained"
                        /* type="submit" */
                        color="purple"
                        onClick={() => handleEditar(false)}
                      >
                        <Typography
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: "16px",
                            color: "white",
                          }}
                        >
                          Editar
                        </Typography>
                      </CustomButton>
                    ) : (
                      <>
                        <CustomButton
                          variant="contained"
                          /* type="submit" */
                          color="purple"
                          onClick={() => handleIncluir(false)}
                        >
                          <Typography
                            style={{
                              fontFamily: "Montserrat-Regular",
                              fontSize: "10px",
                              color: "white",
                            }}
                          >
                            APENAS INCLUIR
                          </Typography>
                        </CustomButton>
                        <Box style={{ marginLeft: "20px" }}>
                          <CustomButton
                            variant="contained"
                            /* type="submit" */
                            color="purple"
                            onClick={() => handleIncluir(true)}
                          >
                            <Typography
                              style={{
                                fontFamily: "Montserrat-Regular",
                                fontSize: "10px",
                                color: "white",
                              }}
                            >
                              INCLUIR E AUTORIZAR
                            </Typography>
                          </CustomButton>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <Modal
                open={openModal}
                onBackdropClick={() => setOpenModal(false)}
              >
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
                          onClick={() => handleAutorizar()}
                        >
                          <Typography
                            style={{
                              fontFamily: "Montserrat-Regular",
                              fontSize: "14px",
                              color: "white",
                            }}
                          >
                            Autorizar
                          </Typography>
                        </CustomButton>
                      </Box>
                    </Box>
                    <Box
                      style={{
                        alignSelf: "center",
                        marginTop: "50px",
                      }}
                    >
                      <img
                        src={APP_CONFIG.assets.tokenImageSvg}
                        style={{ width: "80%" }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Modal>
              <Modal
                open={openModalGrupo}
                onBackdropClick={() => {
                  setOpenModalGrupo(false);
                }}
              >
                <Box className={classes.modal}>
                  <Box
                    className={classes.closeModalButton}
                    onClick={() => {
                      setOpenModalGrupo(false);
                    }}
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
                    <Box style={{ display: "flex" }}>
                      <Typography
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          fontSize: "16px",
                          color: APP_CONFIG.mainCollors.primary,
                          fontWeight: "bold",
                        }}
                      >
                        Selecione um grupo
                      </Typography>
                    </Box>
                    <Box
                      style={{
                        width: "400px",
                        height: "500px",
                        display: "flex",
                        marginTop: "30px",
                        alignContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      {listaGrupos.data
                        ? listaGrupos.data.map((item, index) => (
                            <Box
                              style={{
                                height: "50px",
                                width: "300px",
                                border: "solid",
                                borderWidth: 1,
                                borderRadius: 17,
                                borderColor: APP_CONFIG.mainCollors.primary,
                                display: "flex",
                                marginTop: "10px",
                                alignSelf: "center",
                                alignItems: "center",
                              }}
                            >
                              <Checkbox
                                style={{
                                  color: APP_CONFIG.mainCollors.primary,
                                  border: "solid",
                                  borderWidth: 2,
                                  borderRadius: 2,
                                  borderColor: "#5F5F5F",
                                  width: "23px",
                                  height: "23px",
                                  marginLeft: "10px",
                                }}
                                color="primary"
                                checked={selectedGroup === index}
                                onChange={() => {
                                  setSelectedGroup(
                                    index === selectedGroup ? null : index,
                                  );
                                  setGrupo_id(item.id);
                                }}
                              />
                              <Typography
                                style={{
                                  fontFamily: "Montserrat-ExtraBold",
                                  fontSize: "16px",
                                  color: APP_CONFIG.mainCollors.primary,
                                  alignSelf: "center",
                                  marginLeft: "10px",
                                }}
                              >
                                {item.nome}
                              </Typography>
                            </Box>
                          ))
                        : null}
                    </Box>

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
                          onClick={() => {
                            handleSelecionarGrupo();
                          }}
                        >
                          <Typography
                            style={{
                              fontFamily: "Montserrat-Regular",
                              fontSize: "14px",
                              color: "white",
                            }}
                          >
                            Selecionar
                          </Typography>
                        </CustomButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Modal>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
