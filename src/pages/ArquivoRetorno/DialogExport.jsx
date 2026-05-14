import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";

import { useState } from "react";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../constants/config";
import { useExportArquivoRetornoMutation } from "../../services/api";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    background: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
  },
  dialogTitle: {
    background: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  dialogSelectFile: {
    margin: "10px auto",
  },
}));
const DialogExport = ({ open, handleClose }) => {
  const classes = useStyles();
  const [dates, setDates] = useState({
    data_inicial: "",
    data_final: "",
  });
  const [errors, setErrors] = useState({});
  const [exportReturnFile] = useExportArquivoRetornoMutation();

  const handleExport = async () => {
    setErrors({});
    try {
      await exportReturnFile({
        data_inicial: dates.data_inicial,
        data_final: dates.data_final,
      }).unwrap();
      toast.success(
        "Estamos processando e em breve será disponibilizado no seu e-mail",
      );
      handleClose();
      setDates({ data_inicial: "", data_final: "" });
    } catch (e) {
      if (e.status === 422) setErrors(e.data.errors);
      if (e.status === 404) toast.error(e.data.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle className={classes.dialogTitle}>
        Solicitação Arquivo de Retorno
      </DialogTitle>

      <DialogContent>
        <Typography
          style={{
            marginBottom: "10px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Selecione o intervalo de data que você deseja o arquivo de retorno:
        </Typography>
        <Box style={{ marginTop: "20px" }}>
          <TextField
            variant="outlined"
            fullWidth
            style={{ marginBottom: "10px" }}
            InputLabelProps={{
              shrink: true,
              pattern: "d {4}- d {2}- d {2} ",
            }}
            type="date"
            label="Data Inicial"
            value={dates.data_inicial}
            error={errors?.data_inicial}
            helperText={errors.data_inicial ? errors.data_inicial[0] : null}
            onChange={(e) =>
              setDates({ ...dates, data_inicial: e.target.value })
            }
            required
          />
        </Box>
        <Box style={{ marginTop: "20px" }}>
          <TextField
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
              pattern: "d {4}- d {2}- d {2} ",
            }}
            type="date"
            label="Data Final"
            value={dates.data_final}
            error={errors?.data_final}
            helperText={errors.data_final ? errors.data_final[0] : null}
            onChange={(e) => setDates({ ...dates, data_final: e.target.value })}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            minWidth: 120,
            height: 40,
          }}
          onClick={handleClose}
          variant="outlined"
          color="secondary"
        >
          Cancelar
        </Button>
        <Button
          color="default"
          variant="outlined"
          onClick={handleExport}
          autoFocus
          style={{
            minWidth: 120,
            height: 40,
          }}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogExport;
