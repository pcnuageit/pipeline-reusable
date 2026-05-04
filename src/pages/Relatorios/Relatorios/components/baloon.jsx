import {
  Box,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";

import { APP_CONFIG } from "../../../../constants/config";
import useAuth from "../../../../hooks/useAuth";
import useDebounce from "../../../../hooks/useDebounce";

import { Delete, Search } from "@mui/icons-material";
import CustomCard from "../../../../components/CustomCard/CustomCard";
import { ExportTableButtons } from "../../../../components/ExportTableButtons";
import SelectBeneficio from "../../../../components/SelectBeneficio";
import SelectConta from "../../../../components/SelectConta";
import TableHeaderButton from "../../../../components/TableHeaderButton";
import { getDashboardIndicadoresGerais } from "../../../../services/beneficiarios";

moment.locale("pt-br");

export default function Baloon() {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaArquivos, setListaArquivos] = useState();
  const [filter, setFilter] = useState({
    conta_id: "",
    tipo_beneficio_id: "",
    data_inicio: "",
    data_fim: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const useStyles = makeStyles((theme) => ({
    tableContainer: { marginTop: "1px" },
    pageTitle: {
      color: APP_CONFIG.mainCollors.primary,
      fontFamily: "Montserrat-SemiBold",
      marginBottom: "1em",
    },
  }))();

  const resetFilters = () => {
    setPage(1);
    setFilter({
      conta_id: "",
      tipo_beneficio_id: "",
      data_inicio: "",
      data_fim: "",
      mostrar: "15",
    });
  };

  const filters = `conta_id=${debouncedFilter?.conta_id}&tipo_beneficio_id=${debouncedFilter?.tipo_beneficio_id}&data_inicio=${debouncedFilter?.data_inicio}&data_fim=${debouncedFilter?.data_fim}&mostrar=${debouncedFilter?.mostrar}`;

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getDashboardIndicadoresGerais(
        token,
        page,
        filters,
      );
      setListaArquivos(data);
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
              Indicadores Gerais
            </Typography>

            <Grid
              container
              spacing={3}
              style={{ alignItems: "center", marginBottom: "8px" }}
            >
              <Grid item xs={12} sm={3}>
                <SelectBeneficio
                  state={filter?.tipo_beneficio_id}
                  setState={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      tipo_beneficio_id: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <SelectConta
                  label="Conta"
                  value={filter?.conta_id}
                  onChange={(value) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      conta_id: value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Data inicial"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  value={filter.data_inicio}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      data_inicio: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Data final"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  value={filter.data_fim}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      data_fim: e.target.value,
                    }));
                  }}
                />
              </Grid>

              {/* <Grid item xs={12} sm={3}>
                <InputLabel id="mostrar_label" shrink="true">
                  Itens por página
                </InputLabel>
                <Select
                  labelId="mostrar_label"
                  value={filter.mostrar}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({ ...filter, mostrar: e.target.value });
                  }}
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value={"15"}>15</MenuItem>
                  <MenuItem value={"30"}>30</MenuItem>
                  <MenuItem value={"45"}>45</MenuItem>
                  <MenuItem value={"50"}>50</MenuItem>
                </Select>
              </Grid> */}

              <TableHeaderButton
                text="Buscar"
                onClick={getData}
                Icon={Search}
              />

              <TableHeaderButton
                text="Limpar"
                onClick={resetFilters}
                Icon={Delete}
                color="red"
              />

              <ExportTableButtons
                token={token}
                path={"dashboard/indicadores-gerais"}
                page={page}
                filters={filters}
              />
            </Grid>
          </Box>
        </Box>

        <Box className={useStyles.tableContainer}>
          {loading && (
            <Box>
              <LinearProgress color="secondary" />
            </Box>
          )}

          {!loading && listaArquivos && (
            <>
              <Box>
                <Grid container spacing={3}>
                  <Card
                    title="Contas ativas"
                    value={listaArquivos["count_ativo"]}
                  />
                  <Card
                    title="Contas bloqueadas"
                    value={listaArquivos["count_bloqueado"]}
                  />
                  <Card
                    title="Contas pendentes"
                    value={listaArquivos["count_pendente"]}
                  />
                  <Card
                    title="total de cargas"
                    value={listaArquivos["total_cargas"]}
                  />
                  <Card
                    title="total não utilizado"
                    value={listaArquivos["total_nao_utilizado"]}
                  />
                  <Card
                    title="total de transações"
                    value={listaArquivos["total_transacoes"]}
                  />
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Card({ title, value }) {
  const useStyles = makeStyles((theme) => ({
    cardContainer: {
      display: "flex",
      width: "100%",
      height: "100%",
      justifyContent: "center",
    },
    contadorStyle: {
      display: "flex",
      fontSize: "30px",
      fontFamily: "Montserrat-SemiBold",
    },
  }))();

  return (
    <Grid item xs={12} sm={4}>
      <CustomCard text={title}>
        <Box className={useStyles.cardContainer}>
          <Typography className={useStyles.contadorStyle}>{value}</Typography>
        </Box>
      </CustomCard>
    </Grid>
  );
}
