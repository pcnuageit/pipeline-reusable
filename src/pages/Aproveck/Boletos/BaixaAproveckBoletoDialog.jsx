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
import { APP_CONFIG } from "../../../constants/config";
import { useEditarSituacaoAproveckBoletoMutation } from "../../../services/api";

const BaixaAproveckBoletoDialog = ({
  boleto,
  open = false,
  setOpen = () => {},
  onSucess = () => {},
  setLoading = () => {},
}) => {
  const [errosBoleto, setErrosBoleto] = useState({});
  const [data, setData] = useState({
    data_pagamento: "",
    forma_pagamento: [
      {
        codigo_forma_pagamento: 2,
        valor_pagamento: boleto.valor_boleto,
      },
    ],
    observacao_boleto: "Boleto pago",
    nosso_numero: boleto.nosso_numero,
    realizar_pedido_baixa: "S",
    codigo_situacao: 1,
  });
  const [baixaBoleto] = useEditarSituacaoAproveckBoletoMutation();

  const handleBaixaBoleto = async () => {
    console.log("handleBaixaBoleto");
    console.log({ boleto });

    setLoading(true);
    setErrosBoleto({});
    try {
      await baixaBoleto({ boleto_id: boleto.boleto.id, data }).unwrap();

      toast.success("Baixa de boleto realizada com sucesso");
      onSucess();
    } catch (e) {
      console.log({ e });
      toast.error("Erro ao realizar baixa do boleto!");
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
          Baixa Boleto
        </Typography>
      </DialogTitle>

      <DialogContent
        style={{
          minWidth: 500,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <TextField
              fullWidth
              error={errosBoleto.data_pagamento}
              helperText={
                errosBoleto.data_pagamento
                  ? errosBoleto.data_pagamento.join(" ")
                  : null
              }
              InputLabelProps={{
                shrink: true,
                pattern: "d {4}- d {2}- d {2} ",
              }}
              type="date"
              label="Data de Pagamento"
              value={boleto.data_pagamento}
              onChange={(e) =>
                setData({
                  ...data,
                  data_pagamento: e.target.value,
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
              onClick={handleBaixaBoleto}
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
              Baixa
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default BaixaAproveckBoletoDialog;
