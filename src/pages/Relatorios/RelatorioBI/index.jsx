import { Box, IconButton, Typography, makeStyles } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import moment from "moment";
import "moment/locale/pt-br";

import { APP_CONFIG } from "../../../constants/config";
import px2vw from "../../../utils/px2vw";

moment.locale("pt-br");

export default function RelatorioBI() {
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
          <Typography className={useStyles.pageTitle}>Relatório BI</Typography>

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
            <Box
              style={{
                display: "flex",
                aspectRatio: "1.7777",
              }}
            >
              <iframe
                title="Dashboard FUNDAAF-MT"
                src="https://app.powerbi.com/view?r=eyJrIjoiZjkyNWI1ZDQtY2YwOS00NWIwLWFmYzktM2RiMDAyOTE2ZTYwIiwidCI6IjhlOTY1ODZjLTYwYjgtNDdjYS05NTE0LWZlMTMxYmVlMTU1YSJ9"
                allowFullScreen="true"
                style={{
                  border: "none",
                  width: "100%",
                  minHeight: 0,
                }}
              ></iframe>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
