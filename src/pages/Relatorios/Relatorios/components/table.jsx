import {
  Box,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import moment from "moment";
import "moment/locale/pt-br";
import { useState } from "react";

import { APP_CONFIG } from "../../../../constants/config";
import useAuth from "../../../../hooks/useAuth";
import useDebounce from "../../../../hooks/useDebounce";

import { Pagination } from "@material-ui/lab";
import { Delete, Search } from "@mui/icons-material";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../../components/ExportTableButtons";
import SelectBeneficio from "../../../../components/SelectBeneficio";
import SelectCidade from "../../../../components/SelectCidade";
import SelectConta from "../../../../components/SelectConta";
import TableHeaderButton from "../../../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../../../components/TextFieldCpfCnpj";

moment.locale("pt-br");

export default function Table({
  title = "",
  callback = async () => null,
  columns = [],
  extraFilters = false,
}) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaArquivos, setListaArquivos] = useState();
  const [filter, setFilter] = useState({
    conta_id: "",
    tipo_beneficio_id: "",
    data_inicio: "",
    data_fim: "",
    documento_beneficiario: "",
    nome_beneficiario: "",
    cidade: "",
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
      documento_beneficiario: "",
      nome_beneficiario: "",
      cidade: "",
      mostrar: "15",
    });
  };

  const filters = `conta_id=${debouncedFilter?.conta_id}&tipo_beneficio_id=${debouncedFilter?.tipo_beneficio_id}&data_inicio=${debouncedFilter?.data_inicio}&data_fim=${debouncedFilter?.data_fim}&documento_beneficiario=${debouncedFilter?.documento_beneficiario}&nome_beneficiario=${debouncedFilter?.nome_beneficiario}&cidade=${debouncedFilter.cidade}&mostrar=${debouncedFilter?.mostrar}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await callback(token, page, filters);
      setListaArquivos(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getData(1);
  // }, [page, debouncedFilter]);

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
            <Typography className={useStyles.pageTitle}>{title}</Typography>

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

              {extraFilters && (
                <>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Nome do beneficiário"
                      variant="outlined"
                      InputLabelProps={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                      value={filter.nome_beneficiario}
                      onChange={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          nome_beneficiario: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextFieldCpfCnpj
                      placeholder="Docuemnto do beneficiário"
                      value={filter.documento_beneficiario}
                      onChange={(e) => {
                        setPage(1);
                        setFilter({
                          ...filter,
                          documento_beneficiario: e.target.value,
                        });
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <SelectCidade
                      state={filter.cidade}
                      setState={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          cidade: e.target.value,
                        }));
                      }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={3}>
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
              </Grid>

              <TableHeaderButton
                text="Buscar"
                onClick={() => getData(1)}
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
                path={
                  title === "Saldo por cartão"
                    ? "dashboard/saldo-por-cartao"
                    : "dashboard/saldo-por-cidade"
                }
                page={page}
                filters={filters}
              />
            </Grid>
          </Box>
        </Box>

        <Box className={useStyles.tableContainer}>
          {listaArquivos?.data && listaArquivos?.meta?.per_page && (
            <Box>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable data={listaArquivos?.data} columns={columns} />
              </TableContainer>
            </Box>
          )}

          {loading && (
            <Box>
              <LinearProgress color="secondary" />
            </Box>
          )}

          {listaArquivos?.meta?.last_page &&
            listaArquivos?.meta?.last_page > 1 && (
              <Box
                display="flex"
                alignSelf="flex-end"
                marginTop="8px"
                justifyContent="space-between"
              >
                <Pagination
                  variant="outlined"
                  color="secondary"
                  size="large"
                  count={listaArquivos?.meta?.last_page}
                  onChange={(e, value) => {
                    setPage(value);
                    getData(value);
                  }}
                  page={page}
                />
              </Box>
            )}
        </Box>
      </Box>
    </Box>
  );
}
