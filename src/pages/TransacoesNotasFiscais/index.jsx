/* eslint-disable no-lone-blocks */

import "../../fonts/Montserrat-SemiBold.otf";

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
import { useCallback, useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import px2vw from "../../utils/px2vw";

import { Download } from "@mui/icons-material";
import { toast } from "react-toastify";
import CustomCurrencyInput from "../../components/CustomCurrencyInput";
import CustomTable from "../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../components/ExportTableButtons";
import SelectBeneficio from "../../components/SelectBeneficio";
import SelectCidade from "../../components/SelectCidade";
import TableHeaderButton from "../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import usePermission from "../../hooks/usePermission";
import { getNotasFiscais } from "../../services/beneficiarios";
import { translateStatus } from "../../utils/translateStatus";

moment.locale("pt-br");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
  tableContainer: { marginTop: "1px", width: px2vw("100%") },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const HistoricoTransacoes = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const token = useAuth();
  const { hasPermission, PERMISSIONS } = usePermission();
  const [filter, setFilter] = useState({
    documento_conta: "",
    documento_beneficiario: "",
    tipo_beneficio_id: "",
    data_inicio: "",
    data_fim: "",
    cidade: "",
    nsu: "",
    valor: "",
    is_seeded: " ",
    status: " ",
    tipo_operacao: " ",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagamentoPix, setPagamentoPix] = useState([]);

  const resetFilter = () => {
    setPage(1);
    setFilter({
      documento_conta: "",
      documento_beneficiario: "",
      tipo_beneficio_id: "",
      data_inicio: "",
      data_fim: "",
      cidade: "",
      nsu: "",
      valor: "",
      is_seeded: " ",
      status: " ",
      tipo_operacao: " ",
      mostrar: "15",
    });
  };

  const filters = `documento_conta=${debouncedFilter.documento_conta}&documento_beneficiario=${debouncedFilter.documento_beneficiario}&tipo_beneficio_id=${debouncedFilter.tipo_beneficio_id}&data_inicio=${debouncedFilter.data_inicio}&data_fim=${debouncedFilter.data_fim}&per_page=${debouncedFilter.mostrar}&cidade=${debouncedFilter.cidade}&nsu=${debouncedFilter.nsu}&valor=${debouncedFilter.valor}&is_seeded=${debouncedFilter.is_seeded}&status=${debouncedFilter.status}&tipo_operacao=${debouncedFilter.tipo_operacao}`;

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getNotasFiscais(token, page, filters);
      setPagamentoPix(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getDataCallback = useCallback(getData, [token, page, filters]);

  const handleDownload = async (row) => {
    const file = row?.nota_fiscal?.download_url;
    if (!file) return toast.error("Este arquivo não está mais disponível.");

    try {
      toast.warning("Carregando arquivo...");

      const response = await fetch(file);
      if (!response.ok) return toast.error("Falha ao baixar o arquivo.");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.split("/").pop() || "nota-fiscal";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao baixar o arquivo.");
    }
  };

  useEffect(() => {
    getDataCallback();
  }, [getDataCallback, debouncedFilter]);

  const columns = [
    {
      headerText: "ID da transação",
      key: "id",
    },
    {
      headerText: "Data",
      key: "",
      FullObject: (data) => {
        return (
          <Typography align="center">
            {moment(data?.data_transacao ?? data?.created_at).format(
              "DD/MM/YYYY HH:mm",
            )}
          </Typography>
        );
      },
    },
    {
      headerText: "NSU",
      key: "nsu",
    },
    {
      headerText: "Tipo",
      key: "tipo_operacao",
      CustomValue: (data) => <Typography>{translateType(data)}</Typography>,
    },
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <Box>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Box>
        );
      },
    },
    ...(APP_CONFIG?.estado === "MT"
      ? [
          {
            headerText: "Valor da taxa",
            key: "",
            FullObject: (obj) => {
              if (obj?.tipo_operacao === "E") {
                return <Typography>-</Typography>;
              }

              return (
                <Box>
                  R${" "}
                  {parseFloat(obj?.valor_taxa).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Box>
              );
            },
          },
          {
            headerText: "%",
            key: "transactionable_to.taxa_transacao",
          },
          {
            headerText: "Valor líquido",
            key: "",
            FullObject: (obj) => {
              if (obj?.tipo_operacao === "E") {
                return <Typography>-</Typography>;
              }

              return (
                <Box>
                  R${" "}
                  {parseFloat(obj?.valor_liquido).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Box>
              );
            },
          },
        ]
      : []),
    {
      headerText: "Origem",
      key: "is_seeded",
      CustomValue: (v) => <Typography>{v ? "PDV" : "QR code"}</Typography>,
    },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (data) => (
        <Typography style={data === "pending" ? { color: "orange" } : {}}>
          {translateStatus(data)}
        </Typography>
      ),
    },
    {
      headerText: "Cidade",
      key: "transactionable_to.endereco.cidade",
    },
    {
      headerText: "Beneficiário",
      key: "transactionable_from",
      CustomValue: (data) => (
        <>
          <Typography>{data?.razao_social ?? data?.nome}</Typography>
          <Typography>{data?.cnpj ?? data?.documento}</Typography>
        </>
      ),
    },
    {
      headerText: "Benefício",
      key: "concorrencia_cartao.tipo_beneficio.nome_beneficio",
    },
    {
      headerText: "Credenciado",
      key: "transactionable_to",
      CustomValue: (data) => (
        <>
          <Typography>{data?.razao_social ?? data?.nome}</Typography>
          <Typography>{data?.cnpj ?? data?.documento}</Typography>
        </>
      ),
    },
    {
      headerText: "Cartão",
      key: "",
      FullObject: (obj) => (
        <Typography>
          {obj?.external_msk ?? obj?.concorrencia_cartao?.external_msk}
        </Typography>
      ),
    },
    {
      headerText: "",
      key: "menu",
    },
  ];

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
          <Typography className={classes.pageTitle}>Notas fiscais</Typography>

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
          }}
        >
          <Box style={{ margin: 30 }}>
            {hasPermission(PERMISSIONS.transacoes.historico.list.search) && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data inicial"
                    value={filter.data_inicio}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        data_inicio: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data final"
                    value={filter.data_fim}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        data_fim: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <ReactInputMask
                    mask={"999.999.999-99"}
                    value={filter.documento_beneficiario}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        documento_beneficiario: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        placeholder="Pesquisar por beneficiário"
                        variant="outlined"
                      />
                    )}
                  </ReactInputMask>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextFieldCpfCnpj
                    placeholder="Pesquisar por CNPJ"
                    value={filter.documento_conta}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        documento_conta: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    label="NSU"
                    value={filter.nsu}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        nsu: e.target.value,
                      });
                    }}
                    variant="outlined"
                    fullWidth
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
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <SelectCidade
                    state={filter?.cidade}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        cidade: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <CustomCurrencyInput
                  value={filter.valor}
                  onChangeEvent={(event, maskedvalue, floatvalue) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      valor: floatvalue,
                    });
                  }}
                  gridSm={3}
                />

                <Grid item xs={12} sm={3}>
                  <InputLabel id="origem_label" shrink="true">
                    Origem
                  </InputLabel>
                  <Select
                    labelId="origem_label"
                    value={filter.is_seeded}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({ ...filter, is_seeded: e.target.value });
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value={" "}>Todas</MenuItem>
                    <MenuItem value={true}>PDV</MenuItem>
                    <MenuItem value={false}>QR Code</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputLabel id="status_label" shrink="true">
                    Status
                  </InputLabel>
                  <Select
                    labelId="status_label"
                    value={filter.status}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({ ...filter, status: e.target.value });
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"succeeded"}>
                      {translateStatus("succeeded")}
                    </MenuItem>
                    <MenuItem value={"pending"}>
                      {translateStatus("pending")}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputLabel id="tipo_operacao_label" shrink="true">
                    Tipo de operacao
                  </InputLabel>
                  <Select
                    labelId="tipo_operacao_label"
                    value={filter.tipo_operacao}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({ ...filter, tipo_operacao: e.target.value });
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value={" "}>Todas</MenuItem>
                    {/* <MenuItem value={"C"}>{translateType("C")}</MenuItem> */}
                    <MenuItem value={"D"}>{translateType("D")}</MenuItem>
                    <MenuItem value={"E"}>{translateType("E")}</MenuItem>
                  </Select>
                </Grid>

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
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(PERMISSIONS.transacoes.historico.list.search) && (
                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilter}
                />
              )}

              {hasPermission(PERMISSIONS.transacoes.historico.actions.all) && (
                <ExportTableButtons
                  token={token}
                  path={"transacoes"}
                  page={page}
                  filters={filters + "&nota-fiscal=true"}
                />
              )}
            </Grid>
          </Box>
        </Box>

        {hasPermission(PERMISSIONS.transacoes.historico.list.view) && (
          <Box className={classes.tableContainer}>
            {!loading && pagamentoPix.data && pagamentoPix.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={pagamentoPix.data}
                    Editar={({ row }) => (
                      <Download onClick={() => handleDownload(row)} />
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
                count={pagamentoPix.last_page}
                onChange={(e, value) => setPage(value)}
                page={page}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HistoricoTransacoes;

function translateType(tipo) {
  switch (tipo) {
    case "C":
      return "Crédito";
    case "D":
      return "Débito";
    case "E":
      return "Estorno";
    default:
      return tipo;
  }
}
