import {
  Box,
  Checkbox,
  FormHelperText,
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
import { makeStyles } from "@material-ui/styles";
import { Delete } from "@mui/icons-material";
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
  getFolhaDePagamentoAprovarConcAction,
  setAutorizarPagamentoModal,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import TableHeaderButton from "../../components/TableHeaderButtons/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { postFolhaPagamentoAprovarConc } from "../../services/services";
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
}));

moment.locale();

export default function ListaFolhaDePagamentoAutorizar() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    created_at: "",
    like: "",
    mostrar: "15",
  });
  const debouncedFilters = useDebounce(filter, 800);
  const autorizarTodos = useSelector((state) => state.autorizarTodos);
  const listaFolhaDePagamentoAprovar = useSelector(
    (state) => state.folhaDePagamentoAprovarConc,
  );
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(1);

  const resetFilter = () => {
    setPage(1);
    setFilter({
      created_at: "",
      like: "",
      mostrar: "15",
    });
  };

  const filters = `created_at=${filter.created_at}&like=${filter.like}&mostrar=${filter.mostrar}`;

  useEffect(() => {
    dispatch(getFolhaDePagamentoAprovarConcAction(token, page, filters));
  }, [token, page, debouncedFilters]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

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
      key: "cartao.user.nome",
      CustomValue: (nome) => (
        <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
      ),
    },
    // {
    // 	headerText: 'Agência',
    // 	key: 'conta.agencia',
    // 	CustomValue: (documento) => (
    // 		<Typography style={{ lineBreak: 'anywhere' }}>
    // 			{documento}
    // 		</Typography>
    // 	),
    // },
    // {
    // 	headerText: 'Conta',
    // 	key: 'conta.conta',
    // 	CustomValue: (celular) => (
    // 		<Typography style={{ lineBreak: 'anywhere' }}>{celular}</Typography>
    // 	),
    // },
    {
      headerText: "Email",
      key: "cartao.user.email",
      CustomValue: (email) => (
        <Typography style={{ lineBreak: "anywhere" }}>{email}</Typography>
      ),
    },
    {
      headerText: "CPF",
      key: "cartao.user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "Contato",
      key: "cartao.user.celular",
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
        <Typography style={{ lineBreak: "loose" }}>{"Benefício"}</Typography>
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
          pageTitle="Autorizar Pagamento"
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
              }}
            >
              <Box
                style={{
                  width: "100%",
                  borderRadius: 27,
                }}
              >
                <Grid container spacing={3} style={{ margin: "30px" }}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Pesquisar por data"
                      size="small"
                      variant="outlined"
                      style={{
                        marginRight: "10px",
                      }}
                      InputLabelProps={{
                        color: APP_CONFIG.mainCollors.secondary,
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      value={filter.created_at}
                      onChange={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          created_at: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pesquisar por nome, documento, email..."
                      size="small"
                      variant="outlined"
                      value={filter.like}
                      onChange={(e) => {
                        setPage(1);
                        setFilter({
                          ...filter,
                          like: e.target.value,
                        });
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
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
                    onClick={resetFilter}
                    Icon={Delete}
                    color="red"
                  />
                </Grid>

                {listaFolhaDePagamentoAprovar?.data &&
                  listaFolhaDePagamentoAprovar?.per_page ? (
                  <>
                    <Box minWidth={!matches ? "800px" : null}>
                      <CustomCollapseTable
                        columns={columns}
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

      <AprovarModal
        autorizarTodos={autorizarTodos}
        setRegistros={setRegistros}
        registros={registros}
      />
    </Box>
  );
}

function AprovarModal({ autorizarTodos, setRegistros, registros }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAprovarModalOpen = useSelector((state) => state.autorizarModal);
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [dataToken, setDataToken] = useState("");
  const [errors, setErrors] = useState({});

  const handleAprovarPagamento = async () => {
    if (registros.length === 0 && !autorizarTodos) {
      dispatch(setAutorizarPagamentoModal(false));
      toast.warn("Selecione algum pagamento para aprovar.");
      return;
    }

    setLoading(true);
    try {
      await postFolhaPagamentoAprovarConc(
        token,
        true,
        autorizarTodos,
        registros,
        dataToken,
      );

      toast.success(
        autorizarTodos
          ? "Todos os pagamentos foram aprovados"
          : "Os pagamentos selecionados foram aprovados",
      );
      setRegistros([]);
      dispatch(getFolhaDePagamentoAprovarConcAction(token));
      dispatch(setAutorizarPagamentoModal(false));
    } catch (err) {
      console.log(err);
      setErrors(err?.response?.data?.errors);
      toast.error("Falha ao aprovar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(setAutorizarPagamentoModal(false));
    setDataToken("");
    setErrors({});
  };

  return (
    <Modal open={!!isAprovarModalOpen} onClose={handleClose}>
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

          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: "#F1C40F",
              fontWeight: "bold",
            }}
          >
            {autorizarTodos
              ? "Você irá autorizar TODOS os pagamentos"
              : "Você irá autorizar apenas os pagamentos selecionados"}
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
          {errors?.token ? (
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

        <LoadingScreen loading={loading} />
      </Box>
    </Modal>
  );
}
