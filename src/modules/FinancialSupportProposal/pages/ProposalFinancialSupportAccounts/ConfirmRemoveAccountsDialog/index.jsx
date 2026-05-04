import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React from "react";
import { APP_CONFIG } from "../../../../../constants/config";

function ConfirmRemoveAccountsDialog({
  open = false,
  onConfirm = () => {},
  onClose = () => {},
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogTitle
        style={{
          color: APP_CONFIG.mainCollors.primary,
          fontFamily: "Montserrat-SemiBold",
        }}
      >
        Deseja remover a Proposta de Apoio Financeiro para as contas
        selecionadas?
      </DialogTitle>

      <DialogContent
        style={{
          minWidth: 500,
        }}
      ></DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
          style={{ marginRight: "10px" }}
        >
          Cancelar
        </Button>
        <Button variant="outlined" color="primary" onClick={onConfirm}>
          Remover
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmRemoveAccountsDialog;
