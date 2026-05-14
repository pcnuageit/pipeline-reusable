import {
  Box,
  Dialog,
  DialogTitle,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateAssinaturaAction } from "../../../actions/actions";
import CustomButton from "../../../components/CustomButton/CustomButton";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  UserInfosContainer: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    color: APP_CONFIG.mainCollors.primary,
  },
  userContentsContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: APP_CONFIG.mainCollors.secondary,
    padding: "8px",
    borderRadius: "27px",
  },
  userContentItem: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    padding: "12px",
    margin: "8px",
    borderRadius: "27px",
  },
  saqueModal: {
    padding: "20px",
  },
  saqueHeader: {
    background: APP_CONFIG.mainCollors.primary,
    color: "white",
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
    zIndex: "",
    color: "#fff",
  },
}));

const ChangePlanModal = ({ open, onClose, selectedValue, row }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useAuth();
  const planosList = useSelector((state) => state.planosList);

  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    onClose(selectedValue);
  };

  const [assinatura, setAssinatura] = useState({
    plano_id: "",
  });

  const handleChangePlano = async () => {
    setLoading(true);
    const resMudanca = await dispatch(
      updateAssinaturaAction(token, row.id, assinatura.plano_id),
    );

    if (resMudanca) {
      toast.error("Erro ao mudar plano");
      setLoading(false);
    } else {
      toast.success("Plano atualizado com sucesso!");
      onClose(selectedValue);
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} className={classes.saqueModal}>
      <LoadingScreen isLoading={loading} />

      <Box width="500px">
        <DialogTitle className={classes.saqueHeader}>
          <Typography align="center" variant="h6">
            Mudar Plano
          </Typography>
        </DialogTitle>
        <Box display="flex" flexDirection="column" padding="12px 24px">
          <Box display="flex" flexDirection="column">
            <TextField
              disabled
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Plano Atual"
              value={row.plano_id}
              style={{
                marginBottom: "6px",
                width: "60%",
                alignSelf: "center",
              }}
            />

            <InputLabel>Selecione o plano</InputLabel>

            <Select
              fullWidth
              variant="standard"
              onChange={(e) =>
                setAssinatura({
                  ...assinatura,
                  plano_id: e.target.value,
                })
              }
            >
              {planosList.data.map((plano) => (
                <MenuItem
                  value={plano.id}
                  key={plano.id}
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                >
                  {plano.nome}
                </MenuItem>
              ))}
            </Select>

            <Box alignSelf="center" marginTop="30px">
              <CustomButton color="purple" onClick={handleChangePlano}>
                Mudar Plano
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ChangePlanModal;
