import {
  Box,
  Button,
  Dialog,
  LinearProgress,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  loadPagadoresFilter,
  loadPlanosAll,
  postAssinaturaAction,
  postCartaoAssinaturaAction,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import NovoPagador from "../../components/NovoPagador/NovoPagador";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import SubscriptionCard from "./SubscriptionCard/SubscriptionCard";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  paper: {
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
    borderRadius: "27px",
    alignSelf: "center",
    display: "flex",
    flexDirection: "column",
    width: "800px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  inputLabelNoShrink: {
    transform: "translate(45px, 15px) scale(1)",
  },
}));

const STEPS = {
  PAGADOR_CADASTRADO: "Pagador cadastrado?",
  ESCOLHER_PAGADOR: "Escolha o pagador",
  CADASTRO_PAGADOR: "Cadastrar novo pagador",
  PAGAMENTO: "Pagamento",
  ESCOLHER_PLANO: "Escolha o plano",
};

const NewAccountSubscriptions = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [steps] = useState([
    STEPS.ESCOLHER_PAGADOR,
    STEPS.PAGAMENTO,
    STEPS.ESCOLHER_PLANO,
  ]);
  const [activeStep, setActiveStep] = useState(0);

  //state de pagadores
  const [, setErrosPagador] = useState({});
  const token = useAuth();
  const [assinatura, setAssinatura] = useState({
    plano_id: "",
    pagador_id: null,
  });
  const pagadoresList = useSelector((state) => state.pagadores);

  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: 3,
  });
  const [modalNovoPagador, setModalNovoPagador] = useState(false);
  const planosList = useSelector((state) => state.planosList);

  const debouncedLike = useDebounce(filters.like, 800);
  const shrink = filters.like.length > 0;
  useEffect(() => {
    dispatch(loadPlanosAll(token));
  }, []);

  useEffect(() => {
    dispatch(
      loadPagadoresFilter(
        token,
        undefined,
        debouncedLike,
        filters.order,
        3,
        undefined,
      ),
    );
  }, [debouncedLike]);

  const [pagadorCartao, setPagadorCartao] = useState({
    cartao: {
      nome: null,
      numero: "",
      cvv: "",
      mes: "",
      ano: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);

    if (activeStep === 0) {
      if (assinatura.pagador_id === null) {
        toast.error("Selecione um pagador");
        setLoading(false);
      } else {
        setActiveStep(activeStep + 1);
        setLoading(false);
      }
    }
    if (activeStep === 1) {
      const resCartao = await dispatch(
        postCartaoAssinaturaAction(
          token,
          assinatura.pagador_id,
          pagadorCartao.cartao,
        ),
      );

      if (resCartao) {
        setErrosPagadorCartao(resCartao);
        toast.error("Erro ao cadastrar cartão");
        setLoading(false);
      } else {
        toast.success("Cartão vinculado com sucesso!");
        setActiveStep(activeStep + 1);
        setLoading(false);
      }
    }
    if (activeStep === 2) {
      const resAssinatura = await dispatch(
        postAssinaturaAction(token, assinatura),
      );

      if (resAssinatura) {
        setErrosPagador(resAssinatura);
        toast.error("Erro ao cadastrar");
        setLoading(false);
      } else {
        toast.success("Assinatura efetuada com sucesso!");
        history.push("/dashboard/adquirencia/acao/cobranca-recorrente");
        setLoading(false);
      }
    }
  };

  const [pagadorSelecionado, setPagadorSelecionado] = useState(false);

  const handleSelecionarPagador = (id) => {
    setPagadorSelecionado(true);
    setAssinatura({ ...assinatura, pagador_id: id });
    setActiveStep(activeStep + 1);
  };

  const columns = [
    { headerText: "Nome", key: "nome" },
    {
      headerText: "Documento",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "Ações",
      key: "id",
      CustomValue: (pagadorId) => {
        return (
          <Button
            style={{ height: "27px" }}
            disabled={pagadorSelecionado ? "true" : false}
            onClick={() => handleSelecionarPagador(pagadorId)}
          >
            <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
              Selecionar
            </Typography>
          </Button>
        );
      },
    },
  ];

  const [errosPagadorCartao, setErrosPagadorCartao] = useState({});

  const STEPS_COMPONENTS = {
    [STEPS.ESCOLHER_PAGADOR]: (
      <Box display="flex" flexDirection="column" alignItems="center">
        <TextField
          fullWidth
          value={filters.like}
          onChange={(e) =>
            setFilters({
              ...filters,
              like: e.target.value,
            })
          }
          InputLabelProps={{
            shrink: shrink,
            className: shrink ? undefined : classes.inputLabelNoShrink,
          }}
          variant="outlined"
          label="Buscar por nome, documento..."
          style={{ width: "100%" }}
          InputProps={{
            startAdornment: (
              <SearchIcon
                style={{
                  fontSize: "30px",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              />
            ),
          }}
        />
        {pagadoresList.data && pagadoresList.per_page ? (
          <Box display="flex" flexDirection="column" marginTop={"30px"}>
            <CustomTable
              columns={columns}
              data={pagadoresList.data}
              compacta="true"
            />
            <Typography
              align="center"
              variant="overline"
              style={{ color: APP_CONFIG.mainCollors.primary }}
            >
              Caso seu pagador ainda não tenha cadastro
            </Typography>
            <Box alignSelf="center">
              <Button
                variant="outlined"
                onClick={() => setModalNovoPagador(true)}
                style={{ borderRadius: "27px" }}
              >
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  clique aqui
                </Typography>
              </Button>
            </Box>
          </Box>
        ) : (
          <LinearProgress />
        )}
      </Box>
    ),
    [STEPS.PAGAMENTO]: (
      <SubscriptionCard
        pagador={pagadorCartao}
        setPagador={setPagadorCartao}
        errosPagador={errosPagadorCartao}
      />
    ),
    [STEPS.ESCOLHER_PLANO]: (
      <Box alignSelf="center" width="50%">
        <Select
          fullWidth
          variant="standard"
          onChange={(e) =>
            setAssinatura({ ...assinatura, plano_id: e.target.value })
          }
        >
          {planosList.data.map((plano) => (
            <MenuItem value={plano.id} key={plano.id}>
              {plano.nome}
            </MenuItem>
          ))}
        </Select>
      </Box>
    ),
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />
      <CustomHeader pageTitle="Nova Assinatura" />
      <Dialog
        open={modalNovoPagador}
        onBackdropClick={() => setModalNovoPagador(false)}
        onClose={() => setModalNovoPagador(false)}
      >
        <NovoPagador ListaPagadoresRoute />
      </Dialog>
      <Paper className={classes.paper}>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {STEPS_COMPONENTS[steps[activeStep]]}
        <Box alignSelf="flex-end" marginTop="16px">
          <CustomButton color="purple" onClick={handleNext}>
            {activeStep === 2 ? "Finalizar" : "Próximo"}
          </CustomButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewAccountSubscriptions;
