import {
  Box,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";

import { APP_CONFIG } from "../../../../constants/config";
import useAuth from "../../../../hooks/useAuth";

import { ExportTableButtons } from "../../../../components/ExportTableButtons";
import { getDashboardFornecedoresPorCidade } from "../../../../services/beneficiarios";

moment.locale("pt-br");

export default function ScrollableTable() {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaArquivos, setListaArquivos] = useState();
  const useStyles = makeStyles((theme) => ({
    tableContainer: { marginTop: "1px" },
    pageTitle: {
      color: APP_CONFIG.mainCollors.primary,
      fontFamily: "Montserrat-SemiBold",
      marginBottom: "1em",
    },
  }))();

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getDashboardFornecedoresPorCidade(
        token,
        APP_CONFIG.estado,
      );
      await setListaArquivos(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box>
      <Box>
        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            <Typography className={useStyles.pageTitle}>
              Fornecedores por cidade
            </Typography>

            <Grid container spacing={3} style={{ marginBottom: "16px" }}>
              <ExportTableButtons
                token={token}
                path={"dashboard/fornecedores-por-cidade"}
                filters={`estado=${APP_CONFIG.estado}`}
              />
            </Grid>

            <Box style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Cidades: {listaArquivos?.total_cidades}</Typography>
              <Typography>
                Fornecedores: {listaArquivos?.total_fornecedores}
              </Typography>
              <Typography>
                Cidades sem fornecedores:{" "}
                {listaArquivos?.total_cidades_sem_fornecedores}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className={useStyles.tableContainer}>
          {loading && (
            <Box>
              <LinearProgress color="secondary" />
            </Box>
          )}

          {!loading && listaArquivos?.fornecedores_por_cidade && (
            <Box>
              <Grid
                container
                spacing={3}
                style={{
                  overflowY: "auto",
                  maxHeight: "300px",
                }}
              >
                {listaArquivos?.fornecedores_por_cidade?.map((obj) => {
                  return (
                    <Cell cidade={obj.cidade} numero={obj?.total_contas} />
                  );
                })}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Cell({ cidade, numero }) {
  return (
    <Grid item xs={12} sm={4}>
      <Typography>
        {cidade}: {numero}
      </Typography>
    </Grid>
  );
}
