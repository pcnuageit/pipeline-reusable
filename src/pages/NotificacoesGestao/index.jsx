import "../../fonts/Montserrat-SemiBold.otf";

import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  generatePath,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { postNotificacaoAction } from "../../actions/actions";

import CustomButton from "../../components/CustomButton/CustomButton";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import usePermission from "../../hooks/usePermission";
import BeneficiariosTable from "./BeneficiariosTable";
import EstabelecimentosTable from "./EstabelecimentosTable";

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

//Get filters from child tables to send notifications
let tableFilters = "";
export function setTableFilters(v) {
  tableFilters = v;
}

export default function NotificacoesGestao() {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { hasPermission, PERMISSIONS } = usePermission();
  const [open, setOpen] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // 0 - beneficiarios | 1 - estabelecimentos

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

        {hasPermission(PERMISSIONS.notificacoes.actions.send_notification) && (
          <Box
            style={{
              display: "flex",
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
                    Enviar Selecionados
                  </Box>
                </CustomButton>
              </Box>

              <Box style={{ marginLeft: "10px" }}>
                <CustomButton
                  color="purple"
                  onClick={() => {
                    setOpen("sendToALL");
                    setRegistros([]);
                  }}
                >
                  <Box display="flex" alignItems="center">
                    Enviar Todos
                  </Box>
                </CustomButton>
              </Box>

              <Box style={{ marginLeft: "10px" }}>
                <CustomButton
                  color="purple"
                  onClick={() => {
                    const path = generatePath(
                      "lista-arquivos-de-lote?type=notificacoes"
                    );
                    history.push(path);
                  }}
                >
                  <Box display="flex" alignItems="center">
                    Arquivos em Lote
                  </Box>
                </CustomButton>
              </Box>

              <Box style={{ marginLeft: "10px" }}>
                <CustomButton
                  color="purple"
                  onClick={() => {
                    const path = generatePath("historico-notificacoes");
                    history.push(path);
                  }}
                >
                  <Box display="flex" alignItems="center">
                    Histórico de notificações
                  </Box>
                </CustomButton>
              </Box>
            </Box>
          </Box>
        )}

        <AppBar
          position="static"
          color="default"
          style={{
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopRightRadius: 27,
            borderTopLeftRadius: 27,
            marginTop: 16,
          }}
        >
          <Tabs
            style={{
              color: APP_CONFIG.mainCollors.primary,
              borderBottom: `1px solid ${APP_CONFIG.mainCollors.primary}`,
            }}
            value={selectedTab}
            onChange={(e, v) => {
              setRegistros([]);
              setSelectedTab(v);
            }}
            variant="fullWidth"
          >
            <Tab label="Beneficiários" />
            <Tab label="Estabelecimentos" />
          </Tabs>
        </AppBar>

        {hasPermission(PERMISSIONS.notificacoes.list.view) && (
          <Box
            style={{
              width: "100%",
              backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            }}
          >
            <TabPanel value={selectedTab} index={0} dir={theme.direction}>
              <BeneficiariosTable
                registros={registros}
                setRegistros={setRegistros}
              />
            </TabPanel>

            <TabPanel value={selectedTab} index={1} dir={theme.direction}>
              <EstabelecimentosTable
                registros={registros}
                setRegistros={setRegistros}
              />
            </TabPanel>
          </Box>
        )}
      </Box>

      <NotificationModal
        open={open}
        setOpen={setOpen}
        selectedTab={selectedTab}
        registros={registros}
        setRegistros={setRegistros}
      />
    </Box>
  );
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

function NotificationModal({
  open,
  setOpen,
  selectedTab,
  registros,
  setRegistros,
}) {
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dadosNotificacao, setDadosNotificacao] = useState({
    titulo: "",
    mensagem: "",
  });

  const handleEnviarNotificacao = async () => {
    setLoading(true);

    try {
      const resEnviarNotificacao = await dispatch(
        postNotificacaoAction(
          token,
          dadosNotificacao.titulo,
          dadosNotificacao.mensagem,
          registros,
          selectedTab,
          open === "sendToALL",
          tableFilters
        )
      );
      if (resEnviarNotificacao) {
        toast.error("Erro ao enviar notificação");
        setErrors(resEnviarNotificacao);
      } else {
        toast.success("Notificação enviada!");
        setRegistros([]);
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      <LoadingScreen isLoading={loading} />

      <Dialog
        open={!!open}
        onClose={() => setOpen(false)}
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
            InputLabelProps={{ shrink: true }}
            fullWidth
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
    </>
  );
}
