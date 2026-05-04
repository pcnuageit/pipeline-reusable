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
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Autocomplete } from "@material-ui/lab";

import { useDispatch, useSelector } from "react-redux";
import {
  getContasAction,
  postAssinaturaPlanoVendasAction,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    background: APP_CONFIG.mainCollors.primary,
    color: "white",
  },
}));

const AddAgentSalesPlanSubscriptionModal = ({
  openDialog,
  setOpenDialog,
  refetchSubscriptions,
  refetchSalesPlan,
  planId,
  isLoading,
  setIsLoading,
  agentId,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data: contas } = useSelector((state) => state.contas);
  const [accountId, setAccountId] = useState({});
  const token = useAuth();
  const [filters, setFilters] = useState({
    like: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);

  useEffect(() => {
    dispatch(
      getContasAction(
        token,
        "",
        debouncedLike,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        true,
        agentId
      )
    );
  }, [debouncedLike, agentId]);

  const handleAddEcSubscription = async () => {
    setIsLoading(true);
    const resPostAssinatura = await dispatch(
      postAssinaturaPlanoVendasAction(token, accountId, planId)
    );
    if (resPostAssinatura) {
      toast.error("Erro ao adicionar EC ao Plano de Venda!");
      setIsLoading(false);
      setOpenDialog(false);
    } else {
      toast.success("EC adicionado ao Plano de Venda!");
      setIsLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ zIndex: 1000 }}
    >
      <Box width="600px">
        <DialogTitle className={classes.dialogHeader}>
          <Typography align="center" variant="h6">
            Adicionar assinatura
          </Typography>
        </DialogTitle>

        <Box
          display="flex"
          flexDirection="column"
          padding="6px 16px"
          /* style={{ backgroundColor: APP_CONFIG.mainCollors.backgrounds }} */
        >
          <Typography>Escolha um EC para este Plano de Venda</Typography>
          <Box style={{ marginTop: "30px" }}>
            <Autocomplete
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
                <TextField {...params} label="Escolher EC" variant="outlined" />
              )}
            />
          </Box>

          <DialogActions>
            <Button
              onClick={handleAddEcSubscription}
              variant="outlined"
              color="default"
              disabled={accountId === null}
            >
              Adicionar
            </Button>
            <Button
              onClick={() => setOpenDialog(false)}
              color="default"
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

export default AddAgentSalesPlanSubscriptionModal;
