import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../components/MenuOptionsTable";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  deleteCurso,
  getCursos,
  postCurso,
  updateCurso,
} from "../../services/beneficiarios";
import px2vw from "../../utils/px2vw";

moment.locale("pt-br");

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (created_at) => (
      <Typography>{moment.utc(created_at).format("DD/MM/YY")}</Typography>
    ),
  },
  {
    headerText: "ID",
    key: "id",
  },
  {
    headerText: "Nome",
    key: "nome",
  },
  { headerText: "", key: "menu" },
];

export default function ListaDeCursos() {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [filter, setFilter] = useState({
    nome: "",
    id: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
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

  const resetFilters = () => {
    setPage(1);
    setFilter({
      nome: "",
      id: "",
    });
  };

  const filters = `nome=${debouncedFilter.nome}&id=${debouncedFilter.id}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getCursos(token, page, filters);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCurso = async (id) => {
    setLoading(true);
    try {
      await deleteCurso(token, id);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  return (
    <Box className={useStyles.root}>
      <Box className={useStyles.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={useStyles.pageTitle}>Cursos</Typography>

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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Nome do curso"
                  variant="outlined"
                  value={filter.nome}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      nome: e.target.value,
                    }));
                  }}
                />
              </Grid>

              {/* <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="ID"
                  variant="outlined"
                  value={filter.id}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      id: e.target.value,
                    }));
                  }}
                />
              </Grid> */}

              <TableHeaderButton
                text="Limpar"
                onClick={resetFilters}
                Icon={Delete}
                color="red"
              />

              <TableHeaderButton
                text="Criar curso"
                onClick={() => setShow("create")}
                Icon={Add}
              />
            </Grid>
          </Box>
        </Box>

        <Box className={useStyles.tableContainer}>
          {!loading ? (
            <Box minWidth={!matches ? "800px" : null}>
              <CustomTable
                data={listaContas?.data ?? []}
                columns={columns}
                Editar={({ row }) => (
                  <Box style={{ display: "flex" }}>
                    <Edit
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                        fontSize: "28px",
                      }}
                      onClick={() => setShow(row)}
                    />
                    <MenuOptionsTable
                      row={row}
                      getData={getData}
                      deleteCallback={() => handleDeleteCurso(row?.id)}
                    />
                  </Box>
                )}
              />
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
      <NovoCadastro show={show} setShow={setShow} getData={getData} />
    </Box>
  );
}

function NovoCadastro({
  show = false, // "create" | {id, nome}
  setShow = () => false,
  getData = () => null,
}) {
  const token = useAuth();
  const [data, setData] = useState({
    nome: "",
  });
  const [loading, setLoading] = useState("");
  const update = show !== "create";

  const handleClose = () => {
    setShow(false);
    setData({});
  };

  const handleCriar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (update) await updateCurso(token, show?.id, data);
      else await postCurso(token, data);
      getData(token);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (update) setData({ nome: show?.nome ?? "" });
  }, [show]);

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />

      <DialogTitle id="form-dialog-title">
        {update ? "Editar" : "Cadastrar"} curso
      </DialogTitle>

      <form onSubmit={handleCriar}>
        <DialogContent style={{ overflow: "hidden" }}>
          {update && (
            <Typography style={{ marginBottom: "16px" }}>
              ID: {show?.id}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Nome do curso"
            variant="outlined"
            value={data.nome}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                nome: e.target.value,
              }));
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Enviar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
