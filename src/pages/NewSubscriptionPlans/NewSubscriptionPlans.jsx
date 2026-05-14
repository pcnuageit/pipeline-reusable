import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  loadPlanoId,
  postPlanoAction,
  updatePlano,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "50px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    flexDirection: "column",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "27px",
    padding: theme.spacing(3),
    width: "500px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  currency: {
    font: "inherit",
    color: "currentColor",
    width: "100%",
    border: "0px",
    borderBottom: "1px solid gray",
    height: "1.1876em",
    margin: 0,
    display: "block",
    padding: "6px 0 7px",
    minWidth: 0,
    background: "none",
    boxSizing: "content-box",
    animationName: "mui-auto-fill-cancel",
    letterSpacing: "inherit",
    animationDuration: "10ms",
    appearance: "textfield",
    textAlign: "start",
    paddingLeft: "5px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const NewSubscriptionPlans = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const token = useAuth();
  const dispatch = useDispatch();
  const history = useHistory();
  const { subsectionId } = useParams();
  const [loading, setLoading] = useState(false);
  const planoId = useSelector((state) => state.plano);
  const [plano, setPlano] = useState({
    nome: "",
    valor: 0,
    frequencia: 1,
    duracao: 0,
    descricao: "",
  });

  useEffect(() => {
    if (subsectionId) {
      dispatch(loadPlanoId(token, subsectionId));
      if (planoId) {
        setPlano({
          ...plano,
          nome: planoId.nome,
          valor: planoId.valor,
          frequencia: planoId.frequencia === "Semanal" ? 1 : 2,
          duracao: planoId.duracao,
          descricao: planoId.descricao,
        });
      }
    }
  }, [subsectionId]);

  const [errosPlano, setErrosPlano] = useState({});

  const handleCriarPlano = async () => {
    setLoading(true);
    if (planoId && subsectionId) {
      const resPlanoUpdate = await dispatch(
        updatePlano(token, subsectionId, plano),
      );
      if (resPlanoUpdate) {
        toast.error("Erro ao criar plano");
        setErrosPlano(resPlanoUpdate);
        setLoading(false);
      } else {
        setLoading(false);
        toast.success("Plano atualizado com sucesso");
        history.push("/dashboard/adquirencia/acao/planos-de-assinaturas");
      }
    } else {
      const resPlano = await dispatch(postPlanoAction(token, plano));
      if (resPlano) {
        toast.error("Erro ao criar plano");
        setErrosPlano(resPlano);
        setLoading(false);
      } else {
        setLoading(false);
        toast.success("Plano criado com sucesso");
        history.push("/dashboard/adquirencia/acao/planos-de-assinaturas");
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <LoadingScreen isLoading={loading} />
      <CustomHeader pageTitle="Novo Plano" />
      <Paper className={classes.paper}>
        <Typography
          align="center"
          style={{
            margin: "8px 0px",
            color: APP_CONFIG.mainCollors.primary,
          }}
          variant="h6"
        >
          Dados do plano
        </Typography>
        <FormControl error={errosPlano.valor}>
          <Box
            style={{
              margin: "12px 0px",
              alignSelf: "center",
              width: "300px",
            }}
            display="flex"
            flexDirection="column"
          >
            <Typography
              align="center"
              style={{
                alignSelf: "center",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Valor do Plano
            </Typography>

            {planoId && subsectionId ? (
              <TextField
                style={{ color: APP_CONFIG.mainCollors.primary }}
                label="Valor do plano"
                value={"R$" + plano.valor}
                disabled
              />
            ) : (
              <CurrencyInput
                className={classes.currency}
                decimalSeparator=","
                thousandSeparator="."
                prefix="R$ "
                value={plano.valor}
                onChangeEvent={(event, maskedvalue, floatvalue) =>
                  setPlano({ ...plano, valor: floatvalue })
                }
                style={{
                  marginBottom: "6px",
                  width: "60%",
                  alignSelf: "center",
                }}
              />
            )}
            <FormHelperText style={{ alignSelf: "center" }}>
              Mínimo: R$5,00
            </FormHelperText>
            <FormHelperText style={{ alignSelf: "center" }}>
              {errosPlano.valor ? errosPlano.valor.join(" ") : null}
            </FormHelperText>
          </Box>
        </FormControl>

        <Box style={{ margin: "6px 0px" }}>
          <TextField
            error={errosPlano.nome}
            helperText={errosPlano.nome ? errosPlano.nome.join(" ") : null}
            value={plano.nome}
            onChange={(e) => setPlano({ ...plano, nome: e.target.value })}
            label="Nome do plano"
            fullWidth
          />
        </Box>
        <Box style={{ margin: "12px 0px" }}>
          <TextField
            error={errosPlano.descricao}
            helperText={
              errosPlano.descricao ? errosPlano.descricao.join(" ") : null
            }
            value={plano.descricao}
            onChange={(e) => setPlano({ ...plano, descricao: e.target.value })}
            label="Descrição do plano"
            fullWidth
          />
        </Box>
        <Box style={{ margin: "12px 0px" }}>
          {planoId && subsectionId ? (
            <Box display="flex">
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                label="Frequência"
                value={planoId.frequencia}
                disabled
              />
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ marginLeft: "6px" }}
                fullWidth
                label="Duração"
                value={planoId.duracao}
                disabled
              />
            </Box>
          ) : (
            <Box display="flex">
              <FormControl fullWidth error={errosPlano.frequencia}>
                <InputLabel>Frequência</InputLabel>
                <Select
                  fullWidth
                  value={plano.frequencia}
                  onChange={(e) =>
                    setPlano({ ...plano, frequencia: e.target.value })
                  }
                >
                  <MenuItem key={1} value={1}>
                    Semanal
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    Mensal
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {errosPlano.frequencia
                    ? errosPlano.frequencia.join(" ")
                    : null}
                </FormHelperText>
              </FormControl>
              <TextField
                style={{ marginLeft: "6px" }}
                error={errosPlano.duracao}
                helperText={
                  errosPlano.duracao ? errosPlano.duracao.join(" ") : null
                }
                value={plano.duracao}
                onChange={(e) =>
                  setPlano({ ...plano, duracao: e.target.value })
                }
                label="Duração"
                fullWidth
                type="number"
              />
            </Box>
          )}
        </Box>

        <Box alignSelf="flex-end" marginTop="6px">
          <Button
            onClick={() => history.goBack()}
            style={{ marginRight: "12px", borderRadius: "27px" }}
            variant="outlined"
          >
            Voltar
          </Button>
          <CustomButton color="purple" onClick={handleCriarPlano}>
            {planoId && subsectionId ? "Editar" : "Criar"}
          </CustomButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewSubscriptionPlans;
