import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomCurrencyInput from "../../../components/Text/CustomCurrencyInput";
import { APP_CONFIG } from "../../../constants/config";
import useSgaAuth from "../../../hooks/useSgaAuth";
import { useUpdateAproveckBoletoMutation } from "../../../services/api";

const EditarAproveckBoletoDialog = ({
  boleto,
  open = false,
  setOpen = () => {},
  onSucess = () => {},
  setLoading = () => {},
}) => {
  const sgaToken = useSgaAuth();
  const [errosBoleto, setErrosBoleto] = useState({});
  const [updateBoleto] = useUpdateAproveckBoletoMutation();
  const { hinova: boletoHinova, boleto: boletoBanking } = boleto;
  const [data, setData] = useState({
    bearer_token: sgaToken,
    nosso_numero: boletoHinova.nosso_numero,
    banking_boleto_id: boletoBanking?.id,
    api_sga_associado_documento: boletoHinova.cpf_associado,
    nova_data_vencimento: boletoHinova.data_vencimento,
    valor: parseFloat(boletoHinova.valor_boleto),
    descricao: boletoBanking?.descricao,
  });

  const handleUpdate = async () => {
    console.log("handleUpdate");
    console.log({ data });

    setLoading(true);
    setErrosBoleto({});
    try {
      await updateBoleto({ ...data }).unwrap();

      toast.success("Boleto atualizado com sucesso");
      onSucess();
    } catch (e) {
      console.log({ e });
      toast.error("Erro ao atualizar boleto!");
      if (e.status === 422) {
        toast.error(e.data.message);
        setErrosBoleto(e.data.errors);
      }
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth={"md"}
    >
      <DialogTitle>
        <Typography
          variant="h5"
          style={{
            color: APP_CONFIG.mainCollors.primary,
            fontFamily: "Montserrat-SemiBold",
            marginBottom: "20px",
          }}
        >
          Editar Boleto
        </Typography>
      </DialogTitle>

      <DialogContent
        style={{
          minWidth: 500,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={4}>
            <Box display="flex" flexDirection="column">
              <CustomCurrencyInput
                prefix="R$ "
                value={data.valor}
                label="Valor"
                onChangeEvent={(event, maskedvalue, floatvalue) =>
                  setData({ ...data, valor: floatvalue })
                }
                error={errosBoleto.valor}
                errorMessage={
                  errosBoleto.valor ? errosBoleto.valor.join(" ") : null
                }
              />
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <TextField
              fullWidth
              error={errosBoleto.nova_data_vencimento}
              helperText={
                errosBoleto.nova_data_vencimento
                  ? errosBoleto.nova_data_vencimento.join(" ")
                  : null
              }
              InputLabelProps={{
                shrink: true,
                pattern: "d {4}- d {2}- d {2} ",
              }}
              type="date"
              label="Data de Vencimento"
              value={data.nova_data_vencimento}
              onChange={(e) =>
                setData({
                  ...data,
                  nova_data_vencimento: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errosBoleto.descricao}
              helperText={
                errosBoleto.descricao ? errosBoleto.descricao.join(" ") : null
              }
              required
              label="Descrição do boleto"
              value={data.descricao}
              onChange={(e) =>
                setData({
                  ...data,
                  descricao: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          width="100%"
          padding={2}
        >
          <Box display="flex">
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              style={{
                width: "100%",
                marginRight: "10px",
                borderRadius: "37px",
                fontWeight: "bold",
                fontSize: "11px",
                height: "38px",
                boxShadow: "0px 0px 5px 0.7px grey",
                fontFamily: "Montserrat-SemiBold",
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={!boleto?.nosso_numero}
              variant="outlined"
              onClick={handleUpdate}
              style={{
                width: "100%",
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
              Editar
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditarAproveckBoletoDialog;
