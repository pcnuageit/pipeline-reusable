import {
  Box,
  Checkbox,
  Grid,
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
import ReactInputMask from "react-input-mask";
import CustomTable from "../../components/CustomTable/CustomTable";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import "../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getContas } from "../../services/services";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";
import px2vw from "../../utils/px2vw";
import { setTableFilters } from "./";

moment.locale("pt-br");

export default function EstabelecimentosTable({ registros, setRegistros }) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    like: "",
    id: "",
    seller: "",
    status: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
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
    { headerText: "", key: "menu" },
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {moment.utc(data).format("DD")}&nbsp;
              {moment.utc(data).format("MMMM")}&nbsp;
              {moment.utc(data).format("YYYY")}
            </Typography>
            <Typography
              style={{
                display: "flex",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {moment.utc(data).format("HH:mm")}h
            </Typography>
          </Box>
        );
      },
    },
    { headerText: "E-mail", key: "email" },
    {
      headerText: "Empresa",
      key: "",
      FullObject: (data) => {
        return <Typography>{data.razao_social ?? data.nome}</Typography>;
      },
    },
    { headerText: "Tipo", key: "tipo" },
    {
      headerText: "Documento",
      key: "",
      FullObject: (data) => {
        return (
          <Typography>{documentMask(data.cnpj ?? data.documento)}</Typography>
        );
      },
    },
    {
      headerText: "Contato",
      key: "celular",
      CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
    },
  ];

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      like: "",
      id: "",
      seller: "",
      status: " ",
      numero_documento: "",
      tipo: " ",
      cnpj: "",
    });
  };

  const filters = `&like=${filter?.like}&id=${filter?.id}&seller=${filter?.seller}&status=${filter?.status}&numero_documento=${filter?.numero_documento}&tipo=${filter?.tipo}&cnpj=${filter?.cnpj}&status_adquirencia=&solicitado_adquirencia=false&agent_id=&is_estabelecimento=true&is_gestao_concorrencia=false`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getContas(
        token,
        page,
        filter.like,
        "",
        "",
        filter.id,
        filter.seller,
        filter.status,
        filter.numero_documento,
        filter.tipo,
        filter.cnpj,
        "",
        false,
        "",
        true,
        false
      );
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
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por nome, documento, email..."
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
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

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por ID Seller/Holder"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.seller}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      seller: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Select
                  style={{
                    marginTop: "10px",
                    color: APP_CONFIG.mainCollors.secondary,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filter.tipo}
                  onChange={(e) =>
                    setFilter({ ...filter, tipo: e.target.value })
                  }
                >
                  <MenuItem
                    value={" "}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Tipo
                  </MenuItem>
                  <MenuItem
                    value={"1"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pessoa Física
                  </MenuItem>
                  <MenuItem
                    value={"2"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pessoa Jurídica
                  </MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Select
                  style={{
                    marginTop: "10px",
                    color: APP_CONFIG.mainCollors.secondary,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filter.status}
                  onChange={(e) =>
                    setFilter({ ...filter, status: e.target.value })
                  }
                >
                  <MenuItem
                    value={" "}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Status
                  </MenuItem>
                  <MenuItem
                    value={"active"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Ativo
                  </MenuItem>
                  <MenuItem
                    value={"approved"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Aprovado
                  </MenuItem>
                  <MenuItem
                    value={"divergence"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Divergência
                  </MenuItem>
                  <MenuItem
                    value={"pending"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pendente
                  </MenuItem>
                  <MenuItem
                    value={"incomplete"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Incompleto
                  </MenuItem>
                  <MenuItem
                    value={"refused"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Recusado
                  </MenuItem>
                  <MenuItem
                    value={"deleted"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Encerrado
                  </MenuItem>
                  <MenuItem
                    value={"denied"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Negado
                  </MenuItem>
                  <MenuItem
                    value={"block"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Bloqueado
                  </MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por ID"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.id}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      id: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por nº de documento"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.numero_documento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      numero_documento: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <ReactInputMask
                  mask={"99.999.999/9999-99"}
                  value={filter.cnpj}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      cnpj: e.target.value,
                    });
                  }}
                >
                  {() => (
                    <TextField
                      fullWidth
                      placeholder="Pesquisar por CNPJ"
                      size="small"
                      variant="outlined"
                      style={{
                        marginRight: "10px",
                      }}
                    />
                  )}
                </ReactInputMask>
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
