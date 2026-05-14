import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Autocomplete } from "@material-ui/lab";
import {
  getContasAction,
  postAssinaturaPlanAction,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    background: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
  },
}));

const AddSalesPlanSubscriptionModal = ({
  openDialog,
  setOpenDialog,
  refetchSubscriptions,
  refetchSalesPlan,
  planId,
  loading,
  setLoading,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useAuth();
  const { data: contas } = useSelector((state) => state.contas);
  const [accountId, setAccountId] = useState({});
  const [filters, setFilters] = useState({
    like: "",
    page: "",
    status: "",
    conta_id_filter: "",
    tipo: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);

  useEffect(() => {
    dispatch(
      getContasAction(
        token,
        filters.page,
        debouncedLike,
        "",
        "",
        "",
        "",
        filters.status,
        "",
        filters.tipo,
        filters.conta_id_filter,
      ),
    );
  }, [dispatch, debouncedLike]);

  const handleAddEcSubscription = async () => {
    setLoading(true);

    const resPostAssinatura = await dispatch(
      postAssinaturaPlanAction(token, accountId, planId),
    );
    if (resPostAssinatura) {
      toast.error("Erro ao adicionar EC ao Plano de Venda!");
      setOpenDialog(false);
      setLoading(false);
    } else {
      toast.success("EC adicionado ao Plano de Venda!");
      setOpenDialog(false);
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ zIndex: "1" }}
    >
      <Box width="600px">
        <DialogTitle className={classes.dialogHeader}>
          <Typography align="center" variant="h6">
            Adicionar assinatura
          </Typography>
        </DialogTitle>

        <Box display="flex" flexDirection="column" padding="6px 16px">
          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            Escolha um EC para este Plano de Venda
          </Typography>

          <Autocomplete
            style={{ marginTop: "40px" }}
            freeSolo
            fullWidth
            options={contas}
            getOptionLabel={(conta) => conta.razao_social ?? conta.nome}
            onInputChange={(_event, value, reason) => {
              if (reason !== "reset") {
                setFilters({ ...filters, like: value });
                setAccountId(null);
              }
            }}
            onChange={(_event, option) => {
              setAccountId(option ? option.id : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Escolher EC"
                margin="normal"
                variant="outlined"
              />
            )}
          />

          <DialogActions style={{ marginTop: "40px" }}>
            <Button
              onClick={handleAddEcSubscription}
              variant="outlined"
              style={{ color: APP_CONFIG.mainCollors.primary }}
              disabled={accountId === null}
            >
              Adicionar
            </Button>
            <Button
              onClick={() => setOpenDialog(false)}
              style={{ color: APP_CONFIG.mainCollors.primary }}
              variant="outlined"
              autoFocus
            >
              Cancelar
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddSalesPlanSubscriptionModal;
