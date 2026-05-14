import { Box, Paper, Typography, makeStyles } from "@material-ui/core";
import { useMemo } from "react";
import { generatePath, useHistory } from "react-router";
import { toast } from "react-toastify";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { useLazyRetryItemsRemessaQuery } from "../../../services/api";

const useStyles = makeStyles((theme) => ({
  line: {
    display: "flex",
    alignItems: "center",
  },
  text: {
    marginRight: "10px",
  },
  title: {
    textAlign: "center",
    margin: "10px 0px",
  },
  paper: {
    padding: "24px",
    margin: "12px",
    borderRadius: "27px",
    width: "100%",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
      width: "100%",
    },
  },
}));

const ResumeRemessa = ({ data, arquivoRemessaId, accountId }) => {
  const classes = useStyles();
  const history = useHistory();

  const [retryItems] = useLazyRetryItemsRemessaQuery();

  const handleShowPayers = () => {
    const path = generatePath(
      `/dashboard/arquivo-remessa/${arquivoRemessaId}/pagadores`,
    );
    history.push(path, { accountId });
  };

  const canRetryItems = useMemo(
    () => data?.items_processados_count < data?.items_remessa_count,
    [data],
  );

  const handleRetryItems = async () => {
    if (!canRetryItems) return;
    try {
      await retryItems({
        arquivo_remessa_id: arquivoRemessaId,
      }).unwrap();
      toast.success(
        "Estamos reprocessando os itens da remessa que não foram processados anteriomente",
      );
    } catch (e) {
      toast.error("Não foi possível reprocessar os itens");
    }
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" className={classes.title}>
        Resumo
      </Typography>
      <Box className={classes.content}>
        <Box>
          <Box className={classes.line}>
            <Typography className={classes.text}>Total de detalhes:</Typography>
            <Typography variant="h6">{data?.details_count}</Typography>
          </Box>
          <Box className={classes.line}>
            <Typography className={classes.text}>
              Total de itens criados:
            </Typography>
            <Typography variant="h6">{data?.items_remessa_count}</Typography>
          </Box>
          <Box className={classes.line}>
            <Typography className={classes.text}>
              Total de itens processados:
            </Typography>
            <Typography variant="h6">
              {data?.items_processados_count}
            </Typography>
          </Box>
          <Box className={classes.line}>
            <Typography className={classes.text}>
              Total de itens com pagadores configurados:
            </Typography>
            <Typography variant="h6">{data?.pagadores_count ?? 0}</Typography>
          </Box>
        </Box>
        <Box className={classes.buttons}>
          <CustomButton
            color="purple"
            variant="outlined"
            style={{ marginTop: "8px", marginBottom: "12px" }}
            onClick={handleShowPayers}
          >
            Mostrar Pagadores da Remessa
          </CustomButton>
          {canRetryItems ? (
            <CustomButton
              color="purple"
              variant="outlined"
              style={{ marginTop: "8px", marginBottom: "12px" }}
              onClick={handleRetryItems}
            >
              Reprocessar os itens
            </CustomButton>
          ) : null}
          {/* <Button
            variant="outlined"
            style={{ marginTop: "8px", marginBottom: "12px" }}
            onClick={() => console.log("clicou")}
          >
            Enviar boletos por e-mail
          </Button> */}
        </Box>
      </Box>
    </Paper>
  );
};

export default ResumeRemessa;
