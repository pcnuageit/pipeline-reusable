import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getContasAction, postNotificacaoAction } from "../../actions/actions";

import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";
import { Pagination } from "@material-ui/lab";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";

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

const Notificacoes = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
    id: "",
    seller: "",
    status: " ",
    status_adquirencia: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const debouncedNumeroDocumento = useDebounce(filters.numero_documento, 800);
  const listaContas = useSelector((state) => state.contas);
  const [dadosNotificacao, setDadosNotificacao] = useState({
    titulo: "",
    mensagem: "",
  });
  const [registros, setRegistros] = useState([]);
  const [rowId, setRowId] = useState("");
  const [cancelarSelecionado, setCancelarSelecionado] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getContasAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        "",
        "",
        filters.status,
        debouncedNumeroDocumento,
        filters.tipo,
        filters.cnpj
      )
    );
  }, [
    page,
    debouncedLike,
    filters.order,
    filters.mostrar,

    filters.status,
    filters.status_adquirencia,
    debouncedNumeroDocumento,
    filters.tipo,
    filters.cnpj,
  ]);

  const handleEnviarNotificacao = async () => {
    setLoading(true);
    const resEnviarNotificacao = await dispatch(
      postNotificacaoAction(
        token,
        dadosNotificacao.titulo,
        dadosNotificacao.mensagem,
        registros,
        false,
        ""
      )
    );
    if (resEnviarNotificacao) {
      setErrors(resEnviarNotificacao);
      setLoading(false);
      toast.error("Erro ao enviar notificação");
      setOpen(false);
    } else {
      setLoading(false);
      toast.success("Notificação enviada!");
      setOpen(false);
    }
  };

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
        {/* 	<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={() => handlePermissions(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Permissões
					</MenuItem>
					<MenuItem
						onClick={() => handleExcluirAdmin(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Excluir
					</MenuItem>

					<MenuItem
						onClick={() => handleReenviarTokenUsuario(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Reenviar Token de Confirmação
					</MenuItem>
				</Menu> */}
      </Box>
    );
  };
  const columns = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                marginRight: "0px",
                justifyContent: "space-around",
              }}
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
    { headerText: "Nome", key: "nome" },
    {
      headerText: "Documento",
      key: "",
      FullObject: (data) => (
        <Typography>{documentMask(data.cnpj ?? data.documento)}</Typography>
      ),
    },
    { headerText: "E-mail", key: "email" },
  ];
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
          <Typography className={classes.pageTitle}>Notificações</Typography>

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
            display: "flex",
            /* backgroundColor: APP_CONFIG.mainCollors.backgrounds, */
            justifyContent: "left",
            marginBottom: "10px",
            alignItems: "center",
          }}
        >
          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            Enviar notificação para:
          </Typography>
          <Box style={{ marginLeft: "20px", display: "flex" }}>
            <Box>
              <CustomButton
                color="purple"
                onClick={() => {
                  registros.length > 0
                    ? setOpen(true)
                    : toast.warning(
                        "Selecione ao menos uma pessoa para enviar a notificação"
                      );
                }}
              >
                <Box display="flex" alignItems="center">
                  Selecionados
                </Box>
              </CustomButton>
            </Box>
            <Box style={{ marginLeft: "10px" }}>
              <CustomButton
                color="purple"
                onClick={() => {
                  setOpen(true);
                  setRegistros([]);
                }}
              >
                <Box display="flex" alignItems="center">
                  Todos
                </Box>
              </CustomButton>
            </Box>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignContent="center"
            alignItems="center"
            style={{ margin: 30 }}
          >
            <TextField
              placeholder="Pesquisar por nome, documento..."
              size="small"
              variant="outlined"
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                width: "400px",
              }}
              /* onChange={(e) =>
							
							setFilters({
								...filters,
								like: e.target.value,
							})
						} */
              onChange={(e) => {
                setPage(1);
                setFilters({
                  ...filters,
                  like: e.target.value,
                });
              }}
            ></TextField>
          </Box>
        </Box>
      </Box>

      <Box className={classes.tableContainer}>
        {listaContas.data && listaContas.per_page ? (
          <Box minWidth={!matches ? "800px" : null}>
            <CustomTable
              columns={columns ? columns : null}
              data={listaContas.data}
              Editar={Editar}
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
            count={listaContas.last_page}
            onChange={handleChangePage}
            page={page}
          />
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Enviar Notificação</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Para enviar uma notificação preencha os campos abaixo.
          </DialogContentText>

          <TextField
            label="Título"
            value={dadosNotificacao.titulo}
            onChange={(e) =>
              setDadosNotificacao({
                ...dadosNotificacao,
                titulo: e.target.value,
              })
            }
            error={errors.titulo ? errors.titulo : null}
            helperText={errors.titulo ? errors.titulo.join(" ") : null}
            InputLabelProps={{ shrink: true }}
            fullWidth
            autoFocus
          />

          <TextField
            label="Mensagem"
            value={dadosNotificacao.nome}
            onChange={(e) =>
              setDadosNotificacao({
                ...dadosNotificacao,
                mensagem: e.target.value,
              })
            }
            error={errors.mensagem ? errors.mensagem : null}
            helperText={errors.mensagem ? errors.mensagem.join(" ") : null}
            fullWidth
            InputLabelProps={{ shrink: true }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button color="primary" onClick={() => handleEnviarNotificacao()}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notificacoes;
