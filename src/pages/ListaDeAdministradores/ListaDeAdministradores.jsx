import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import { toast } from "react-toastify";

import { Delete } from "@material-ui/icons";
import {
  delAdmin,
  getListaAdministradorAction,
  getReenviarTokenUsuarioAction,
} from "../../actions/actions";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import usePermission from "../../hooks/usePermission";
import { postCriarAdmin, putEditarAdmin } from "../../services/services";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const columns = [
  { headerText: "Nome", key: "nome" },
  { headerText: "Documento", key: "documento" },
  { headerText: "E-mail", key: "email" },
  { headerText: "Sigla", key: "sigla_programa" },
  {
    headerText: "Nascimento",
    key: "data_nascimento",
    CustomValue: (data) => {
      if (!data) return null;

      const date = new Date(data);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const [dia] = date.toLocaleDateString("pt-br", option).split(" ");
      return <Typography align="center">{dia}</Typography>;
    },
  },
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const date = new Date(data);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const [dia] = date.toLocaleDateString("pt-br", option).split(" ");
      return <Typography align="center">{dia}</Typography>;
    },
  },

  { headerText: "", key: "menu" },
];

export default function ListaDeAdministradores() {
  const dispatch = useDispatch();
  const token = useAuth();
  const classes = useStyles();
  const AbaGestao = APP_CONFIG.AbaGestao;
  const { hasPermission, PERMISSIONS } = usePermission();
  const listaAdministrador = useSelector((state) => state.listaAdministrador);
  const [open, setOpen] = useState(false); //Criar || Editar
  const [filters, setFilters] = useState({
    like: "",
    data_inicio: "",
    data_fim: "",
    created_at: "",
    mostrar: "15",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [editAdm, setEditAdm] = useState({});

  const resetFilters = () => {
    setPage(1);
    setFilters({
      like: "",
      data_inicio: "",
      data_fim: "",
      created_at: "",
      mostrar: "15",
    });
  };

  const filter = `data_inicio=${filters.data_inicio}&data_fim=${filters.data_fim}`;

  useEffect(() => {
    dispatch(
      getListaAdministradorAction(
        token,
        page,
        debouncedLike,
        "",
        filters.mostrar,
        filters.created_at,
        filter,
      ),
    );
  }, [page, debouncedLike, filters]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleExcluirAdmin = async (item) => {
      await dispatch(delAdmin(token, row.row.id));
    };

    const handlePermissions = () => {
      const path = generatePath(
        "/dashboard/lista-de-administradores/:id/permissoes",
        {
          id: row.row.id,
        },
      );
      history.push(path);
    };

    const handleProfiles = () => {
      const path = generatePath(
        "/dashboard/lista-de-administradores/:id/perfis",
        {
          id: row.row.id,
        },
      );
      history.push(path);
    };

    const handleEditAdmin = (row) => {
      setEditAdm(row?.row);
      setOpen("Editar");
    };

    const handleReenviarTokenUsuario = async (row) => {
      setLoading(true);
      const resReenviarToken = await dispatch(
        getReenviarTokenUsuarioAction(token, row.row.id),
      );
      if (resReenviarToken === false) {
        setDisabled(true);
        toast.success("Reenviado com sucesso");
        setLoading(false);
      } else {
        toast.error("Falha ao reenviar");
        setLoading(false);
      }
    };

    return (
      <Box>
        <IconButton
          style={{ height: "15px", width: "10px" }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <SettingsIcon
            style={{
              borderRadius: 33,
              fontSize: "35px",
              backgroundColor: APP_CONFIG.mainCollors.primary,
              color: "white",
            }}
          />
        </IconButton>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {AbaGestao ? null : (
            <MenuItem
              onClick={() => handlePermissions(row)}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
            >
              Permissões
            </MenuItem>
          )}

          <MenuItem
            onClick={() => handleProfiles(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.actions.manage_permissions,
              )
            }
          >
            Perfis
          </MenuItem>

          <MenuItem
            onClick={() => handleEditAdmin(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={!hasPermission(PERMISSIONS.administradores.actions.edit)}
          >
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => handleExcluirAdmin(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={
              !hasPermission(PERMISSIONS.administradores.actions.delete)
            }
          >
            Excluir
          </MenuItem>

          <MenuItem
            onClick={() => handleReenviarTokenUsuario(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={
              !hasPermission(PERMISSIONS.administradores.actions.resend_token)
            }
          >
            Reenviar Token de Confirmação
          </MenuItem>
        </Menu>
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
          <Typography className={classes.pageTitle}>Administradores</Typography>
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
              {hasPermission(PERMISSIONS.administradores.list.view) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      placeholder="Pesquisar por nome, documento, email..."
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        setPage(1);
                        setFilters({
                          ...filters,
                          like: e.target.value,
                        });
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Pesquisar por data"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      value={filters.created_at}
                      onChange={(e) => {
                        setPage(1);
                        setFilters((prev) => ({
                          ...prev,
                          created_at: e.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Pesquisar por data inicial"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      value={filters.data_inicio}
                      onChange={(e) => {
                        setPage(1);
                        setFilters((prev) => ({
                          ...prev,
                          data_inicio: e.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Pesquisar por data final"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      value={filters.data_fim}
                      onChange={(e) => {
                        setPage(1);
                        setFilters((prev) => ({
                          ...prev,
                          data_fim: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <InputLabel id="mostrar_label" shrink="true">
                      Itens por página
                    </InputLabel>
                    <Select
                      labelId="mostrar_label"
                      value={filters.mostrar}
                      onChange={(e) => {
                        setPage(1);
                        setFilters({ ...filters, mostrar: e.target.value });
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
                </>
              )}

              {hasPermission(PERMISSIONS.administradores.actions.create) && (
                <TableHeaderButton
                  text="Criar Administrador"
                  onClick={() => setOpen("Criar")}
                />
              )}
            </Grid>
          </Box>
        </Box>
      </Box>

      {hasPermission(PERMISSIONS.administradores.list.view) && (
        <Box className={classes.tableContainer}>
          {listaAdministrador.data && listaAdministrador.per_page ? (
            <CustomTable
              columns={columns}
              data={listaAdministrador.data}
              Editar={Editar}
            />
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
              count={listaAdministrador.last_page}
              onChange={handleChangePage}
              page={page}
            />
          </Box>
        </Box>
      )}

      <CreateEditAdmModal
        open={open}
        setOpen={setOpen}
        data={editAdm}
        getData={() => {
          dispatch(
            getListaAdministradorAction(
              token,
              page,
              debouncedLike,
              "",
              filters.mostrar,
              filter,
            ),
          );
        }}
      />
    </Box>
  );
}

function CreateEditAdmModal({ open, setOpen, data, getData }) {
  const token = useAuth();
  const [dadosAdministrador, setDadosAdministrador] = useState({
    nome: "",
    email: "",
    documento: "",
    data_nascimento: "",
    celular: "",
    sigla_programa: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setDadosAdministrador({
      nome: "",
      email: "",
      documento: "",
      data_nascimento: "",
      celular: "",
      sigla_programa: "",
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setErrors({});

    if (
      dadosAdministrador.nome === "" ||
      dadosAdministrador.email === "" ||
      dadosAdministrador.documento === "" ||
      dadosAdministrador.data_nascimento === "" ||
      dadosAdministrador.celular === "" ||
      dadosAdministrador.sigla_programa === ""
    ) {
      toast.warning("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      if (open === "Criar") {
        await postCriarAdmin(token, dadosAdministrador);
      } else {
        await putEditarAdmin(token, data?.id, dadosAdministrador);
      }

      toast.success("Token enviado com sucesso!");
      getData();
      handleClose();
    } catch (err) {
      console.log(err);
      setErrors(err?.response?.data?.errors ?? {});
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open === "Editar") {
      setDadosAdministrador({
        nome: data?.nome ?? "",
        email: data?.email ?? "",
        documento: data?.documento ?? "",
        data_nascimento: moment(data?.data_nascimento).format("YYYY-MM-DD"),
        celular: data?.celular ?? "",
        sigla_programa: data?.sigla_programa ?? "",
      });
    }
  }, [open]);

  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />

      <form onSubmit={(e) => handleSend(e)}>
        <DialogContent>
          <DialogTitle id="form-dialog-title">{open} Administrador</DialogTitle>

          <DialogContentText>
            Para {open} um administrador preencha os campos abaixo.{" "}
            {open === "Criar" && "Enviaremos um token logo em seguida."}
          </DialogContentText>

          <TextField
            InputLabelProps={{ shrink: true }}
            value={dadosAdministrador.nome}
            onChange={(e) =>
              setDadosAdministrador({
                ...dadosAdministrador,
                nome: e.target.value,
              })
            }
            margin="dense"
            label="Nome"
            fullWidth
            required
            autoFocus
          />

          <TextField
            InputLabelProps={{ shrink: true }}
            value={dadosAdministrador.email}
            onChange={(e) =>
              setDadosAdministrador({
                ...dadosAdministrador,
                email: e.target.value,
              })
            }
            error={errors.email ? errors.email : null}
            helperText={errors.email ? errors.email.join(" ") : null}
            margin="dense"
            label="E-mail"
            fullWidth
            required
          />

          <InputMask
            maskChar=""
            mask={"999.999.999-99"}
            value={dadosAdministrador.documento}
            onChange={(e) =>
              setDadosAdministrador({
                ...dadosAdministrador,
                documento: e.target.value,
              })
            }
          >
            {() => (
              <TextField
                InputLabelProps={{ shrink: true }}
                inputProps={{ backgroundColor: "black" }}
                error={errors.documento ? errors.documento : null}
                helperText={
                  errors.documento ? errors.documento.join(" ") : null
                }
                label="Documento"
                fullWidth
                required
              />
            )}
          </InputMask>

          <TextField
            label="Data de nascimento"
            value={dadosAdministrador.data_nascimento}
            onChange={(e) =>
              setDadosAdministrador({
                ...dadosAdministrador,
                data_nascimento: e.target.value,
              })
            }
            type="date"
            InputLabelProps={{
              shrink: true,
              pattern: "d {4}- d {2}- d {2} ",
            }}
            error={errors.data_nascimento ? errors.data_nascimento : null}
            helperText={
              errors.data_nascimento ? errors.data_nascimento.join(" ") : null
            }
            margin="dense"
            fullWidth
            required
          />

          <InputMask
            maskChar=""
            mask="(99) 99999-9999"
            value={dadosAdministrador.celular}
            onChange={(e) =>
              setDadosAdministrador({
                ...dadosAdministrador,
                celular: e.target.value,
              })
            }
          >
            {() => (
              <TextField
                InputLabelProps={{ shrink: true }}
                inputProps={{ backgroundColor: "black" }}
                error={errors.celular ? errors.celular : null}
                helperText={errors.celular ? errors.celular.join(" ") : null}
                label="Celular"
                fullWidth
                required
              />
            )}
          </InputMask>

          <TextField
            label="Sigla do programa"
            value={dadosAdministrador.sigla_programa}
            onChange={(e) =>
              setDadosAdministrador({
                ...dadosAdministrador,
                sigla_programa: e.target.value,
              })
            }
            InputLabelProps={{ shrink: true }}
            error={errors.sigla_programa ? errors.sigla_programa : null}
            helperText={
              errors.sigla_programa ? errors.sigla_programa.join(" ") : null
            }
            margin="dense"
            fullWidth
            required
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Enviar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
