import { Box, IconButton, Typography, makeStyles } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import moment from "moment";
import "moment/locale/pt-br";

import { APP_CONFIG } from "../../../constants/config";
import {
  getDashboardSaldoPorCartao,
  getDashboardSaldoPorCidade,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";
import Baloon from "./components/baloon";
import ScrollableTable from "./components/scrollableTable";
import Table from "./components/table";

moment.locale("pt-br");

export default function Relatorios() {
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
      width: px2vw("100%"),
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
  }))();

  return (
    <Box className={useStyles.root}>
      <Box className={useStyles.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={useStyles.pageTitle}>Relatórios</Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <RefreshIcon></RefreshIcon>
            </IconButton>
          </Box>
        </Box>

        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            <Baloon />

            <Table
              title={"Saldo por cartão"}
              callback={getDashboardSaldoPorCartao}
              extraFilters
              columns={[
                {
                  headerText: "Beneficiário",
                  key: "user_name",
                },
                {
                  headerText: "Documento",
                  key: "user_documento",
                },
                {
                  headerText: "status",
                  key: "status",
                },
                {
                  headerText: "Total em cargas",
                  key: "total_cargas",
                },
                {
                  headerText: "Total em transações",
                  key: "total_transacoes",
                },
                {
                  headerText: "Saldo",
                  key: "saldo_beneficiario",
                },
              ]}
            />

            <Table
              title={"Saldo por cidade"}
              callback={getDashboardSaldoPorCidade}
              columns={[
                {
                  headerText: "cidade",
                  key: "cidade",
                },
                {
                  headerText: "total de cargas",
                  key: "total_cargas",
                },
                {
                  headerText: "Saldo transacionado",
                  key: "total_transacoes",
                },
              ]}
            />

            <ScrollableTable />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
