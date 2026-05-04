import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import useDebounce from "../../../../hooks/useDebounce";

import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Refresh";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Pagination } from "@material-ui/lab";
import { toast } from "react-toastify";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import SupportStatusBadge from "../../components/SupportStatusBadge";
import useQuery from "../../hooks/useQuery";
import {
  useGetAntecipacoesSalariaisQuery,
  useGetExportAntecipacoesSalariaisMutation,
} from "../../services/AntecipacaoSalarial";
import { formatMoney } from "../../utils/money";

import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect } from "react";
import { APP_CONFIG } from "../../../../constants/config";
import { useGetAntecipacaoSalarialProposalQuery } from "../../../AntecipacaoSalarialProposal/services/AntecipacaoSalarialProposal";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "25px",
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const AntecipacaoSalarialListPage = () => {
  const queryParams = useQuery();
  const { id: proposalId } = useParams();
  /* const statusParams = queryParams.get('status'); */
  const [exportFinancialSupports] = useGetExportAntecipacoesSalariaisMutation();
  const { data: proposal } = useGetAntecipacaoSalarialProposalQuery(
    proposalId,
    {
      skip: !proposalId,
      refetchOnMountOrArgChange: true,
    }
  );
  const initialFilters = {
    id: "",
    status: " ",
    like: "",
    order: "",
    mostrar: "",
    data: "",
    from_valor_liberado: 0,
    to_valor_liberado:
      proposal && proposal.valor_liberado ? proposal.valor_liberado : 200,
  };
  const [filters, setFilters] = useState({
    id: "",
    status: " ",
    like: "",
    order: "",
    mostrar: "",
    data: "",
    from_valor_liberado: 0,
    to_valor_liberado: 200,
  });

  /* useEffect(() => {
		setFilters({ ...filters, status: statusParams || ' ' });
	}, [statusParams, filters]); */

  useEffect(() => {
    if (proposal) {
      setFilters({
        ...filters,
        to_valor_liberado: proposal.valor_liberado,
      });
    }
  }, [proposal]);

  const classes = useStyles();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const ec_like = useDebounce(filters.like, 800);
  const supportId = useDebounce(filters.id, 800);
  const from_valor_liberado = useDebounce(filters.from_valor_liberado, 800);
  const to_valor_liberado = useDebounce(filters.to_valor_liberado, 800);

  const { data: financialSupports, isLoading } =
    useGetAntecipacoesSalariaisQuery(
      {
        proposalId,
        id: supportId,
        status: filters.status,
        created_at: filters.data,
        ec_like,
        valor_liberado: `${from_valor_liberado},${to_valor_liberado}`,
        page,
      },
      {
        skip: !proposalId,
        refetchOnMountOrArgChange: true,
      }
    );

  const columns = [
    {
      headerText: <FontAwesomeIcon icon={faCalendar} size="lg" />,
      key: "created_at",
      CustomValue: (value) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {moment.utc(value).format("DD/MM/YYYY HH:mm")}
          </Box>
        );
      },
    },
    {
      headerText: "E-mail",
      key: "conta",
      CustomValue: (conta) => conta.email,
    },
    { headerText: "Nome", key: "conta", CustomValue: (conta) => conta.nome },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (value) => <SupportStatusBadge value={value} />,
    },

    {
      headerText: "Valor inicial",
      key: "proposta.valor_inicial",
    },
    {
      headerText: "Valor final",
      key: "proposta.valor_final",
    },
    {
      headerText: "Valor liberado",
      key: "proposta.valor_liberado",
    },
  ];

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleExportar = async () => {
    try {
      const res = await exportFinancialSupports({
        proposalId,
        id: supportId,
        status: filters.status,
        ec_like,
        created_at: filters.data,
        valor_disponivel: `${from_valor_liberado},${to_valor_liberado}`,
      }).unwrap();
      toast.warning(
        res?.message ??
          "A exportação pode demorar um pouco, por favor aguarde..."
      );
      if (res?.url) {
        window.open(`${res.url}`, "", "");
        toast.success("Exportação gerada com sucesso!");
      }
    } catch (e) {
      toast.error("Erro ao exportar Antecipações Salariais!");
    }
  };

  return isLoading || !financialSupports ? (
    <div />
  ) : (
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
          <Typography className={classes.pageTitle}>
            Antecipações Salariais
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por nome, documento, email..."
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filters.like}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({
                      ...filters,
                      like: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por ID da antecipação"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filters.id}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({
                      ...filters,
                      id: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Select
                  style={{
                    marginTop: "10px",
                    color: APP_CONFIG.mainCollors.secondary,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <MenuItem
                    value={" "}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Status
                  </MenuItem>
                  <MenuItem
                    value={"assinado"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Assinado
                  </MenuItem>
                  <MenuItem
                    value={"analise"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Em Analise
                  </MenuItem>
                  <MenuItem
                    value={"pendente"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pendente
                  </MenuItem>
                  <MenuItem
                    value={"recusado"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Recusado
                  </MenuItem>
                  <MenuItem
                    value={"validacao_negada"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Validação Negada
                  </MenuItem>
                  <MenuItem
                    value={"cancelado"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Cancelado
                  </MenuItem>
                  <MenuItem
                    value={"ativo"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Ativo
                  </MenuItem>
                  <MenuItem
                    value={"atrasado"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Atrasado
                  </MenuItem>
                  <MenuItem
                    value={"finalizado"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Finalizado
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  label="Data da antecipação"
                  value={filters.data}
                  onChange={(e) =>
                    setFilters({ ...filters, data: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" flexDirection="column">
                  <Typography variant="body2">
                    Valor liberado:{" "}
                    <Typography variant="body2" color="textSecondary">
                      {formatMoney(filters.from_valor_liberado)} -{" "}
                      {formatMoney(filters.to_valor_liberado)}
                    </Typography>
                  </Typography>
                  <Slider
                    value={[
                      filters.from_valor_liberado,
                      filters.to_valor_liberado,
                    ]}
                    min={0}
                    max={proposal ? proposal.valor_liberado : 0}
                    valueLabelDisplay="auto"
                    onChange={(_, newValue) => {
                      const [from, to] = newValue;

                      setFilters((filters) => ({
                        ...filters,
                        from_valor_liberado: from,
                        to_valor_liberado: to,
                      }));
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={8}></Grid>
              <Grid item xs={12} sm={2}>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <CustomButton color="purple" onClick={handleExportar}>
                    <Box display="flex" alignItems="center">
                      <ViewListIcon />
                      Exportar
                    </Box>
                  </CustomButton>
                </Box>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <CustomButton
                    color="red"
                    onClick={() => {
                      setFilters(initialFilters);
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <DeleteIcon />
                      Limpar
                    </Box>
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className={classes.tableContainer}>
          {financialSupports &&
          financialSupports.data &&
          financialSupports.per_page ? (
            <Box minWidth={!matches ? "800px" : null}>
              <CustomTable
                handleClickRow={({ id }) =>
                  history.push(`/dashboard/antecipacao-salarial/${id}/proposta`)
                }
                columns={columns ? columns : null}
                data={financialSupports.data}
              />
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
              color="primary"
              size="large"
              count={financialSupports.last_page}
              onChange={handleChangePage}
              page={page}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AntecipacaoSalarialListPage;
