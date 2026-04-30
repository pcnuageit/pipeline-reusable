import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useReactivateFinancialSupportMutation } from "../../../services/financialSupport";

function ReativarApoioDialog({
  open = false,
  onClose = () => {},
  financialSupport,
}) {
  const [reactivateFinancialSupport] = useReactivateFinancialSupportMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await reactivateFinancialSupport({
        id: financialSupport.id,
      }).unwrap();
      toast.success("Reativação efetuada com sucesso!");
      onClose();
    } catch (e) {
      toast.error("Não foi possível reativar o Apoio Financeiro!");
      if (e.status === 401 && e.data?.message) {
        return toast.error(e.data.message);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle
        style={{
          paddingBottom: 0,
        }}
      >
        Reativação do Apoio Financeiro
      </DialogTitle>
      <DialogContent
        style={{
          paddingTop: 0,
          minWidth: 500,
        }}
      >
        <Typography>
          {`Deseja reativar o Apoio Financeiro ${financialSupport.proposta_apoio_financeiro.nome} para este EC?`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          disabled={isSubmitting}
          variant="outlined"
          color="primary"
          onClick={handleSubmit}
        >
          Reativar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReativarApoioDialog;
