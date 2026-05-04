import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getAuditoriaLog } from "../../services/beneficiarios";

import CustomTable from "../../components/CustomTable/CustomTable";
import { MenuOptionsTable } from "../../components/MenuOptionsTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import TableHeaderButton from "../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import usePermission from "../../hooks/usePermission";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    paddingRight: 50,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "0px",
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const LogsAuditoria = () => {
  const token = useAuth();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const [listaLogs, setListaLogs] = useState([]);
  const [filter, setFilter] = useState({
    tipo: "contas", //"contas" "conta_pagamento_pix" "contrato_aluguel" "pagamento_contrato_aluguel" "transferencia_estabelecimento" "cartao_privado"
    credenciado_documento: "",
    operador_cpf: "",
    operador_email: "",
    beneficiario_documento: "",
    tipo_beneficio_id: "",
    created_at: "",
    event: " ",
    external_msk: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);

  const resetFilter = () => {
    setFilter({
      tipo: "contas",
      credenciado_documento: "",
      operador_cpf: "",
      operador_email: "",
      beneficiario_documento: "",
      tipo_beneficio_id: "",
      created_at: "",
      event: " ",
      external_msk: "",
      mostrar: "15",
    });
  };

  const filters = `tipo=${filter.tipo}&credenciado_documento=${debouncedFilter.credenciado_documento}&operador_cpf=${debouncedFilter.operador_cpf}&operador_email=${debouncedFilter.operador_email}&beneficiario_documento=${debouncedFilter.beneficiario_documento}&tipo_beneficio_id=${debouncedFilter.tipo_beneficio_id}&created_at=${debouncedFilter.created_at}&event=${debouncedFilter.event}&external_msk=${debouncedFilter.external_msk}&mostrar=${debouncedFilter.mostrar}`;

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getAuditoriaLog(token, page, filters);
      console.log(data);
      setListaLogs(data);
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page, debouncedFilter]);

  const columns = [
    {
      headerText: "Criado em",
      key: "created_at",

      CustomValue: (value) => {
        return (
          <Typography style={{ marginLeft: "6px" }}>
            {moment.utc(value).format("DD/MM/YYYY HH:mm")}
          </Typography>
        );
      },
    },
    {
      headerText: "Ação",
      key: "event",
    },
    {
      headerText: "Email",
      FullObject: (row) => {
        const data = row?.auditable;
        const email =
          data?.email ??
          data?.conta?.email ??
          data?.locatario?.user?.email ??
          data?.contrato_aluguel?.locatario?.user?.email ??
          data?.conta_origem?.user?.email;
        return <Typography>{email}</Typography>;
      },
    },
    hasPermission(
      PERMISSIONS.logs_auditoria.actions.view_previous_and_updated_data,
    )
      ? {
        headerText: "Dado anterior",
        FullObject: (row) => (
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <MenuOptionsTable JSONResponse={row?.old_values} />
          </Box>
        ),
      }
      : {},
    hasPermission(
      PERMISSIONS.logs_auditoria.actions.view_previous_and_updated_data,
    )
      ? {
        headerText: "Dado atualizado",
        FullObject: (row) => (
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <MenuOptionsTable JSONResponse={row?.new_values} />
          </Box>
        ),
      }
      : {},
    ...(filter.tipo === "cartao_privado"
      ? [
        {
          headerText: "Usuário",
          key: "auditable.user.nome",
        },
        {
          headerText: "CPF do beneficiário",
          key: "auditable.user.documento",
        },
        {
          headerText: "Benefício",
          key: "auditable.tipo_beneficio.nome_beneficio",
        },
        {
          headerText: "Status",
          key: "auditable.status",
        },
        {
          headerText: "Dados do Cartão",
          key: "auditable.external_msk",
        },
      ]
      : []),
    {
      headerText: "IP",
      key: "ip_address",
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
          <Typography className={classes.pageTitle}>Logs</Typography>

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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ margin: 30 }}
          >
            {hasPermission(PERMISSIONS.logs_auditoria.list.view) && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextFieldCpfCnpj
                    placeholder="Documento credenciado"
                    value={filter.credenciado_documento}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        credenciado_documento: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <ReactInputMask
                    mask={"999.999.999-99"}
                    value={filter.operador_cpf}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        operador_cpf: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        placeholder="CPF operador"
                        variant="outlined"
                      />
                    )}
                  </ReactInputMask>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Email operador"
                    variant="outlined"
                    value={filter.operador_email}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        operador_email: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel id="tipo_label" shrink="true">
                    Tipo
                  </InputLabel>
                  <Select
                    labelId="tipo_label"
                    variant="outlined"
                    fullWidth
                    value={filter.tipo}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        tipo: e.target.value,
                        beneficiario_documento: "",
                        tipo_beneficio_id: "",
                      });
                    }}
                  >
                    <MenuItem value="contas">Contas</MenuItem>
                    <MenuItem value="conta_pagamento_pix">
                      Pagamento Pix
                    </MenuItem>
                    <MenuItem value="contrato_aluguel">
                      Contrato de aluguel
                    </MenuItem>
                    <MenuItem value="pagamento_contrato_aluguel">
                      Pagamento de contrato aluguel
                    </MenuItem>
                    <MenuItem value="transferencia_estabelecimento">
                      Transferência estabelecimento
                    </MenuItem>
                    <MenuItem value="cartao_privado">Cartão</MenuItem>
                  </Select>
                </Grid>

                {filter.tipo === "cartao_privado" && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <ReactInputMask
                        mask={"999.999.999-99"}
                        value={filter.beneficiario_documento}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            beneficiario_documento: e.target.value,
                          });
                        }}
                      >
                        {() => (
                          <TextField
                            fullWidth
                            placeholder="CPF beneficiário"
                            variant="outlined"
                          />
                        )}
                      </ReactInputMask>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <ReactInputMask
                        mask={"9999"}
                        value={filter.external_msk}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            external_msk: e.target.value,
                          });
                        }}
                      >
                        {() => (
                          <TextField
                            fullWidth
                            placeholder="Final cartão"
                            variant="outlined"
                          />
                        )}
                      </ReactInputMask>
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
                  </>
                )}

                <Grid item xs={12} sm={4}>
                  <InputLabel id="event_label" shrink="true">
                    Ação
                  </InputLabel>
                  <Select
                    labelId="event_label"
                    variant="outlined"
                    fullWidth
                    value={filter.event}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({ ...filter, event: e.target.value });
                    }}
                  >
                    <MenuItem value=" ">Todas</MenuItem>
                    <MenuItem value="updated">Updated</MenuItem>
                    <MenuItem value="created">Created</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Pesquisar por data"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    InputLabelProps={{
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
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilter}
                />
              </Grid>
            )}
          </Box>
        </Box>
      </Box>

      {hasPermission(PERMISSIONS.logs_auditoria.list.view) && (
        <Box className={classes.tableContainer}>
          {!loading && listaLogs.data && listaLogs.per_page ? (
            <CustomTable columns={columns} data={listaLogs.data} />
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
              count={listaLogs.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LogsAuditoria;
