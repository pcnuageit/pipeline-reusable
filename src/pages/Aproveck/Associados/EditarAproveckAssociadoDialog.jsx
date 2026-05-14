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
import { useEditAproveckAssociadoMutation } from "../../../services/api";

const EditarAproveckAssociadoDialog = ({
  associado,
  open = false,
  setOpen = () => {},
  onSucess = () => {},
  setLoading = () => {},
}) => {
  const [errosEditarAssociado, setErrosEditarAssociado] = useState({});
  const [data, setData] = useState({
    codigo_associado: associado.codigo_associado,
    nome: associado.nome,
    celular: associado.telefone_celular,
    telefone: associado.telefone_fixo,
    email: associado.email,
    cep: associado.cep,
    logradouro: associado.logradouro,
    numero: associado.numero,
    complemento: associado.complemento,
    bairro: associado.bairro,
    cidade: associado.cidade,
    estado: associado.estado,
  });
  const [updateAssociado] = useEditAproveckAssociadoMutation();

  const handleUpdate = async () => {
    console.log("handleUpdate");
    console.log({ associado });

    setLoading(true);
    setErrosEditarAssociado({});
    try {
      await updateAssociado({ data }).unwrap();

      toast.success("Associado atualizado com sucesso");
      onSucess();
    } catch (e) {
      console.log({ e });
      toast.error("Erro ao atualizar associado!");
      if (e.status === 422) {
        toast.error(e.data.message);
        setErrosEditarAssociado(e.data.errors);
      }
      if (e.status === 400) {
        const error_details = e.data?.error;
        if (error_details) toast.error(error_details);
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
          Editar Associado
        </Typography>
      </DialogTitle>

      <DialogContent
        style={{
          minWidth: 500,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errosEditarAssociado.nome}
              helperText={
                errosEditarAssociado.nome
                  ? errosEditarAssociado.nome.join(" ")
                  : null
              }
              label="Nome"
              value={data.nome}
              onChange={(e) =>
                setData({
                  ...data,
                  nome: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              fullWidth
              error={errosEditarAssociado.celular}
              helperText={
                errosEditarAssociado.celular
                  ? errosEditarAssociado.celular.join(" ")
                  : null
              }
              label="Celular"
              value={data.celular}
              onChange={(e) =>
                setData({
                  ...data,
                  celular: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              fullWidth
              error={errosEditarAssociado.telefone}
              helperText={
                errosEditarAssociado.telefone
                  ? errosEditarAssociado.telefone.join(" ")
                  : null
              }
              label="Telefone"
              value={data.telefone}
              onChange={(e) =>
                setData({
                  ...data,
                  telefone: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TextField
              fullWidth
              error={errosEditarAssociado.email}
              helperText={
                errosEditarAssociado.email
                  ? errosEditarAssociado.email.join(" ")
                  : null
              }
              label="Email"
              value={data.email}
              onChange={(e) =>
                setData({
                  ...data,
                  email: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              error={errosEditarAssociado.cep}
              helperText={
                errosEditarAssociado.cep
                  ? errosEditarAssociado.cep.join(" ")
                  : null
              }
              label="Cep"
              value={data.cep}
              onChange={(e) =>
                setData({
                  ...data,
                  cep: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              error={errosEditarAssociado.logradouro}
              helperText={
                errosEditarAssociado.logradouro
                  ? errosEditarAssociado.logradouro.join(" ")
                  : null
              }
              label="Logradouro"
              value={data.logradouro}
              onChange={(e) =>
                setData({
                  ...data,
                  logradouro: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              error={errosEditarAssociado.numero}
              helperText={
                errosEditarAssociado.numero
                  ? errosEditarAssociado.numero.join(" ")
                  : null
              }
              label="Número"
              value={data.numero}
              onChange={(e) =>
                setData({
                  ...data,
                  numero: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              error={errosEditarAssociado.bairro}
              helperText={
                errosEditarAssociado.bairro
                  ? errosEditarAssociado.bairro.join(" ")
                  : null
              }
              label="Bairro"
              value={data.bairro}
              onChange={(e) =>
                setData({
                  ...data,
                  bairro: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              error={errosEditarAssociado.cidade}
              helperText={
                errosEditarAssociado.cidade
                  ? errosEditarAssociado.cidade.join(" ")
                  : null
              }
              label="Cidade"
              value={data.cidade}
              onChange={(e) =>
                setData({
                  ...data,
                  cidade: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              error={errosEditarAssociado.estado}
              helperText={
                errosEditarAssociado.estado
                  ? errosEditarAssociado.estado.join(" ")
                  : null
              }
              label="Estado"
              value={data.estado}
              onChange={(e) =>
                setData({
                  ...data,
                  estado: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errosEditarAssociado.complemento}
              helperText={
                errosEditarAssociado.complemento
                  ? errosEditarAssociado.complemento.join(" ")
                  : null
              }
              label="Complemento"
              value={data.complemento}
              onChange={(e) =>
                setData({
                  ...data,
                  complemento: e.target.value,
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

export default EditarAproveckAssociadoDialog;
