import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import DetailsList from "./DetailsList";
import Header from "./Header";
import Trailer from "./Trailer";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { generatePath, useHistory } from "react-router";

import { toast } from "react-toastify";
import CustomButton from "../../../components/CustomButton/CustomButton";
import TextFieldController from "../../../components/FormFields/TextFieldController";
import { useStoreArquivoRemessaMutation } from "../../../services/api";

const ArquivoRemessaForm = () => {
  const theme = useTheme();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);

  const headerData = useLocation().state.response?.header;
  const trailerData = useLocation().state.response?.trailer;
  const detailsData = useLocation().state.response?.details;
  const nameData = useLocation().state.response?.name;
  const isOnlyShow = useLocation().state.isOnlyShow;
  const shippingFileId = useLocation().state.shippingFileId;
  const accountId = useLocation().state.accountId;

  const [storeArquivoRemessa] = useStoreArquivoRemessaMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: nameData,
      header: { ...headerData },
      details: [...detailsData],
      trailer: { ...trailerData },
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "details",
  });

  const handleShowItems = () => {
    const path = generatePath(
      `/dashboard/arquivo-remessa/${shippingFileId}/itens`,
    );
    history.push(path, { accountId });
  };

  const submit = async (data) => {
    if (isOnlyShow) return;

    setLoading(true);
    try {
      await storeArquivoRemessa(data).unwrap();
      setLoading(false);
      history.push("/dashboard/arquivo-remessa");
      toast.success(
        "Dados enviados com sucesso, os boletos serão gerados em instantes",
      );
    } catch (e) {
      Object.entries(e.data.errors).forEach(([name, messages]) =>
        setError(name, {
          type: "manual",
          message: messages[0],
        }),
      );
      setLoading(false);
    }
  };

  return (
    <Box style={{ padding: "10px" }}>
      <Box
        marginBottom={3}
        display="flex"
        justifyContent="space-between"
        flexDirection={matches ? "column" : null}
      >
        <Typography
          variant="h4"
          style={{ color: theme.palette.background.default }}
        >
          FORMULÁRIO
        </Typography>

        {isOnlyShow ? (
          <CustomButton
            color="purple"
            variant="outlined"
            style={{ marginTop: "8px", marginBottom: "12px" }}
            onClick={handleShowItems}
          >
            MOSTRAR ITENS DE REMESSA
          </CustomButton>
        ) : null}
      </Box>

      <form onSubmit={handleSubmit(submit)}>
        <Box marginBottom={5}>
          <Box marginTop={2}>
            <Grid item xs={12} sm={12}>
              <TextFieldController
                control={control}
                error={errors}
                nameController="name"
                nameField="name"
                label="Nome para o arquivo de remessa"
                required
                disabled={isOnlyShow}
              />
            </Grid>
          </Box>
        </Box>

        <Box marginBottom={5}>
          <Typography
            variant="h6"
            style={{ color: theme.palette.background.default }}
          >
            CABEÇALHO
          </Typography>

          <Header
            error={errors.header}
            control={control}
            disabled={isOnlyShow}
          />
        </Box>
        <Box marginBottom={2}>
          <DetailsList
            fields={fields}
            control={control}
            errors={errors.details}
            disabled={isOnlyShow}
          />
        </Box>
        <Box marginBottom={5}>
          <Typography
            variant="h6"
            style={{ color: theme.palette.background.default }}
          >
            RODAPÉ
          </Typography>

          <Trailer error={errors.trailer} control={control} />
        </Box>
        {isOnlyShow ? null : (
          <CustomButton
            color="purple"
            buttonText={"Salvar"}
            disabled={loading}
            type="submit"
          />
        )}
      </form>
    </Box>
  );
};

export default ArquivoRemessaForm;
