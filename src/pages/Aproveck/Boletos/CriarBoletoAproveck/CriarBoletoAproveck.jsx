import { Box, Button, makeStyles, Paper } from "@material-ui/core";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomHeader from "../../../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../../constants/config";
import { useStoreAproveckBoletoMutation } from "../../../../services/api";
import DadosBoleto from "./DadosBoleto";
import DefinirPagador from "./DefinirPagador";
import FinalizarProcesso from "./FinalizarProcesso";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: "27px",
    width: "100%",
    maxWidth: "850px",
    alignSelf: "center",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "30px",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    color: "white",
  },
}));

const STEP_NUMBERS = {
  DADOS_DO_PAGADOR: 0,
  DADOS_DO_BOLETO: 1,
  CONCLUSAO: 2,
};

const CriarBoletoAproveck = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [errosBoleto, setErrosBoleto] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [storeBoleto] = useStoreAproveckBoletoMutation();
  const [response, setResponse] = useState({});
  const [boleto, setBoleto] = useState({
    pagador: {
      documento: "",
      nome: "",
      celular: "",
      data_nascimento: "",
      email: "",
      endereco: {
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
    },
    parcelas: 1,
    valor: "",
    descricao: "",
    instrucao1: "",
    data_vencimento: "",
    multa: false,
    juros: false,
    desconto: false,
    // tipo_multa: "",
    // valor_multa: null,
    // tipo_juros: null,
    // valor_juros: null,
    // tipo_desconto: null,
    // valor_desconto: null,
    // data_limite_valor_desconto: "",
    tipo: "",
    sga: {
      codigo_modulo: "",
      codigo_associado: "",
      descricao: "",
      codigo_tipo_boleto: "",
    },
  });

  const handleFirstClick = async () => {
    if (boleto?.sga?.codigo_modulo && boleto?.sga?.codigo_associado) {
      setActiveStep(1);
    } else {
      toast.warning("Defina um item para o pagador antes!");
    }
  };

  const handleSecondClick = async () => {
    setLoading(true);
    setErrosBoleto({});
    try {
      const newBoleto = await storeBoleto({ ...boleto }).unwrap();
      toast.success("Boleto criado com sucesso");
      setResponse(newBoleto);
      setActiveStep(2);
    } catch (e) {
      toast.error("Erro ao criar boleto!");
      if (e.status === 422) {
        toast.error(e.data.message);
        setErrosBoleto(e.data.errors);
      }
      setActiveStep(1);
    }
    setLoading(false);
  };

  const STEPS_COMPONENTS = {
    [STEP_NUMBERS.DADOS_DO_PAGADOR]: (
      <DefinirPagador
        boleto={boleto}
        setBoleto={setBoleto}
        onSelect={handleFirstClick}
      />
    ),
    [STEP_NUMBERS.DADOS_DO_BOLETO]: (
      <DadosBoleto
        boleto={boleto}
        setBoleto={setBoleto}
        errosBoleto={errosBoleto}
      />
    ),
    [STEP_NUMBERS.CONCLUSAO]: (
      <FinalizarProcesso carne={response} setLoading={setLoading} />
    ),
  };

  return (
    <>
      <LoadingScreen isLoading={loading} />

      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Aproveck - Criar Boleto" />
      </Box>

      <Box
        style={{
          display: "flex",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          borderTopRightRadius: "17px",
          borderTopLeftRadius: "17px",
          flexDirection: "column",
          padding: "30px",
        }}
      >
        <Paper className={classes.paper}>
          <Box className={classes.layout}>
            {STEPS_COMPONENTS[activeStep]}
            <Box className={classes.buttons}>
              {activeStep === STEP_NUMBERS.DADOS_DO_PAGADOR ? (
                <Button
                  variant="outlined"
                  onClick={handleFirstClick}
                  disabled={!boleto.sga.codigo_modulo}
                  style={{
                    marginTop: "6px",
                    backgroundColor: boleto.sga.codigo_modulo
                      ? APP_CONFIG.mainCollors.primary
                      : "gray",
                    color: "white",
                    borderRadius: "37px",
                    fontWeight: "bold",
                    fontSize: "11px",
                    height: "38px",
                    boxShadow: "0px 0px 5px 0.7px grey",
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  Próximo
                </Button>
              ) : null}
              {activeStep === STEP_NUMBERS.DADOS_DO_BOLETO ? (
                <Button
                  variant="outlined"
                  onClick={handleSecondClick}
                  style={{
                    marginTop: "6px",
                    backgroundColor: APP_CONFIG.mainCollors.primary,
                    color: "white",
                    borderRadius: "37px",
                    fontWeight: "bold",
                    fontSize: "11px",
                    height: "38px",
                    boxShadow: "0px 0px 5px 0.7px grey",
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  Próximo
                </Button>
              ) : null}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default CriarBoletoAproveck;
