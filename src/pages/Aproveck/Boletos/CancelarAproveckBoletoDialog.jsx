import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../../constants/config";
import { useCancelarAproveckBoletoMutation } from "../../../services/api";

const CancelarAproveckBoletoDialog = ({
  boleto,
  open = false,
  setOpen = () => {},
  onSucess = () => {},
  setLoading = () => {},
}) => {
  const [cancelarBoleto] = useCancelarAproveckBoletoMutation();

  const handleCancelar = async () => {
    console.log("handleCancelar");
    console.log({ boleto });

    setLoading(true);
    try {
      await cancelarBoleto({ boleto_id: boleto.boleto.id }).unwrap();

      onSucess();
      toast.success("Boleto cancelado com sucesso");
    } catch (e) {
      console.log({ e });
      toast.error("Erro ao cancelar boleto!");
      if (e.status === 422) {
        toast.error(e.data.message);
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
          Cancelar Boleto
        </Typography>
      </DialogTitle>

      <DialogContent
        style={{
          minWidth: 500,
        }}
      >
        <Typography
          style={{
            color: APP_CONFIG.mainCollors.primary,
            fontFamily: "Montserrat-SemiBold",
            marginBottom: "20px",
          }}
        >
          Deseja realmente cancelar este boleto?
        </Typography>
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
              Não
            </Button>
            <Button
              disabled={!boleto?.nosso_numero}
              variant="outlined"
              onClick={handleCancelar}
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
              Sim
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CancelarAproveckBoletoDialog;
