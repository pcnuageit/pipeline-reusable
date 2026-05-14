import {
  Box,
  Checkbox,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check, Close, Delete } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";

import { loadUserData } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getCartoes, postLiberarCartoes } from "../../services/beneficiarios";

import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import SelectCidade from "../../components/SelectCidade";
import TableHeaderButton from "../../components/TableHeaderButtons/TableHeaderButton";
import usePermission from "../../hooks/usePermission";
import { documentMask } from "../../utils/documentMask";
import { errorMessageHelper } from "../../utils/errorMessageHelper";

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
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    boxShadow: "none",
    borderRadius: "0px",
    alignSelf: "center",
  },
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
  dropzoneAreaBaseClasses: {
    width: "70%",
    height: "250px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
  },
  dropzoneContainer: {
    margin: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px",
    minHeight: "422px",
    fontSize: "12px",
  },
  textoDropzone: {
    fontSize: "1.2rem",
    color: APP_CONFIG.mainCollors.primary,
  },
}));

export default function LiberarCartoes() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const me = useSelector((state) => state.me);
  const id = me?.conta_id ?? "";
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(false);
  const [listaCartoes, setListaCartoes] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    tipo_beneficio_id: "",
    documento: "",
    cidade: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [registros, setRegistros] = useState([]);
  const [aprovarTodos, setAprovarTodos] = useState(false);
  const [showAprovarModal, setShowAprovarModal] = useState(false);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      tipo_beneficio_id: "",
      documento: "",
      cidade: "",
      mostrar: "15",
    });
  };

  const filters = `tipo_beneficio_id=${filter.tipo_beneficio_id}&documento=${filter.documento}&status=aguardando&cidade=${filter.cidade}&mostrar=${filter.mostrar}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getCartoes(token, page, "", filters);
      setListaCartoes(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const selected = listaCartoes?.data?.map((obj) => obj?.id);
    setRegistros(selected);
  };

  const handleLiberarCartao = async (dataToken) => {
    setLoading(true);
    try {
      await postLiberarCartoes(token, id, registros, aprovarTodos, filters);

      toast.success("Cartões liberados");
      setRegistros([]);
      await getData(token, 1);
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    } finally {
      setShowAprovarModal(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [dispatch, token]);

  useEffect(() => {
    getData(page);
  }, [token, page, debouncedFilter]);

  const columns = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box>
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
      headerText: "ID",
      key: "external_id",
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
              {valor || "Processando"}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "FINAL",
      key: "external_msk",
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
              {valor ? valor?.replace(/\*/g, "") : "Processando"}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "SALDO",
      key: "concorrencia_saldo.valor",
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
              R${" "}
              {parseFloat(valor).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </>
        );
      },
    },
    { headerText: "STATUS", key: "status" },
    { headerText: "NOME", key: "user.nome" },
    {
      headerText: "CPF",
      key: "user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "CIDADE",
      key: "user.concorrencia_endereco.cidade",
    },
  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Liberar Cartões" />

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
                  borderRadius: 27,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box style={{ marginTop: "30px", margin: 30 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <ReactInputMask
                        mask={"999.999.999-99"}
                        value={filter.documento}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            documento: e.target.value,
                          });
                        }}
                        maskChar={null}
                      >
                        {() => (
                          <TextField
                            fullWidth
                            placeholder="Pesquisar por beneficiário"
                            variant="outlined"
                          />
                        )}
                      </ReactInputMask>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <SelectBeneficio
                        state={filter?.tipo_beneficio_id}
                        setState={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            tipo_beneficio_id: e.target.value,
                          }));
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <SelectCidade
                        state={filter?.cidade}
                        setState={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            cidade: e.target.value,
                          }));
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <InputLabel id="mostrar_label" shrink="true">
                        Itens por página
                      </InputLabel>
                      <Select
                        labelId="mostrar_label"
                        value={filter.mostrar}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({ ...filter, mostrar: e.target.value });
                        }}
                        variant="outlined"
                        fullWidth
                      >
                        <MenuItem value={"15"}>15</MenuItem>
                        <MenuItem value={"30"}>30</MenuItem>
                        <MenuItem value={"45"}>45</MenuItem>
                        <MenuItem value={"50"}>50</MenuItem>
                      </Select>
                    </Grid>

                    <TableHeaderButton
                      text="Limpar"
                      onClick={resetFilters}
                      Icon={Delete}
                      color="red"
                    />

                    <TableHeaderButton
                      text="Selecionar todos"
                      onClick={handleSelectAll}
                      Icon={Check}
                      disabled={!hasPermission()}
                    />

                    <TableHeaderButton
                      text="Aprovar Selecionados"
                      onClick={() => {
                        setAprovarTodos(false);
                        setShowAprovarModal(true);
                      }}
                      Icon={Check}
                      disabled={!hasPermission()}
                    />

                    <TableHeaderButton
                      text="Aprovar todos"
                      onClick={() => {
                        setAprovarTodos(true);
                        setShowAprovarModal(true);
                      }}
                      disabled={!hasPermission()}
                    />
                  </Grid>
                </Box>

                <Box
                  display="flex"
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Box
                    style={{
                      width: "100%",
                      borderTopRightRadius: 27,
                      borderTopLeftRadius: 27,
                    }}
                  >
                    {!loading && listaCartoes.data && listaCartoes.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns}
                            data={listaCartoes.data}
                          />
                        </Box>

                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={listaCartoes.last_page}
                            onChange={(e, v) => setPage(v)}
                            page={page}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <LinearProgress color="primary" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <ModalLiberarCartoes
        aprovarTodos={aprovarTodos}
        show={showAprovarModal}
        setShow={setShowAprovarModal}
        handleAprovar={handleLiberarCartao}
      />
    </Box>
  );
}

export function ModalLiberarCartoes({
  aprovarTodos = false,
  show = false,
  setShow = () => null,
  handleAprovar = () => null,
}) {
  const classes = useStyles();
  const [dataToken, setDataToken] = useState("");
  const [clicked, setClicked] = useState(false);

  const handelCLickDebounce = () => {
    setClicked(true);
    setTimeout(() => {
      setDataToken("");
      setClicked((prev) => !prev);
    }, 2000);
  };

  return (
    <Modal open={show} onClose={() => setShow(false)}>
      <Box className={classes.modal}>
        <Box
          className={classes.closeModalButton}
          onClick={() => setShow(false)}
        >
          <Close />
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
            color="primary"
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {aprovarTodos
              ? "Você irá liberar TODOS os cartões"
              : "Você irá liberar apenas os cartões selecionados"}
          </Typography>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
            }}
          >
            <Box style={{ marginTop: "10px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  handelCLickDebounce();
                  handleAprovar(dataToken);
                }}
                disabled={clicked}
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
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <img
              src={APP_CONFIG.assets.tokenImageSvg}
              style={{ width: "60%" }}
              alt={"Imagem do token"}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
