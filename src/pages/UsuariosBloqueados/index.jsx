import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import SelectBeneficio from "../../components/SelectBeneficio";
import SelectCidade from "../../components/SelectCidade";
import TableHeaderButton from "../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../constants/config";
import "../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  getBeneficiariosBloqueados,
  postBeneficiarioDesbloquear,
} from "../../services/beneficiarios";
import { documentMask } from "../../utils/documentMask";
import px2vw from "../../utils/px2vw";

moment.locale("pt-br");

export default function UsuariosBloqueados() {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    like: "",
    documento: "",
    razao_social: "",
    conta_id: "",
    tipo_beneficio_id: [],
    cidade: [],
    numero_inscricao: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [registros, setRegistros] = useState([]);
  const [showModalDesbloquear, setShowModalDesbloquear] = useState(false);
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
    setRegistros([]);
    setFilter({
      like: "",
      documento: "",
      razao_social: "",
      conta_id: "",
      tipo_beneficio_id: [],
      cidade: [],
      numero_inscricao: "",
      mostrar: "15",
    });
  };

  const filters = `like=${filter.like}&documento=${filter.documento}&razao_social=${filter.razao_social}&conta_id=${filter.conta_id}&tipo_beneficio_id=${JSON.stringify(filter.tipo_beneficio_id)}&cidade=${JSON.stringify(filter.cidade)}&numero_inscricao=${filter.numero_inscricao}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getBeneficiariosBloqueados(token, page, filters);
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
      headerText: "Nome",
      key: "nome",
      CustomValue: (nome) => (
        <Typography>{nome}</Typography>
      ),
    },
    {
      headerText: "Documento",
      key: "",
      FullObject: (obj) => (
        <Typography>
          {documentMask(obj?.conta?.cnpj ?? obj?.conta?.documento, true)}
        </Typography>
      ),
    },
    {
      headerText: "Email",
      key: "conta.email",
    },
    {
      headerText: "Benefício",
      key: "",
      FullObject: (obj) => (
        <Typography align="center">
          {obj?.concorrencia_conta[0]?.tipo_beneficio?.nome_beneficio ??
            obj?.concorrencia_cartao[0]?.tipo_beneficio?.nome_beneficio}
        </Typography>
      ),
    },
    {
      headerText: "Cidade",
      key: "concorrencia_endereco.cidade",
    },
    {
      headerText: "Tentativas de login",
      key: "login_attempts_count",
      CustomValue: (v) => (
        <Typography align="center">{v}</Typography>
      ),
    },
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (text) => (
        <Typography align="center">
          {moment(text).format("DD/MM/YYYY")}
        </Typography>
      ),
    },
    // { headerText: "", key: "menu" },
  ];

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
          <Typography className={useStyles.pageTitle}>
            Usuários Bloqueados
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
            <Grid
              container
              spacing={3}
              style={{ alignItems: "center", marginBottom: "8px" }}
            >
              <Grid item xs={12} sm={4}>
                <TextField
                  placeholder="Pesquisar por nome, documento, email..."
                  value={filter.like}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      like: e.target.value,
                    }));
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextFieldCpfCnpj
                  placeholder="Pesquisar por CPF"
                  value={filter.documento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      documento: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  placeholder="Pesquisar por razão social"
                  value={filter.razao_social}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      razao_social: e.target.value,
                    }));
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  placeholder="Pesquisar por número de inscrição"
                  value={filter.numero_inscricao}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      numero_inscricao: e.target.value,
                    }));
                  }}
                  variant="outlined"
                  fullWidth
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
                  state={filter.cidade}
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
                text="Desbloquear Selecionados"
                onClick={() => setShowModalDesbloquear(true)}
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
                  // Editar={({ row }) => (
                  //   <MenuOptionsTable
                  //     row={row}
                  //     getData={getData}
                  //   />
                  // )}
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

      <NovoCadastro
        show={showModalDesbloquear}
        setShow={setShowModalDesbloquear}
        getData={getData}
        registros={registros}
      />
    </Box>
  );
}

function NovoCadastro({
  show = false,
  setShow = () => false,
  getData = () => null,
  registros = [],
}) {
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postBeneficiarioDesbloquear(token, registros);
      getData(token);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />

      <DialogTitle id="form-dialog-title">Desbloquear usuários</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent style={{ overflow: "hidden" }}>
          Você deseja desbloquear {registros.length} usuário
          {registros.length === 1 ? "" : "s"}?
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Desbloquear
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
