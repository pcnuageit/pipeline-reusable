import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

import { toast } from "react-toastify";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import usePermission from "../../hooks/usePermission";
import {
  getPermissoesBeneficios,
  postPermissoesBeneficioSync,
} from "../../services/beneficiarios";
import { getUserData } from "../../services/services";

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
}));

const columns = [
  { headerText: "NOME", key: "nome" },
  { headerText: "Documento", key: "documento" },
  { headerText: "Email", key: "email" },
  { headerText: "Operador", key: "operador" },
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (text) => (
      <Typography align="center">
        {moment(text).format("DD/MM/YYYY")}
      </Typography>
    ),
  },
];

export default function ListaContasSecretaria() {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [showPermissoesModal, setShowPermissoesModal] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getUserData(token);
      setListaContas(data?.representante ?? []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Gerenciar contas" />

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
                <Box style={{ margin: 30 }}>
                  <Grid
                    container
                    spacing={4}
                    style={{ alignItems: "center", marginBottom: "8px" }}
                  ></Grid>
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
                    {!loading ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns ? columns : null}
                            data={listaContas}
                            handleClickRow={
                              hasPermission()
                                ? (row) => setShowPermissoesModal(row)
                                : null
                            }
                          />
                        </Box>

                        {/* <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={ListaContas.last_page}
                            onChange={(e, v) => setPage(v)}
                            page={page}
                          />
                        </Box> */}
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

      <PermissoesModal
        show={showPermissoesModal}
        setShow={setShowPermissoesModal}
      />
    </Box>
  );
}

function PermissoesModal({ show = false, setShow = () => false }) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [permissionsList, setPermissionsList] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getPermissoesBeneficios(token, show?.id);
      let arr = [];
      data?.data.forEach((obj) => {
        arr.push(obj.id);
      });
      setPermissionsList(arr);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postPermissoesBeneficioSync(token, show?.id, permissionsList);
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel alterar as permissões. Tente novamente.",
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!!show) {
      getData();
    }
  }, [show]);

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Alterar permissões</DialogTitle>
      <form onSubmit={handleSave}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de alterar as permissões do usuário {show?.nome}?
            <br />
            <br />
          </DialogContentText>

          <SelectBeneficio
            state={permissionsList}
            setState={(e) => setPermissionsList(e.target.value)}
            multiple
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
