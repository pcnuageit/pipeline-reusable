import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
} from "@material-ui/core";
import { format } from "date-fns";
import { useFormik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import { useChargeTarifasMutation } from "../../../services/financialSupport";
import { formatMoney } from "../../../utils/money";

function CobrarTarifaDialog({
  open = false,
  onClose = () => {},
  tarifas = [],
}) {
  const [chargeTarifas] = useChargeTarifasMutation();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      const mappedValues = Object.entries(values)
        .filter(([, value]) => value)
        .map(([key]) => key);

      if (mappedValues.length === 0) {
        return toast.error("Selecione as tarifas desejadas!");
      }

      try {
        await chargeTarifas({
          ids: mappedValues,
        }).unwrap();
        toast.success("Recobrança enviada com sucesso!");
        onClose();
      } catch (_e) {
        toast.error("Não foi possível enviar a cobrança!");
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle
        style={{
          paddingBottom: 0,
        }}
      >
        Efetuar recobrança das tarifas via Pix
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          style={{
            paddingTop: 0,
            minWidth: 500,
          }}
        >
          <Box display="flex" flexDirection="column">
            {tarifas.map((tarifa) => {
              return (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={formik.handleChange}
                        color="primary"
                        name={tarifa.id}
                      />
                    }
                    label={`Tarifa #${tarifa.ordem} | ${format(
                      new Date(tarifa.data_pagamento),
                      "MM/yyyy"
                    )} | ${formatMoney(tarifa.valor)}`}
                  />
                </>
              );
            })}
          </Box>
          <Divider />
          <Box pt={1}>
            Valor total: R${" "}
            {formatMoney(
              Object.entries(formik.values)
                .filter(([, value]) => value)
                .map(([key]) => key)
                .reduce((acc, key) => {
                  const tarifa = tarifas.find((t) => t.id === key);

                  return acc + tarifa.valor;
                }, 0)
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={formik.isSubmitting}
            variant="outlined"
            color="primary"
            type="submit"
          >
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CobrarTarifaDialog;
