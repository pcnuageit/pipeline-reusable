import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useState } from "react";
import SelectConta from "../../components/SelectConta";
import { APP_CONFIG } from "../../constants/config";
import ListaFolhaDePagamentoAutorizar from "../GerenciarContasSecretarias/AutorizarPagamentoBeneficiariosVoucher";
import AutorizarPagamentoContratoAluguel from "../GerenciarContasSecretarias/AutorizarPagamentoContratoAluguel";
import ListaBeneficiariosCartao from "../GerenciarContasSecretarias/PagamentoBeneficiariosCartao";
import ListaBeneficiariosVoucher from "../GerenciarContasSecretarias/PagamentoBeneficiariosVoucher";
import PagamentoContratoAluguel from "../GerenciarContasSecretarias/PagamentoContratoAluguel";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "25px",
    width: "100%",
    "@media (max-width: 1440px)": {
      width: "950px",
    },
    "@media (max-width: 1280px)": {
      width: "850px",
    },
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const screenType = {
  aprovarVoucher: "Aprovação de Pagamento conta voucher",
  aprovarContratoAluguel: "Aprovação de Pagamento de contrato de aluguel",
  cargaCartao: "Carga de cartão privado",
  cargaVoucher: "Carga de conta voucher",
  cargaContratoAluguel: "Carga de contrato de aluguel",
};

export default function PainelCentralizador() {
  const classes = useStyles();
  const [selectedSecretaria, setSelectedSecretaria] = useState("");
  const [selectedScreen, setSelectedScreen] = useState("");

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>
            Painel centralizador
          </Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
            padding: "8px",
          }}
        >
          <Grid container spacing={3} style={{ margin: "30px" }}>
            <Grid item xs={6}>
              <SelectConta
                label="Secretaria"
                value={selectedSecretaria}
                onChange={setSelectedSecretaria}
                type="secretaria"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} style={{ margin: "30px" }}>
            <Grid item sm={3} xs={12}>
              <InputLabel id="solicitacao-de-cargas-label" shrink="true">
                Aprovação de cargas
              </InputLabel>
              <Select
                labelId="solicitacao-de-cargas-label"
                value={selectedScreen}
                onChange={(e) => setSelectedScreen(e.target.value)}
                variant="outlined"
                fullWidth
                displayEmpty
                renderValue={(v) => v || "Selecione"}
                disabled={!selectedSecretaria}
              >
                {Object.keys(screenType).map((obj) => (
                  <MenuItem value={screenType[obj]}>{screenType[obj]}</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <ScreenSelector
            screen={selectedScreen}
            selectedSecretaria={selectedSecretaria}
          />
        </Box>
      </Box>
    </Box>
  );
}

function ScreenSelector({ screen, selectedSecretaria }) {
  switch (screen) {
    case screenType.aprovarVoucher:
      return (
        <ListaFolhaDePagamentoAutorizar
          tipo_beneficio_id={selectedSecretaria}
        />
      );
    case screenType.aprovarContratoAluguel:
      return (
        <AutorizarPagamentoContratoAluguel
          tipo_beneficio_id={selectedSecretaria}
        />
      );
    case screenType.cargaCartao:
      return (
        <ListaBeneficiariosCartao tipo_beneficio_id={selectedSecretaria} />
      );
    case screenType.cargaContratoAluguel:
      return (
        <PagamentoContratoAluguel tipo_beneficio_id={selectedSecretaria} />
      );
    case screenType.cargaVoucher:
      return (
        <ListaBeneficiariosVoucher tipo_beneficio_id={selectedSecretaria} />
      );
    default:
      return null;
  }
}
