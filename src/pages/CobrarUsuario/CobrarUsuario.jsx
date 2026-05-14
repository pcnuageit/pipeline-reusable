import { Box, makeStyles, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import { postCobrancaCartaoAction, postPagadores } from "../../actions/actions";

import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import EditarPagador from "../EditarPagador/EditarPagador";
import RegistrarCartaoCredito from "../RegistrarCartaoCredito/RegistrarCartaoCredito";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },

  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyItems: "center",
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: "27px",
    width: "850px",
    alignSelf: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
    height: "60px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    color: "white",
  },
  headerPaper: {
    padding: theme.spacing(3),
    borderRadius: "27px 0 0 0 ",
    display: "flex",
    justifyContent: "space-between",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const STEPS = {
  DADOS_DO_PAGADOR: "Dados do pagador", //payer registration
  DADOS_DO_CARTAO: "Dados do boleto", // slip registration
  CONCLUSAO: "Conclusão",
};

const CobrarUsuario = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useAuth();
  const [errosPagador, setErrosPagador] = useState({});
  const { subsectionId } = useParams();
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.userData);

  const [pagador, setPagador] = useState({
    conta_id: null,
    id: null,
    documento: "",
    nome: "",
    celular: "",
    email: "",
    data_nascimento: "",
    endereco: {
      cep: " ",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  const [cobrancaCartao, setCobrancaCartao] = useState({
    pagador_id: null,
    parcelas: "",
    valor: "",
    captura: false,
    cartao: {
      nome: "",
      numero: "",
      cvv: "",
      mes: "",
      ano: "",
      focus: "",
    },
  });

  const pagadorExistente = useSelector((state) => state.pagador);

  useEffect(() => {
    setCobrancaCartao({ ...cobrancaCartao, pagador_id: pagadorExistente.id });
  }, [pagadorExistente.id]);

  const [activeStep, setActiveStep] = useState(0);
  const [steps] = useState([
    STEPS.DADOS_DO_PAGADOR,
    STEPS.DADOS_DO_CARTAO,
    STEPS.CONCLUSAO,
  ]);

  const handleFirstClick = async () => {
    setLoading(true);
    if (subsectionId) {
      setActiveStep(activeStep + 1);
      setLoading(false);
    } else {
      let newPagador = pagador;

      if (userData && userData.id) {
        newPagador = {
          ...newPagador,
          conta_id: userData.id,
        };
      }
      setPagador(newPagador);

      const resPagador = await dispatch(postPagadores(token, newPagador));

      if (resPagador) {
        setErrosPagador(resPagador);
        setActiveStep(0);
        setLoading(false);
      } else {
        toast.success("Cadastro efetuado com sucesso!");
        setActiveStep(activeStep + 1);
        setLoading(false);
      }
    }
  };

  const handlePreAutorizar = async () => {
    setLoading(true);
    const resCobrancaCartao = await dispatch(
      postCobrancaCartaoAction(token, cobrancaCartao),
    );

    if (resCobrancaCartao) {
      setErrosCobranca(resCobrancaCartao);
      setActiveStep(1);
      setLoading(false);
    } else {
      toast.success("Cobrança via Cartão criada com sucesso");
      history.push("/dashboard/adquirencia/acao/maquina-virtual-cartao");
      setLoading(false);
    }
  };

  const handleCobrar = async () => {
    setLoading(true);
    let newCobrancaCartao = cobrancaCartao;
    if (newCobrancaCartao.captura === false) {
      newCobrancaCartao = {
        ...newCobrancaCartao,
        captura: true,
      };
      setCobrancaCartao(newCobrancaCartao);
    } else {
      newCobrancaCartao = {
        ...newCobrancaCartao,
        captura: true,
      };
      setCobrancaCartao(newCobrancaCartao);
    }

    const resCobrancaCartao = await dispatch(
      postCobrancaCartaoAction(token, newCobrancaCartao),
    );
    if (resCobrancaCartao) {
      setErrosCobranca(resCobrancaCartao);
      setLoading(false);
    } else {
      toast.success("Cobrança via Cartão criada com sucesso");
      history.push("/dashboard/adquirencia/acao/maquina-virtual-cartao");
      setLoading(false);
    }
  };

  const [errosCobranca, setErrosCobranca] = useState({});

  const STEPS_COMPONENTS = {
    [STEPS.DADOS_DO_PAGADOR]: subsectionId ? (
      <EditarPagador diableBreadcrumbs />
    ) : (
      <EditarPagador
        pagador={pagador}
        setPagador={setPagador}
        errosPagador={errosPagador}
      />
    ),
    [STEPS.DADOS_DO_CARTAO]: (
      <>
        <RegistrarCartaoCredito
          linkPagamentoPagar={cobrancaCartao}
          setLinkPagamentoPagar={setCobrancaCartao}
          errosLink={errosCobranca}
        />
      </>
    ),
  };

  return (
    <Box display="flex" flexDirection="column">
      <LoadingScreen isLoading={loading} />
      <CustomHeader pageTitle="Cobrar" />
      <Box className={classes.layout}>
        <Paper className={classes.paper}>
          {STEPS_COMPONENTS[steps[activeStep]]}
          <Box className={classes.buttons}>
            {activeStep !== 2 ? (
              <Box
                style={{
                  display: "flex",
                  marginTop: "40px",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <CustomButton
                  style={{ borderRadius: "27px", marginRight: "6px" }}
                  variant="contained"
                  color="purple"
                  onClick={
                    activeStep === 0 ? handleFirstClick : handlePreAutorizar
                  }
                >
                  {activeStep === 1 ? "Pré-autorizar" : "Proximo"}
                </CustomButton>
                {activeStep === 1 ? (
                  <CustomButton
                    style={{ borderRadius: "27px" }}
                    variant="contained"
                    color="purple"
                    onClick={handleCobrar}
                  >
                    Cobrar
                  </CustomButton>
                ) : null}
              </Box>
            ) : null}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CobrarUsuario;
