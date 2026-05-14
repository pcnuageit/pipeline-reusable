import {
  Box,
  Button,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import dayjs from "dayjs";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../../../constants/config";
import { useSendAproveckBoletoByEmailMutation } from "../../../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const FinalizarProcesso = ({ carne, setLoading = () => {} }) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    id: id_carne,
    boletos,
    valor,
    descricao,
    parcelas,
    created_at,
  } = carne;
  const [sendBoletoByEmail] = useSendAproveckBoletoByEmailMutation();

  const handleVoltar = () => {
    history.push("/dashboard/aproveck-boletos");
  };

  const handleEnviar = async (boleto) => {
    setLoading(true);
    try {
      await sendBoletoByEmail({ boleto_id: boleto.id }).unwrap();

      toast.success("Boleto enviado com sucesso");
    } catch (e) {
      toast.error("Erro ao enviar");
    }
    setLoading(false);
  };

  return (
    <Box className={classes.root}>
      <Typography
        variant="h6"
        align="center"
        style={{ color: APP_CONFIG.mainCollors.primary, marginBottom: "20px" }}
      >
        Boleto criado com sucesso!
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} lg={3}>
          <Typography variant="h6">Parcelas</Typography>
          <Typography variant="overline">{parcelas}</Typography>
        </Grid>
        <Grid item xs={12} lg={2}>
          <Typography variant="h6">Valor</Typography>
          <Typography variant="overline">R${valor}</Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Typography variant="h6">Descrição</Typography>
          <Typography variant="overline">{descricao}</Typography>
        </Grid>
        <Grid item xs={12} lg={2}>
          <Typography variant="h6">Data</Typography>
          <Typography variant="overline">
            {created_at ? dayjs(created_at).format("DD/MM/YYYY H:m") : "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8}>
          {id_carne && (
            <>
              <Typography variant="h6">Identificação do Carne</Typography>
              <Typography variant="overline">{id_carne}</Typography>
            </>
          )}
        </Grid>
      </Grid>
      <Divider style={{ margin: "20px 0px" }} />
      <Box display="flex" flexDirection="column">
        {boletos.map((boleto) => {
          return (
            <Box display="flex" flexDirection="column">
              <Grid container spacing={1}>
                <Grid item xs={12} lg={3}>
                  <Typography variant="h6">Parcela</Typography>
                  <Typography variant="overline">
                    {boleto?.parcela || "-"} / {parcelas || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={2}>
                  <Typography variant="h6">Valor</Typography>
                  <Typography variant="overline">
                    {boleto?.valor || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Typography variant="h6">Nosso Número</Typography>
                  <Typography variant="overline">
                    {boleto?.numero_documento || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={2}>
                  <Typography variant="h6">Vencimento</Typography>
                  <Typography variant="overline">
                    {boleto?.data_vencimento
                      ? dayjs(boleto?.data_vencimento).format("DD/MM/YYYY")
                      : "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Código de barras</Typography>
                  <Typography variant="overline">
                    {boleto?.linha_digitavel || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Identificação do boleto </Typography>
                  <Typography variant="overline">
                    {boleto?.id || "-"}
                  </Typography>
                </Grid>
              </Grid>
              <Button
                variant="outlined"
                onClick={() => handleEnviar(boleto)}
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
                Enviar por email
              </Button>
              <Divider style={{ margin: "10px 0px" }} />
            </Box>
          );
        })}

        <Box display="flex" alignSelf="flex-end">
          <Button
            variant="outlined"
            onClick={handleVoltar}
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
            Finalizar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FinalizarProcesso;
