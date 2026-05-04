/* eslint-disable no-lone-blocks */

import "../../fonts/Montserrat-SemiBold.otf";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  Tooltip,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useCallback, useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getPagamentoPix } from "../../services/services";
import { documentMask } from "../../utils/documentMask";
import px2vw from "../../utils/px2vw";

import CustomTable from "../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../components/MenuOptionsTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import TableHeaderButton from "../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import usePermission from "../../hooks/usePermission";

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

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      return (
        <Typography align="center">
          {moment.utc(data).format("DD/MM/YYYY HH:mm")}
        </Typography>
      );
    },
  },
  {
    headerText: "DATA DE PAGAMENTO",
    key: "",
    FullObject: (data) => {
      const date = () => {
        if (data?.response?.create?.schedule_date)
          return moment
            .utc(data?.response?.create?.schedule_date)
            .format("DD/MM/YYYY");

        return "-";
      };

      return <Typography align="center">{date()}</Typography>;
    },
  },
  {
    headerText: "Nome",
    key: "",
    FullObject: (data) => (
      <Typography>{data?.conta?.razao_social ?? data?.conta?.nome}</Typography>
    ),
  },
  {
    headerText: "Documento",
    key: "",
    FullObject: (data) => (
      <Typography>
        {documentMask(data?.conta?.cnpj ?? data?.conta?.documento)}
      </Typography>
    ),
  },
  {
    headerText: "Destino",
    key: "",
    FullObject: (value) => {
      return (
        <Box>
          <Typography align="center">
            <b>
              {value?.nome_recebedor
                ? value?.nome_recebedor
                : value?.transacao_estabelecimento?.conta_destino?.nome
                  ? value?.transacao_estabelecimento?.conta_destino?.nome
                  : value?.pagamento_contrato_aluguel?.contrato_aluguel?.nome
                    ? value?.pagamento_contrato_aluguel?.contrato_aluguel?.nome
                    : value?.pagamento_aluguel_conta?.conta?.user?.nome}
            </b>
          </Typography>
          <Typography align="center">
            {documentMask(
              value?.documento_recebedor
                ? value?.documento_recebedor
                : value?.transacao_estabelecimento?.conta_destino?.cnpj,
            )}
          </Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Status",
    key: "status",
    CustomValue: (value) => {
      if (value === "Created") {
        return (
          <Typography
            style={{
              color: "orange",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pendente
          </Typography>
        );
      }
      if (value === "CanBeRegister") {
        return (
          <Typography
            style={{
              color: "orange",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pendente
          </Typography>
        );
      }
      if (value === "pending") {
        return (
          <Typography
            style={{
              color: "orange",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pendente
          </Typography>
        );
      }
      if (value === "sent") {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Concluído
          </Typography>
        );
      }
      if (value === "succeeded") {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pago
          </Typography>
        );
      }
      if (value === "received") {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Concluído
          </Typography>
        );
      }
      if (value === "rejected") {
        return (
          <Typography
            style={{
              color: "red",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Rejeitado
          </Typography>
        );
      }
      if (value === "Cancel") {
        return (
          <Typography
            style={{
              color: "blue",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Rejeitado
          </Typography>
        );
      }
      if (value === "canceled") {
        return (
          <Typography
            style={{
              color: "blue",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Cancelado
          </Typography>
        );
      }
      if (value === "Error") {
        return (
          <Typography
            style={{
              color: "red",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Erro
          </Typography>
        );
      }
      return (
        <Typography
          style={{
            color: "orange",
            fontWeight: "bold",
            borderRadius: "27px",
          }}
        >
          {value}
        </Typography>
      );
    },
  },
  {
    headerText: "Tipo",
    key: "tipo",
    CustomValue: (value) => <Typography>{value}</Typography>,
  },
  {
    headerText: "Situação",
    key: "response",
    CustomValue: (response) => {
      return response ? (
        <Typography
          style={{
            borderRadius: "27px",
          }}
        >
          Registrado
        </Typography>
      ) : !response ? (
        <Typography
          style={{
            borderRadius: "27px",
          }}
        >
          Falha
        </Typography>
      ) : null;
    },
  },

  {
    headerText: "Valor",
    key: "valor",
    CustomValue: (valor) => {
      return (
        <>
          R${" "}
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
  {
    headerText: "Dados Pix",
    key: "",
    FullObject: (value) => (
      <p>
        {value?.chave_recebedor
          ? value?.chave_recebedor
          : value?.transacao_estabelecimento?.conta_destino?.chave_pix
            ? value?.transacao_estabelecimento?.conta_destino?.chave_pix
            : value?.pagamento_contrato_aluguel?.contrato_aluguel?.chave_pix
              ? value?.pagamento_contrato_aluguel?.contrato_aluguel?.chave_pix
              : value?.pagamento_aluguel_conta?.conta?.chave_pix}
      </p>
    ),
  },
  {
    headerText: "Tipo Pix",
    key: "tipo_pix",
    CustomValue: (value) => <p>{value}</p>,
  },
  {
    headerText: "ID da transação",
    key: "id",
    CustomValue: (value) => <Typography>{value}</Typography>,
  },
  {
    headerText: "ID end to end",
    // key: "response.webhook.data.transaction_details.end_to_end_id",
    key: "response.create.end_to_end_id",
    CustomValue: (value) => <Typography>{value}</Typography>,
  },
  {
    headerText: "Descrição",
    key: "descricao",
    CustomValue: (descricao) => {
      return (
        <Tooltip title={descricao ? descricao : "Sem descrição"}>
          <Box>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Box>
        </Tooltip>
      );
    },
  },
  {
    headerText: "Aprovação",
    key: "aprovado",
    CustomValue: (value) => {
      return value === true ? (
        <Tooltip title="Transação Aprovada">
          <CheckIcon style={{ color: "green" }} value />
        </Tooltip>
      ) : value === false ? (
        <Tooltip title="Transação Não Aprovada">
          <ClearIcon style={{ color: "red" }} value />
        </Tooltip>
      ) : null;
    },
  },
  {
    headerText: "",
    key: "menu",
  },
];

const TransacaoPix = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const token = useAuth();
  const { hasPermission, PERMISSIONS } = usePermission();
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    cnpj: "",
    documento_estabelecimento: "",
    documento_beneficiario: "",
    email: "",
    id: "",
    status: " ",
    data_inicial: "",
    data_final: "",
    tipo_beneficio_id: " ",
    end_to_end_id: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagamentoPix, setPagamentoPix] = useState([]);

  const resetFilter = () => {
    setPage(1);
    setFilter({
      nome: "",
      documento: "",
      cnpj: "",
      documento_estabelecimento: "",
      documento_beneficiario: "",
      email: "",
      id: "",
      status: " ",
      data_inicial: "",
      data_final: "",
      tipo_beneficio_id: " ",
      end_to_end_id: "",
      mostrar: "15",
    });
  };

  const filters = `nome=${debouncedFilter.nome}&documento=${debouncedFilter.documento}&cnpj=${debouncedFilter.cnpj}&email=${debouncedFilter.email}&documento_estabelecimento=${debouncedFilter.documento_estabelecimento}&documento_beneficiario=${debouncedFilter.documento_beneficiario}&id=${debouncedFilter.id}&status=${debouncedFilter.status}&data_inicial=${debouncedFilter.data_inicial}&data_final=${debouncedFilter.data_final}&tipo_beneficio_id=${debouncedFilter.tipo_beneficio_id}&end_to_end_id=${debouncedFilter.end_to_end_id}&mostrar=${filter.mostrar}`;

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getPagamentoPix(token, page, filters);
      setPagamentoPix(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getDataCallback = useCallback(getData, [token, page, filters]);

  useEffect(() => {
    getDataCallback();
  }, [getDataCallback, debouncedFilter]);

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
          <Typography className={classes.pageTitle}>Transações PIX</Typography>
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
            {hasPermission(PERMISSIONS.transacoes.pix.list.search) && (
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
                    label="Data de criação inicial"
                    value={filter.data_inicial}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        data_inicial: e.target.value,
                      })
                    }
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
                    label="Data de criação final"
                    value={filter.data_final}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        data_final: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputLabel id="status_label" shrink="true">
                    Status
                  </InputLabel>
                  <Select
                    labelId="status_label"
                    variant="outlined"
                    fullWidth
                    value={filter.status}
                    onChange={(e) =>
                      setFilter({ ...filter, status: e.target.value })
                    }
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"pending"}>Pendente</MenuItem>
                    <MenuItem value={"succeeded"}>Pago</MenuItem>
                    {/* <MenuItem value={"received"}>Concluído</MenuItem>   */}
                    <MenuItem value={"sent"}>Concluído</MenuItem>
                    <MenuItem value={"rejected"}>Rejeitado</MenuItem>
                    <MenuItem value={"Error"}>Error</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <SelectBeneficio
                    state={filter?.tipo_beneficio_id}
                    setState={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        tipo_beneficio_id: e.target.value,
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por nome ou razão social"
                    variant="outlined"
                    value={filter.nome}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        nome: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <ReactInputMask
                    mask={"999.999.999-99"}
                    value={filter.documento}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        documento: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        placeholder="Pesquisar por CPF"
                      />
                    )}
                  </ReactInputMask>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <ReactInputMask
                    mask={"99.999.999/9999-99"}
                    value={filter.cnpj}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        cnpj: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        placeholder="Pesquisar por CNPJ"
                      />
                    )}
                  </ReactInputMask>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por ID"
                    variant="outlined"
                    value={filter.id}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        id: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextFieldCpfCnpj
                    fullWidth
                    placeholder="Pesquisar por estabelecimento"
                    variant="outlined"
                    value={filter.documento_estabelecimento}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        documento_estabelecimento: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
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

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por E-mail"
                    variant="outlined"
                    value={filter.email}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        email: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por ID end to end"
                    variant="outlined"
                    value={filter.end_to_end_id}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        end_to_end_id: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
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
              {hasPermission(PERMISSIONS.transacoes.pix.list.search) && (
                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilter}
                />
              )}

              {hasPermission(PERMISSIONS.transacoes.pix.actions.all) && (
                <ExportTableButtons
                  token={token}
                  apiPath={"pagamento-pix/export"}
                  page={page}
                  filters={filters}
                />
              )}
            </Grid>
          </Box>
        </Box>

        {hasPermission(PERMISSIONS.transacoes.pix.list.view) && (
          <Box className={classes.tableContainer}>
            {!loading && pagamentoPix.data && pagamentoPix.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns ? columns : null}
                    data={pagamentoPix.data}
                    Editar={({ row }) => (
                      <MenuOptionsTable
                        row={row}
                        getData={getData}
                        printType={"comprovante_pix"}
                        cancelPix={row?.status === "pending"}
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

export default TransacaoPix;
