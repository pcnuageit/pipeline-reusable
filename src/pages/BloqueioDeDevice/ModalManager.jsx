import { Box, Checkbox, Typography, makeStyles } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Modal } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useState } from "react";
import { toast } from "react-toastify";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import {
  deleteDevice,
  deleteUserDevice,
  patchDeviceChangeStatus,
  patchUserDeviceChangeStatus,
} from "../../services/beneficiarios";
import { errorMessageHelper } from "../../utils/errorMessageHelper";

import CustomButton from "../../components/CustomButton/CustomButton";

moment.locale("pt-br");

const styles = makeStyles((theme) => ({
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "10%",
    left: "35%",
    width: "30%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },
  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
}));

export function ModalChangeStatus({
  show = false,
  setShow = () => null,
  getData = () => null,
}) {
  const classes = styles();
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleChangeStatus = async () => {
    setLoading(true);
    try {
      await patchDeviceChangeStatus(
        token,
        show?.id,
        show?.status === "blacklisted" ? "ativo" : "blacklisted"
      );
      toast.success("Status alterado");
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    }
    setShow(false);
    setLoading(false);
  };

  return (
    <Modal open={!!show} onClose={() => setShow(false)}>
      <Box className={classes.modal}>
        <Box
          className={classes.closeModalButton}
          onClick={() => setShow(false)}
        >
          <Close />
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
            }}
          >
            {show?.status === "blacklisted"
              ? "Remover device da blacklist"
              : "Adicionar device à blacklist"}
          </Typography>

          <Typography>Device: {show?.device_code}</Typography>
          <Typography>Status: {show?.status}</Typography>
          <Typography>Modelo: {show?.device_model}</Typography>
          <Typography>Sistema: {show?.device_os}</Typography>
          <Typography>
            Total de contas: {show?.usuarios_totais_registrados}
          </Typography>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleChangeStatus}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  {show?.status === "blacklisted" ? "Remover" : "Adicionar"}
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export function ModalDelete({
  show = false,
  setShow = () => null,
  getData = () => null,
}) {
  const classes = styles();
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDevice(token, show?.id);
      toast.success("Device deletado");
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    }
    setShow(false);
    setLoading(false);
  };

  return (
    <Modal open={!!show} onClose={() => setShow(false)}>
      <Box className={classes.modal}>
        <Box
          className={classes.closeModalButton}
          onClick={() => setShow(false)}
        >
          <Close />
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
            }}
          >
            Deletar device
          </Typography>

          <Typography>Device: {show?.device_code}</Typography>
          <Typography>Status: {show?.status}</Typography>
          <Typography>Modelo: {show?.device_model}</Typography>
          <Typography>Sistema: {show?.device_os}</Typography>
          <Typography>
            Total de contas: {show?.usuarios_totais_registrados}
          </Typography>

          <Typography
            style={{
              marginTop: "30px",
            }}
          >
            Essa ação é irreversível
          </Typography>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleDelete}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Deletar
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export function ModalChangeStatusUser({
  show = false,
  setShow = () => null,
  getData = () => null,
}) {
  const classes = styles();
  const token = useAuth();
  const [loading, setLoading] = useState("");
  const [status, setStatus] = useState("bloqueado_manual"); //bloqueado_manual | liberado_manual;

  const handleChangeStatus = async () => {
    setLoading(true);
    try {
      console.log(show);
      await patchUserDeviceChangeStatus(token, show?.registro?.id, status);
      toast.success("Status alterado");
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    }
    setShow(false);
    setLoading(false);
  };

  return (
    <Modal open={!!show} onClose={() => setShow(false)}>
      <Box className={classes.modal}>
        <Box
          className={classes.closeModalButton}
          onClick={() => setShow(false)}
        >
          <Close />
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
            }}
          >
            Alterar status do usuário
          </Typography>

          <Typography>Nome do beneficiário: {show?.user?.nome}</Typography>
          <Typography>Documento: {show?.user?.documento}</Typography>
          <Typography>Email: {show?.user?.email}</Typography>
          <Typography>
            Whitelist: {show?.user?.is_whitelisted ? "Sim" : "Não"}
          </Typography>
          <Typography>Status: {show?.registro?.status}</Typography>

          <Box style={{ display: "flex", alignItems: "center", marginTop: 30 }}>
            <Checkbox
              color="primary"
              checked={status === "bloqueado_manual"}
              onChange={() => setStatus("bloqueado_manual")}
            />
            <Typography>Bloquear</Typography>
          </Box>

          <Box style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              color="primary"
              checked={status === "liberado_manual"}
              onChange={() => setStatus("liberado_manual")}
            />
            <Typography>Liberar</Typography>
          </Box>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleChangeStatus}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Alterar
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export function ModalDeleteUser({
  show = false,
  setShow = () => null,
  getData = () => null,
}) {
  const classes = styles();
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUserDevice(token, show?.registro?.id);
      toast.success("Usuário deletado");
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    }
    setShow(false);
    setLoading(false);
  };

  return (
    <Modal open={!!show} onClose={() => setShow(false)}>
      <Box className={classes.modal}>
        <Box
          className={classes.closeModalButton}
          onClick={() => setShow(false)}
        >
          <Close />
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
            }}
          >
            Deletar usuário no device
          </Typography>

          <Typography>Nome do beneficiário: {show?.user?.nome}</Typography>
          <Typography>Documento: {show?.user?.documento}</Typography>
          <Typography>Email: {show?.user?.email}</Typography>
          <Typography>
            Whitelist: {show?.user?.is_whitelisted ? "Sim" : "Não"}
          </Typography>
          <Typography>Status: {show?.registro?.status}</Typography>

          <Typography
            style={{
              marginTop: "30px",
            }}
          >
            Essa ação é irreversível
          </Typography>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleDelete}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Deletar
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
