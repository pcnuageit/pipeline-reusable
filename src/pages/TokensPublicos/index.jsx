import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  TableContainer,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import moment from "moment";
import "moment/locale/pt-br";
import { useCallback, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch } from "react-redux";

import { postAuthMeAction } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import "../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../hooks/useAuth";
import px2vw from "../../utils/px2vw";

import { Add, Delete } from "@material-ui/icons";
import { CopyAll } from "@mui/icons-material";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTable from "../../components/CustomTable/CustomTable";
import usePermission from "../../hooks/usePermission";
import {
  deleteTokenPublico,
  getTokensPublicos,
  postCriarTokenPublico,
} from "../../services/services";

moment.locale("pt-br");

const columns = [
  {
    headerText: "ID",
    key: "id",
  },
  {
    headerText: "Data",
    key: "created_at",
    CustomValue: (value) => moment.utc(value).format("DD/MM/YYYY HH:mm"),
  },
  { headerText: "Nome", key: "name" },
  {
    headerText: "Último uso",
    key: "last_used_at",
    CustomValue: (value) =>
      value ? moment.utc(value).format("DD/MM/YYYY HH:mm") : "Nunca",
  },
  { headerText: "", key: "menu" },
];

export default function TokensPublicos() {
  const token = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const [listaTokens, setListaTokens] = useState([]);
  const [showModalCreateToken, setShowModalCreateToken] = useState(false);
  const [showModalDeleteToken, setShowModalDeleteToken] = useState(false);
  const [showModalCopyToken, setShowModalCopyToken] = useState(false);
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

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getTokensPublicos(token);
      setListaTokens(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getDataCallback = useCallback(getData, [token]);

  useEffect(() => {
    getDataCallback();
  }, [getDataCallback]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

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
            Tokens Públicos
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
            <Grid container spacing={3}>
              {hasPermission(PERMISSIONS.tokens_publicos.actions.generate) && (
                <CustomButton
                  color="purple"
                  onClick={() => setShowModalCreateToken(true)}
                >
                  <Box display="flex" alignItems="center">
                    <Add />
                    Gerar token
                  </Box>
                </CustomButton>
              )}
            </Grid>
          </Box>
        </Box>

        {hasPermission(PERMISSIONS.tokens_publicos.list.view) && (
          <Box className={useStyles.tableContainer}>
            {!loading ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={listaTokens}
                    Editar={({ row }) => (
                      <Delete
                        style={{ color: "red" }}
                        onClick={() => setShowModalDeleteToken(row)}
                      />
                    )}
                  />
                </TableContainer>
              </Box>
            ) : (
              <Box>
                <LinearProgress color="secondary" />
              </Box>
            )}
          </Box>
        )}
      </Box>

      <ModalCreateToken
        show={showModalCreateToken}
        setShow={setShowModalCreateToken}
        getData={getDataCallback}
        setShowCopyTokenModal={setShowModalCopyToken}
      />
      <ModalDeleteToken
        show={showModalDeleteToken}
        setShow={setShowModalDeleteToken}
        getData={getDataCallback}
      />
      <ModalCopyToken
        show={showModalCopyToken}
        setShow={setShowModalCopyToken}
        getData={getDataCallback}
      />
    </Box>
  );
}

function ModalCreateToken({
  show = false,
  setShow = () => null,
  getData = () => null,
  setShowCopyTokenModal = () => null,
}) {
  const token = useAuth();
  const [token_name, setToken_name] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, setErrors } = useState({});

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await postCriarTokenPublico(token, token_name);
      handleClose();
      setShowCopyTokenModal(data);
      getData();
    } catch (err) {
      console.log(err);
      setErrors(err?.response?.data?.errors || {});
      toast.error("Não foi possível gerar o token. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!show) {
      setToken_name("");
    }
  }, [show]);

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Gerar token</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid item xs={12}>
            <TextField
              label={"Nome do token"}
              value={token_name}
              onChange={(e) => setToken_name(e.target.value)}
              error={errors?.token_name}
              helperText={
                errors?.token_name ? errors?.token_name?.join(" ") : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          {loading ? (
            <CircularProgress color="primary" size="35px" />
          ) : (
            <>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>

              <Button color="primary" type="submit">
                Gerar
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

function ModalDeleteToken({
  show = false,
  setShow = () => null,
  getData = () => null,
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
      await deleteTokenPublico(token, show?.id);
      getData(token);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Não foi possível deletar o token. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Deletar token</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          Deseja deletar o token? <br />
          ID: {show?.id} <br />
          {show?.name} <br />
          <br />
          Essa ação é irreversível
        </DialogContent>

        <DialogActions>
          {loading ? (
            <CircularProgress color="primary" size="35px" />
          ) : (
            <>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>

              <Button color="primary" type="submit">
                Deletar
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

function ModalCopyToken({ show = false, setShow = () => null }) {
  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Copie o token</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography>
            Importante: O código só poderá ser acessado desta vez, então salve
            em um arquivo de texto separado.
          </Typography>

          <Box row>
            <Tooltip title="Copiar">
              <CopyToClipboard text={show?.token}>
                <Button
                  aria="Copiar"
                  style={{
                    width: "60px",
                    height: "60px",
                    alignSelf: "center",
                    color: "green",
                  }}
                  onClick={() =>
                    toast.success("Token copiado com sucesso", {
                      autoClose: 2000,
                    })
                  }
                >
                  <CopyAll />
                </Button>
              </CopyToClipboard>
            </Tooltip>
            {show?.token}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
