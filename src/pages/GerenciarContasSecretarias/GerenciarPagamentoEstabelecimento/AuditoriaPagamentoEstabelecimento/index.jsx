import {
  Box,
  Checkbox,
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
import { Check, Delete, Search } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { APP_CONFIG } from "../../../../constants/config";
import useAuth from "../../../../hooks/useAuth";
import useDebounce from "../../../../hooks/useDebounce";
import { getAuditoriaPagamentoEstabelecimento } from "../../../../services/beneficiarios";
import px2vw from "../../../../utils/px2vw";

import CustomCollapseTable from "../../../../components/CustomCollapseTable/CustomCollapseTable";
import { ExportTableButtons } from "../../../../components/ExportTableButtons";
import TableHeaderButton from "../../../../components/TableHeaderButton";
import usePermission from "../../../../hooks/usePermission";
import { documentMask } from "../../../../utils/documentMask";
import FolhasDePagamentoModal from "./FolhasDePagamentoModal";

moment.locale("pt-br");

const itemColumns = [
  {
    headerText: "DAta",
    key: "data_transacao",
    CustomValue: (date) => (
      <Typography>{moment(date).format("DD/MM/YYYY, HH:mm")}</Typography>
    ),
  },
  { headerText: "NSU", key: "nsu" },
  { headerText: "Cartão", key: "cd_cartao" },
  { headerText: "Produto", key: "cd_produto" },
  {
    headerText: "Valor total",
    key: "valor_transacao",
    CustomValue: (value) => (
      <>
        <Typography>
          R${" "}
          {parseFloat(value).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      </>
    ),
  },
  {
    headerText: "Valor líquido",
    key: "valor_liquido",
    CustomValue: (value) => (
      <>
        <Typography>
          R${" "}
          {parseFloat(value).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      </>
    ),
  },
];

// const today = moment().format("DD");
// const startDate = today < 15 ? moment().set("date", 1).format("YYYY-MM-DD") : moment().set("date", 15).format("YYYY-MM-DD");
// const endDate = today < 15 ? moment().set("date", 15).format("YYYY-MM-DD") : moment().endOf("month").format("YYYY-MM-DD");

export default function AuditoriaPagamentoEstabelecimento() {
  const token = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [filter, setFilter] = useState({
    data_fechamento: "",
    data_inicio: "",
    data_fim: "",
    divergencia: false,
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const firstLoad = useRef(true);
  const [showFolhasDePagamentoModal, setShowFolhasDePagamentoModal] =
    useState(false); //bool, "sendToALL"
  const [registros, setRegistros] = useState([]);
  const { hasPermission, PERMISSIONS } = usePermission();
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
  }))();

  const columns = [
    {
      headerText: "",
      key: "",
      FullObject: (obj) => {
        const checked = registros.some((item) => item === obj?.id);

        return (
          <>
            <Box>
              <Checkbox
                color="primary"
                checked={checked}
                onChange={() => {
                  if (checked) {
                    setRegistros(registros.filter((item) => item !== obj?.id));
                  } else {
                    console.log(obj.id);
                    setRegistros((prev) => [...prev, obj?.id]);
                  }
                }}
              />
            </Box>
          </>
        );
      },
    },
    { headerText: "ID", key: "external_id" },
    { headerText: "Razão", key: "razao" },
    {
      headerText: "Pagamento",
      key: "data_previsto_pagamento",
      CustomValue: (date) => (
        <Typography>{moment(date).format("DD/MM/YYYY")}</Typography>
      ),
    },
    {
      headerText: "Fechamento",
      key: "data_fechamento",
      CustomValue: (date) => (
        <Typography>{moment(date).format("DD/MM/YYYY")}</Typography>
      ),
    },
    {
      headerText: "Valor total",
      key: "valor_bruto",
      CustomValue: (value) => (
        <>
          <Typography>
            R${" "}
            {parseFloat(value).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </>
      ),
    },
    {
      headerText: "Valor líquido",
      key: "valor_liquido",
      CustomValue: (value) => (
        <>
          <Typography>
            R${" "}
            {parseFloat(value).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </>
      ),
    },
    {
      headerText: "Valor líquido demonstrativo",
      key: "",
      FullObject: (obj) => (
        <>
          <Typography
            style={
              obj?.valor_total_liquido_demonstrativo !== obj?.valor_liquido
                ? {
                    color: "red",
                  }
                : {}
            }
          >
            R${" "}
            {parseFloat(obj?.valor_total_liquido_demonstrativo).toLocaleString(
              "pt-br",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </Typography>
        </>
      ),
    },
    { headerText: "Status", key: "status" },
    {
      headerText: "Documento",
      key: "conta",
      CustomValue: (obj) => (
        <Typography>{documentMask(obj?.cnpj ?? obj?.documento)}</Typography>
      ),
    },
    {
      headerText: "Nome",
      key: "conta",
      CustomValue: (obj) => (
        <Typography>{obj?.razao_social ?? obj?.nome}</Typography>
      ),
    },
  ];

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      data_fechamento: "",
      data_inicio: "",
      data_fim: "",
      divergencia: false,
      mostrar: "15",
    });
  };

  const filters = `data_fechamento=${filter.data_fechamento}&data_inicio=${filter.data_inicio}&data_fim=${filter.data_fim}&divergencia=${filter.divergencia}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAuditoriaPagamentoEstabelecimento(
        token,
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

  const handleSelectAll = () => {
    const selected = listaContas?.data?.map((obj) => obj?.id);
    setRegistros(selected);
  };

  useEffect(() => {
    if (!firstLoad.current) getData(token, page);
  }, [token, page]);

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
            Folha de Pagamento para Estabelecimentos
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
          }}
        >
          <Box style={{ margin: 30 }}>
            {hasPermission(
              PERMISSIONS.pagamento_estabelecimento.auditar_pagamentos.list
                .view,
            ) && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data de fechamento"
                    value={filter.data_fechamento}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        data_fechamento: e.target.value,
                      }));
                    }}
                    // defaultValue={startDate}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data inicial"
                    value={filter.data_inicio}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        data_inicio: e.target.value,
                      }));
                    }}
                    // defaultValue={startDate}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data final"
                    value={filter.data_fim}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        data_fim: e.target.value,
                      }));
                    }}
                    // defaultValue={endDate}
                  />
                </Grid>

                <TableHeaderButton
                  text="Buscar"
                  onClick={async () => {
                    firstLoad.current = false;
                    await getData(token, 1);
                  }}
                  Icon={Search}
                />

                <Grid item xs={12} sm={3}>
                  <InputLabel id="divergencia_label" shrink="true">
                    Itens divergentes
                  </InputLabel>
                  <Select
                    labelId="divergencia_label"
                    value={filter.divergencia}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({ ...filter, divergencia: e.target.value });
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value={true}>Sim</MenuItem>
                    <MenuItem value={false}>Não</MenuItem>
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
              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.auditar_pagamentos.list
                  .view,
              ) && (
                <TableHeaderButton
                  text="Limpar"
                  onClick={resetFilters}
                  Icon={Delete}
                  color="red"
                />
              )}

              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.auditar_pagamentos.actions
                  .header,
              ) && (
                <ExportTableButtons
                  token={token}
                  path={"reembolsos"}
                  page={page}
                  filters={filters}
                />
              )}

              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.auditar_pagamentos.actions
                  .create_payment,
              ) && (
                <>
                  <TableHeaderButton
                    text="Criar pagamentos selecionados"
                    onClick={() => setShowFolhasDePagamentoModal(true)}
                    Icon={Check}
                  />

                  <TableHeaderButton
                    text="Criar todos pagamentos"
                    onClick={() => setShowFolhasDePagamentoModal("sendToALL")}
                    Icon={Check}
                  />
                </>
              )}

              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.auditar_pagamentos.actions
                  .select_all,
              ) && (
                <TableHeaderButton
                  text="Selecionar todos"
                  onClick={handleSelectAll}
                  Icon={Check}
                />
              )}
            </Grid>
          </Box>
        </Box>

        {hasPermission(
          PERMISSIONS.pagamento_estabelecimento.auditar_pagamentos.list.view,
        ) && (
          <Box className={useStyles.tableContainer}>
            {!loading ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomCollapseTable
                    data={listaContas?.data ?? []}
                    columns={columns}
                    itemDataKey="demonstrativos"
                    itemColumns={itemColumns}
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

      <FolhasDePagamentoModal
        show={showFolhasDePagamentoModal}
        setShow={setShowFolhasDePagamentoModal}
        getData={getData}
        registros={registros}
        setRegistros={setRegistros}
        filters={filter}
      />
    </Box>
  );
}
