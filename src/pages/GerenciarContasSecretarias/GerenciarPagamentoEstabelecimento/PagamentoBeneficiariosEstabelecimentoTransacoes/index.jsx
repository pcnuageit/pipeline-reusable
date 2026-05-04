import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { postAuthMeAction } from "../../../../actions/actions";
import { APP_CONFIG } from "../../../../constants/config";
import useAuth from "../../../../hooks/useAuth";
import useDebounce from "../../../../hooks/useDebounce";
import { getPagamentosEstabelecimentoTransacoes } from "../../../../services/beneficiarios";
import px2vw from "../../../../utils/px2vw";

import CurrencyInput from "react-currency-input";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../../../components/MenuOptionsTable";
import SelectBeneficio from "../../../../components/SelectBeneficio";
import TableHeaderButton from "../../../../components/TableHeaderButton";
import usePermission from "../../../../hooks/usePermission";
import { documentMask } from "../../../../utils/documentMask";
import { translateStatus } from "../../../../utils/translateStatus";

moment.locale("pt-br");

const columns = [
  {
    headerText: "Data",
    key: "created_at",
    CustomValue: (date) => (
      <Typography>{moment.utc(date).format("DD MMMM YYYY")}</Typography>
    ),
  },
  {
    headerText: "ID",
    key: "estabelecimento_conta.external_id",
  },
  {
    headerText: "Secretaria",
    key: "conta_origem",
    CustomValue: (data) => (
      <>
        <Typography style={{ lineBreak: "loose" }}>
          {data?.razao_social ?? data?.nome}
        </Typography>
        <Typography style={{ lineBreak: "loose" }}>
          {documentMask(data?.cnpj ?? data?.documento)}
        </Typography>
      </>
    ),
  },
  {
    headerText: "Estabelecimento",
    key: "conta_destino",
    CustomValue: (data) => (
      <>
        <Typography style={{ lineBreak: "loose" }}>
          {data?.razao_social ?? data?.nome}
        </Typography>
        <Typography style={{ lineBreak: "loose" }}>
          {documentMask(data?.cnpj ?? data?.documento)}
        </Typography>
      </>
    ),
  },
  {
    headerText: "Valor do pagamento",
    key: "valor",
    CustomValue: (valor) => (
      <Typography style={{ lineBreak: "auto" }}>
        R$
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },
  {
    headerText: "Benefício",
    key: "tipo_beneficio.nome_beneficio",
  },
  {
    headerText: "Status Transação",
    key: "status",
    CustomValue: (status) => <Typography>{translateStatus(status)}</Typography>,
  },
  {
    headerText: "Descrição",
    key: "pagamento_pix.descricao",
  },
  { key: "menu" },
];

export default function PagamentoBeneficiariosEstabelecimentoTransacoes() {
  const token = useAuth();
  const dispatch = useDispatch();
  const id = useParams()?.subsectionId ?? "";
  const { hasPermission, PERMISSIONS } = usePermission();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    created_at: "",
    tipo_beneficio_id: "",
    status: " ",
    id: "",
    razao_social: "",
    cnpj: "",
    valor_total: "", //valor do pagamento
    documento: "",
    nome: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
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
    currency: {
      font: "inherit",
      color: "currentColor",
      width: "100%",
      border: "1px solid gray",
      height: "1.1876em",
      margin: 0,
      display: "block",
      padding: "6px 0 7px",
      minWidth: 0,
      background: "none",
      boxSizing: "content-box",
      animationName: "mui-auto-fill-cancel",
      letterSpacing: "inherit",
      animationDuration: "10ms",
      paddingLeft: "5px",
    },
  }))();

  const resetFilters = () => {
    setPage(1);
    setFilter({
      created_at: "",
      tipo_beneficio_id: "",
      status: " ",
      id: "",
      razao_social: "",
      cnpj: "",
      valor_total: "",
      documento: "",
      nome: "",
    });
  };

  const filters = `pagamento_estabelecimento_id=${id}&created_at=${filter.created_at}&tipo_beneficio_id=${filter.tipo_beneficio_id}&status=${filter.status}&id=${filter?.id}&razao_social=${filter?.razao_social}&cnpj=${filter?.cnpj}&nome=${filter?.nome}&valor_total=${filter?.valor_total}&documento=${filter?.documento}&nome=${filter?.nome}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getPagamentosEstabelecimentoTransacoes(
        token,
        id,
        page,
        filters,
      );
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

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
          <Typography className={useStyles.pageTitle}>
            Transações Pagamento de Estabelecimento
          </Typography>

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
            {hasPermission(
              PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view,
            ) && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Pesquisar por data"
                    variant="outlined"
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    value={filter.created_at}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        created_at: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectBeneficio
                    state={filter?.tipo_beneficio_id}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        tipo_beneficio_id: e.target.value,
                      }));
                    }}
                    filterList={false}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel id="Status_label" shrink="true">
                    Status
                  </InputLabel>
                  <Select
                    labelId="Status_label"
                    variant="outlined"
                    fullWidth
                    required
                    value={filter.status}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }));
                    }}
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"succeeded"}>
                      {translateStatus("succeeded")}
                    </MenuItem>
                    <MenuItem value={"pending"}>
                      {translateStatus("pending")}
                    </MenuItem>
                    <MenuItem value={"failed"}>
                      {translateStatus("failed")}
                    </MenuItem>
                    <MenuItem value={"rejected"}>
                      {translateStatus("rejected")}
                    </MenuItem>
                    <MenuItem value={"canceled"}>
                      {translateStatus("canceled")}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <div style={{ position: "relative", marginTop: "16px" }}>
                    <label
                      style={{
                        color: "#15191E",
                        fontFamily: "Montserrat-SemiBold",
                        fontWeight: "bold",
                        position: "absolute",
                        top: "-20px",
                        left: "14px",
                        fontSize: "0.80rem",
                        pointerEvents: "none",
                      }}
                    >
                      Pesquisar por valor
                    </label>
                    <div
                      style={{
                        height: "45px",
                        borderRadius: "27px",
                        border: "1px solid",
                      }}
                    >
                      <CurrencyInput
                        value={filter.valor_total}
                        onChangeEvent={(event, maskedValue, rawValue) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            valor_total: rawValue,
                          }));
                        }}
                        style={{
                          color: "#15191E",
                          fontFamily: "Montserrat-Thin",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          width: "100%",
                          height: "100%",
                          padding: "0 14px",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          borderRadius: "27px",
                        }}
                        type="text"
                        decimalSeparator=","
                        thousandSeparator="."
                        prefix="R$ "
                      />
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Pesquisar por razão social"
                    value={filter.razao_social}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        razao_social: e.target.value,
                      }));
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Pesquisar por CNPJ"
                    value={filter.cnpj}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        cnpj: e.target.value,
                      }));
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Pesquisar por nome"
                    value={filter.nome}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        nome: e.target.value,
                      }));
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Pesquisar por CPF"
                    value={filter.documento}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        documento: e.target.value,
                      }));
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Pesquisar por ID"
                    value={filter.id}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        id: e.target.value,
                      }));
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list
                  .view,
              ) && (
                <TableHeaderButton
                  text="Limpar"
                  color="red"
                  onClick={resetFilters}
                  Icon={Delete}
                />
              )}

              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.actions
                  .header,
              ) && (
                <ExportTableButtons
                  token={token}
                  path={"estabelecimento/transacoes"}
                  page={page}
                  filters={filters}
                />
              )}
            </Grid>
          </Box>

          <Typography
            className={useStyles.pageTitle}
            style={{
              marginLeft: "30px",
              paddingBottom: "16px",
              marginBottom: "1px",
            }}
          >
            CONTAS RECENTES
          </Typography>
        </Box>

        {hasPermission(
          PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view,
        ) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaContas?.data && listaContas?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    data={listaContas?.data}
                    columns={columns}
                    Editar={({ row }) => (
                      <MenuOptionsTable
                        row={row}
                        JSONResponse={
                          row?.pagamento_pix?.response?.webhook?.data
                        }
                      />
                    )}
                  />
                </TableContainer>
              </Box>
            ) : (
              <Box>
                <LinearProgress color="secondary" />
              </Box>
            )}

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
                count={listaContas?.last_page}
                onChange={(e, value) => setPage(value)}
                page={page}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
