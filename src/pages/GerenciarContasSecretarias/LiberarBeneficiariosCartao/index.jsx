import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  LinearProgress,
  TableContainer,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check, Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { makeStyles } from "@material-ui/styles";
import EditIcon from "@mui/icons-material/Edit";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  getCartoes,
  postLiberarCartoes,
} from "../../../services/beneficiarios";
import { errorMessageHelper } from "../../../utils/errorMessageHelper";
import px2vw from "../../../utils/px2vw";

import CustomCurrencyInput from "../../../components/CustomCurrencyInput";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { ModalManager } from "../../../components/ModalManager";
import SelectBeneficio from "../../../components/SelectBeneficio";
import SelectCidade from "../../../components/SelectCidade";
import TableHeaderButton from "../../../components/TableHeaderButton";
import { documentMask } from "../../../utils/documentMask";

moment.locale();

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

export default function LiberarBeneficiariosCartao() {
  const id = useParams()?.id ?? "";
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    external_id: "",
    external_msk: "",
    nome: "",
    documento: "",
    tipo_beneficio_id: "",
    cidade: "",
    cidade_cartao: "",
    // data_inicio: "",
    // data_fim: "",
    created_at: "",
    saldo: "",
    curso: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [aprovarTodos, setAprovarTodos] = useState(false);
  const [showAprovarModal, setShowAprovarModal] = useState(false);

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      external_id: "",
      external_msk: "",
      nome: "",
      documento: "",
      tipo_beneficio_id: "",
      cidade: "",
      cidade_cartao: "",
      created_at: "",
      saldo: "",
      curso: "",
    });
  };

  const filters = `conta_id=${id}&external_id=${filter.external_id}&external_msk=${filter.external_msk}&status=aguardando&nome=${filter.nome}&documento=${filter.documento}&tipo_beneficio_id=${filter.tipo_beneficio_id}&cidade=${filter.cidade}&cidade_cartao=${filter.cidade_cartao}&created_at=${debouncedFilter.created_at}&saldo=${debouncedFilter.saldo}&curso=${filter.curso}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getCartoes(token, id, page, "", filters);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    let arr = [];
    listaContas?.data.forEach((e) => {
      arr.push(e?.id);
    });
    setRegistros(arr);
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  const handleLiberarCartao = async (dataToken) => {
    setLoading(true);
    console.log(dataToken);
    try {
      
      await postLiberarCartoes(
        token,
        id,
        registros,
        aprovarTodos,
        aprovarTodos ? filter?.tipo_beneficio_id : "",
        filters,
        dataToken
      );

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
      headerText: "Data de criação",
      key: "created_at",
      CustomValue: (created_at) => {
        return (
          <Typography>
            {moment.utc(created_at).format("DD MMMM YYYY")}
          </Typography>
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
    { headerText: "BENEFÍCIO", key: "tipo_beneficio.nome_beneficio" },
    {
      headerText: "Cidade do Beneficiário",
      key: "user.concorrencia_endereco.cidade",
    },
    {
      headerText: "Cidade do Cartão",
      key: "municipio",
    },
    // { headerText: "", key: "menu" },
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
      <Box className={classes.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>Liberar Cartões</Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <RefreshIcon />
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
            <Grid
              container
              spacing={3}
              style={{ alignItems: "center", marginBottom: "8px" }}
            >
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por ID"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.external_id}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      external_id: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por final"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.external_msk}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      external_msk: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por nome"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.nome}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({ ...prev, nome: e.target.value }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por documento"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.documento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      documento: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <SelectBeneficio
                  state={filter.tipo_beneficio_id}
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
                  label="Cidade do Beneficiário"
                  state={filter.cidade}
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
                <SelectCidade
                  label="Cidade do Cartão"
                  state={filter.cidade_cartao}
                  setState={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      cidade_cartao: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  label="Data de criação"
                  value={filter.created_at}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      created_at: e.target.value,
                    });
                  }}
                />
              </Grid>

              <CustomCurrencyInput
                value={filter.saldo}
                onChangeEvent={(event, maskedvalue, floatvalue) => {
                  setPage(1);
                  setFilter({
                    ...filter,
                    saldo: floatvalue,
                  });
                }}
              />

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por curso"
                  variant="outlined"
                  value={filter.curso}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      curso: e.target.value,
                    }));
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <TableHeaderButton
                Icon={Delete}
                text="Limpar"
                color="red"
                onClick={resetFilters}
              />

              <TableHeaderButton
                text="Selecionar todos"
                onClick={handleSelectAll}
                Icon={Check}
              />

              <TableHeaderButton
                text="Aprovar Selecionados"
                onClick={() => {
                  setAprovarTodos(false);
                  setShowAprovarModal(true);
                }}
                Icon={Check}
              />

              <TableHeaderButton
                text="Aprovar todos"
                onClick={() => {
                  setAprovarTodos(true);
                  setShowAprovarModal(true);
                }}
              />
            </Grid>
          </Box>
        </Box>

        <Box className={classes.tableContainer}>
          {!loading && listaContas?.data && listaContas?.per_page ? (
            <Box minWidth={!matches ? "800px" : null}>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable
                  columns={columns ? columns : null}
                  data={listaContas.data}
                  Editar={Editar}
                />
              </TableContainer>
            </Box>
          ) : (
            <Box>
              <LinearProgress color="secondary" />
            </Box>
          )}

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
              count={listaContas?.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </Box>
        </Box>
      </Box>

      <ModalManager.SenhaAprovar
        aprovarTodos={aprovarTodos}
        show={showAprovarModal}
        setShow={setShowAprovarModal}
        handleAprovarPagamento={handleLiberarCartao}
        customText="cartões"
      />
    </Box>
  );
}
