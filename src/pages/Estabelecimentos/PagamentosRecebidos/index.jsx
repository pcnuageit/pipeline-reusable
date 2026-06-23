import {
  Box,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { loadUserData } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import { getTransacoesEstabelecimento } from "../../../services/beneficiarios";

import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import SelectBeneficio from "../../../components/SelectBeneficio";
import { ExportTableButtons } from "../../../components/TableHeaderButtons";
import TableHeaderButton from "../../../components/TableHeaderButtons/TableHeaderButton";
import { translateStatus } from "../../../utils/translateStatus";

moment.locale();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dadosBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: "24px",
    marginLeft: "0px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
}));

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (date) => {
      return (
        <Typography align="center">
          {moment.utc(date).format("DD/MM/YYYY")}
        </Typography>
      );
    },
  },
  {
    headerText: "Data do Pagamento",
    key: "pagamento_pix.data_agendamento",
    CustomValue: (date) => {
      return (
        <Typography align="center">
          {moment.utc(date).format("DD/MM/YYYY")}
        </Typography>
      );
    },
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
  {
    headerText: "Taxa",
    key: "estabelecimento_conta.reembolso.taxa_administracao ",
  },
  {
    headerText: "Chave Pix",
    key: "pagamento_pix.chave_recebedor",
  },
  {
    headerText: "Credenciado",
    key: "conta_destino",
    CustomValue: (data) => (
      <>
        <Typography>{data?.razao_social ?? data?.nome}</Typography>
        <Typography>{data?.cnpj ?? data?.documento}</Typography>
      </>
    ),
  },
  {
    headerText: "Secretaria",
    key: "conta_origem",
    CustomValue: (data) => (
      <>
        <Typography>{data?.razao_social ?? data?.nome}</Typography>
        <Typography>{data?.cnpj ?? data?.documento}</Typography>
      </>
    ),
  },
  {
    headerText: "Benefício",
    key: "tipo_beneficio.nome_beneficio",
  },
  {
    headerText: "Status",
    key: "status",
    CustomValue: (v) => <Typography>{translateStatus(v)}</Typography>,
  },
  { key: "menu" },
];

export default function PagamentosRecebidos() {
  const dispatch = useDispatch();
  const token = useAuth();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [extratoConcorrencia, setExtratoConcorrencia] = useState("");
  const [page, setPage] = useState(1);
  const [showSelecionarBeneficiarioModal, setShowSelecionarBeneficiarioModal] =
    useState(false);
  const [filter, setFilter] = useState({
    tipo_beneficio_id: "",
    data_inicio: "",
    data_fim: "",
    created_at: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const resetFilter = () => {
    setPage(1);
    setFilter({
      tipo_beneficio_id: "",
      data_inicio: "",
      data_fim: "",
      created_at: "",
    });
  };

  // pagamento_estabelecimento_id
  // conta_destino_id
  // conta_origem_id
  // taxa - vl_taxa, vl_interconexao
  // status - succeeded, pending, failed, rejected, canceled

  const filters = `tipo_beneficio_id=${debouncedFilter.tipo_beneficio_id}&data_inicio=${debouncedFilter.data_inicio}&data_fim=${debouncedFilter.data_fim}&created_at=${debouncedFilter.created_at}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getTransacoesEstabelecimento(token, page, filters);
      setExtratoConcorrencia(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token, dispatch]);

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Histórico de Pagamentos" />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                borderRadius: "17px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Grid container spacing={3}>
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
                      <TextField
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                          pattern: "d {4}- d {2}- d {2} ",
                        }}
                        type="date"
                        label="Criado em"
                        value={filter.created_at}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            created_at: e.target.value,
                          });
                        }}
                      />
                    </Grid>

                    <TableHeaderButton
                      Icon={Delete}
                      text="Limpar"
                      color="red"
                      onClick={resetFilter}
                    />

                    <ExportTableButtons
                      token={token}
                      path={"estabelecimento/transacoes"}
                      page={page}
                      filters={filters}
                    />
                  </Grid>
                </Box>
              </Box>

              {!loading && extratoConcorrencia?.per_page ? (
                <>
                  <Box>
                    <CustomTable
                      data={extratoConcorrencia.data}
                      columns={columns}
                      Editar={({ row }) => (
                        <MenuOptionsTable
                          getData={getData}
                          row={row}
                          JSONResponse={row?.pagamento_pix?.response}
                          printType={"pagamentos_recebidos"}
                        />
                      )}
                    />
                  </Box>

                  <Box alignSelf="start" marginTop="8px">
                    {
                      <Pagination
                        variant="outlined"
                        color="secondary"
                        size="large"
                        count={extratoConcorrencia.last_page}
                        onChange={(e, value) => setPage(value)}
                        page={page}
                      />
                    }
                  </Box>
                </>
              ) : (
                <LinearProgress />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
