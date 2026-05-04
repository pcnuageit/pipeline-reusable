import {
  Box,
  Checkbox,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check, Delete } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable/CustomTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import SelectCidade from "../../components/SelectCidade";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import "../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getBeneficiarios } from "../../services/beneficiarios";
import { documentMask } from "../../utils/documentMask";
import px2vw from "../../utils/px2vw";
import { setTableFilters } from "./";

moment.locale("pt-br");

export default function BeneficiariosTable({ registros, setRegistros }) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    razao_social: "",
    celular: "",
    tipo_beneficio_id: [],
    cidade: [],
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

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
  }))();

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
    { headerText: "Nome", key: "nome" },
    { headerText: "Secretaria", key: "conta.razao_social" },
    {
      headerText: "CPF",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "Cidade", key: "concorrencia_endereco.cidade" },
    { headerText: "Inscrição", key: "numero_inscricao" },
    {
      headerText: "PROGRAMAS",
      key: "",
      FullObject: (obj) => {
        const parseData = () => {
          const p = [];
          if (!obj) return p;

          obj?.concorrencia_cartao?.forEach((obj) => {
            p.push(obj?.tipo_beneficio?.nome_beneficio);
          });
          obj?.concorrencia_conta?.forEach((obj) => {
            p.push(obj?.tipo_beneficio?.nome_beneficio);
          });

          return p;
        };

        return (
          <>
            {parseData()?.map((item) => (
              <Typography>{item}</Typography>
            ))}
          </>
        );
      },
    },
  ];

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      nome: "",
      documento: "",
      razao_social: "",
      celular: "",
      tipo_beneficio_id: [],
      cidade: [],
      mostrar: "15",
    });
  };

  const filters = `conta_id=&nome=${filter.nome}&documento=${
    filter.documento
  }&celular=${filter.celular}&razao_social=${
    filter.razao_social
  }&tipo_beneficio_id=${JSON.stringify(
    filter.tipo_beneficio_id
  )}&cidade=${JSON.stringify(filter.cidade)}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getBeneficiarios(token, "", page, filters);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const selected = listaContas?.data?.map((obj) => obj?.id);
    setRegistros(selected);
  };

  useEffect(() => {
    getData(token, page);
    setTableFilters(filters);
  }, [token, page, debouncedFilter]);

  return (
    <Box className={useStyles.root}>
      <Box className={useStyles.headerContainer}>
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
                  placeholder="Pesquisar por celular"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.celular}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({ ...prev, celular: e.target.value }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por secretaria"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.razao_social}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      razao_social: e.target.value,
                    }));
                  }}
                />
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
                  multiple
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
                  multiple
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
                color="red"
                Icon={Delete}
              />

              <TableHeaderButton
                text="Selecionar todos"
                onClick={handleSelectAll}
                Icon={Check}
              />
            </Grid>
          </Box>
        </Box>

        <Box className={useStyles.tableContainer}>
          {!loading && listaContas?.data && listaContas?.per_page ? (
            <Box minWidth={!matches ? "800px" : null}>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable
                  columns={columns}
                  data={listaContas?.data}
                  Editar={() => null}
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
    </Box>
  );
}
