import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  useUpdateAntecipacaoSalarialProposalMutation,
  useUpdateIsPublicInAntecipacaoSalarialProposalMutation,
} from "../../../../modules/AntecipacaoSalarialProposal/services/AntecipacaoSalarialProposal";
import CurrencyFieldText from "../../../../modules/FinancialSupport/components/CurrencyField";
import Popover from "../../../../modules/FinancialSupport/components/Popover";

const validationSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  value: yup
    .number()
    .moreThan(0, "Valor da proposta deve ser maior que 0")
    .required("Valor da proposta é obrigatória"),
  tax: yup
    .number()
    .moreThan(0, "Valor da tarifa deve ser maior que 0")
    .required("Valor da tarifa é obrigatória"),
  duration: yup
    .number()
    .moreThan(0, "Duração deve ser maior que 0")
    .max(36, "Duração não pode ser maior que 36 meses")
    .required("Duração da proposta é obrigatória"),
  intervalDaysWhenRefused: yup
    .number()
    .moreThan(0, "Intevalo entre solicitações deve ser maior que 0")
    .required("Intervalo entre solicitações da proposta é obrigatório"),
  taxAccount: yup.string().required("Conta Tarifa é obrigatória"),
  escrowAccount: yup.string().required("Conta Escrow é obrigatória"),
});

function EditProposalDialog({
  filters,
  setFilters,
  open = false,
  onClose = () => {},
  accounts = [],
  proposal,
}) {
  const [updateProposal] = useUpdateAntecipacaoSalarialProposalMutation();
  const [updateIsPublic] =
    useUpdateIsPublicInAntecipacaoSalarialProposalMutation();
  const formik = useFormik({
    initialValues: {
      name: proposal.nome,
      value: proposal.valor,
      tax: proposal.valor_tarifa,
      duration: proposal.duracao_em_meses,
      taxAccount: proposal.conta_tarifa_id,
      escrowAccount: proposal.conta_escrow_id,
      isPublic: proposal.is_public,
      intervalDaysWhenRefused: proposal.interval_days_when_refused,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await updateProposal({
          id: proposal.id,
          nome: values.name,
          active: true,
          valor: values.value,
          valor_tarifa: values.tax,
          duracao_em_meses: values.duration,
          conta_escrow_id: values.escrowAccount,
          conta_tarifa_id: values.taxAccount,
          interval_days_when_refused: values.intervalDaysWhenRefused,
        }).unwrap();

        toast.success("Proposta atualizada com sucesso");
        onClose();
      } catch (e) {
        toast.error("Não foi possível atualizar a Proposta");
        if (e.status === 401 && e.data?.message) {
          return toast.error(e.data.message);
        }
      }
    },
  });

  const handleChangePublicStatus = async () => {
    try {
      const lastPublicStatus = proposal.is_public;

      await updateIsPublic({
        id: proposal.id,
        is_public: !proposal.is_public,
      }).unwrap();

      if (lastPublicStatus) {
        toast.success(
          "Status público removido da Proposta de Apoio Financeiro!"
        );
      } else {
        toast.success(
          "Status público adicionado na Proposta de Apoio Financeiro!"
        );
      }
      onClose();
    } catch (e) {
      toast.error(
        "Erro ao modificar visualização da Proposta de Apoio Financeiro!"
      );
    }
  };

  return accounts?.data ? (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle
        style={{
          paddingBottom: 0,
        }}
      >
        Editar proposta de apoio financeiro
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          style={{
            paddingTop: 0,
            minWidth: 500,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                autoFocus
                fullWidth
                id="name"
                name="name"
                label="Nome"
                placeholder="Nome para identificar a proposta"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={proposal.is_all_supports_paid === false}
                fullWidth
                id="duration"
                name="duration"
                type="number"
                label="Duração (em meses)"
                value={formik.values.duration}
                onChange={formik.handleChange}
                error={
                  formik.touched.duration && Boolean(formik.errors.duration)
                }
                helperText={formik.touched.duration && formik.errors.duration}
              />
            </Grid>
            <Grid item xs={4}>
              <CurrencyFieldText
                disabled={proposal.is_all_supports_paid === false}
                fullWidth
                id="value"
                name="value"
                label="Valor da proposta"
                formik={formik}
                value={formik.values.value}
                error={formik.touched.value && Boolean(formik.errors.value)}
                helperText={formik.touched.value && formik.errors.value}
              />
            </Grid>
            <Grid item xs={4}>
              <CurrencyFieldText
                disabled={proposal.is_all_supports_paid === false}
                fullWidth
                id="tax"
                name="tax"
                label="Tarifa cobrada mensalmente"
                formik={formik}
                value={formik.values.tax}
                error={formik.touched.tax && Boolean(formik.errors.tax)}
                helperText={formik.touched.tax && formik.errors.tax}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="intervalDaysWhenRefused"
                name="intervalDaysWhenRefused"
                type="number"
                label="Intervalo (dias)"
                value={formik.values.intervalDaysWhenRefused}
                onChange={formik.handleChange}
                error={
                  formik.touched.intervalDaysWhenRefused &&
                  Boolean(formik.errors.intervalDaysWhenRefused)
                }
                helperText={
                  formik.touched.intervalDaysWhenRefused &&
                  formik.errors.intervalDaysWhenRefused
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disabled={proposal.is_all_supports_paid === false}
                fullWidth
                defaultValue={proposal.conta_escrow}
                options={accounts.data}
                getOptionLabel={(account) =>
                  account.razao_social
                    ? `${account.razao_social}, ${account.cnpj}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
                    : `${account.nome}, ${account.documento}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
                }
                onInputChange={(_event, value, reason) => {
                  if (reason !== "reset") {
                    setFilters({ ...filters, like: value });
                  }
                }}
                onChange={(_event, option) => {
                  formik.setFieldValue(
                    "escrowAccount",
                    option ? option.id : ""
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Conta Escrow"
                    error={
                      formik.touched.escrowAccount &&
                      Boolean(formik.errors.escrowAccount)
                    }
                    helperText={
                      formik.touched.escrowAccount &&
                      formik.errors.escrowAccount
                        ? formik.errors.escrowAccount
                        : "Conta de onde será tirado o valor da proposta"
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disabled={proposal.is_all_supports_paid === false}
                fullWidth
                defaultValue={proposal.conta_tarifa}
                options={accounts.data}
                getOptionLabel={(account) =>
                  account.razao_social
                    ? `${account.razao_social}, ${account.cnpj}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
                    : `${account.nome}, ${account.documento}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
                }
                onInputChange={(_event, value, reason) => {
                  if (reason !== "reset") {
                    setFilters({ ...filters, like: value });
                  }
                }}
                onChange={(_event, option) => {
                  formik.setFieldValue("taxAccount", option ? option.id : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Conta Tarifa"
                    error={
                      formik.touched.taxAccount &&
                      Boolean(formik.errors.taxAccount)
                    }
                    helperText={
                      formik.touched.taxAccount && formik.errors.taxAccount
                        ? formik.errors.taxAccount
                        : "Conta onde será depositada a tarifa"
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      checked={proposal.is_public}
                      color="primary"
                      name="isPublic"
                      id="isPublic"
                    />
                  }
                  label="Proposta publica?"
                />
                <Popover buttonContent={<InfoOutlined />}>
                  <Typography
                    variant="body2"
                    style={{
                      maxWidth: "500px",
                      textAlign: "justify",
                    }}
                  >
                    Definir se está proposta será visivel para todos os ECs.
                  </Typography>
                </Popover>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleChangePublicStatus}>
            {proposal.is_public ? "Tornar Privada" : "Tornar Público"}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="outlined" color="primary" type="submit">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  ) : null;
}

export default EditProposalDialog;
