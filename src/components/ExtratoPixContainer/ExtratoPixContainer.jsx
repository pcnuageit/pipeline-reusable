import {
  Box,
  Button,
  Grid,
  InputLabel,
  LinearProgress,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import PixIcon from "@mui/icons-material/Pix";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Pagination, TableContainer } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useCallback, useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setDadosBoleto } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getPagamentoPix } from "../../services/services";
import CustomCollapseTablePix from "../CustomCollapseTablePix/CustomCollapseTablePix";
import CustomCurrencyInput from "../CustomCurrencyInput";
import CustomRoundedCard from "../CustomRoundedCard/CustomRoundedCard";
import { ExportTableButtons, TableHeaderButton } from "../TableHeaderButtons";
import TextFieldCpfCnpj from "../TextFieldCpfCnpj";

moment.locale("pt-br");

const useStyles = makeStyles((theme) => ({}));

const ExtratoPixContainer = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const token = useAuth();
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
    valor: "",
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
      valor: "",
    });
  };

  const filters = `nome=${debouncedFilter.nome}&documento=${debouncedFilter.documento}&cnpj=${debouncedFilter.cnpj}&email=${debouncedFilter.email}&documento_estabelecimento=${debouncedFilter.documento_estabelecimento}&documento_beneficiario=${debouncedFilter.documento_beneficiario}&id=${debouncedFilter.id}&status=${debouncedFilter.status}&data_inicial=${debouncedFilter.data_inicial}&data_final=${debouncedFilter.data_final}&tipo_beneficio_id=${debouncedFilter.tipo_beneficio_id}&end_to_end_id=${debouncedFilter.end_to_end_id}&mostrar=${filter.mostrar}&valor=${filter.valor}`;

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

  const columns = [
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM")}</>;
      },
    },

    {
      headerText: "",
      key: "",
      CustomValue: (created_at) => {
        return (
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              height: "50px",
              width: "50px",

              borderRadius: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PixIcon style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },
    {
      headerText: "Status",
      key: "tipo_pix",
      CustomValue: (tipo_pix) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "13px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Pix {tipo_pix}
            </Typography>
          </>
        );
      },
    },

    {
      headerText: "Nome",
      key: "",
      FullObject: (data) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "13px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {data?.response?.webhook?.data?.transaction_details
                ?.receiver_name != undefined
                ? data?.response?.webhook?.data?.transaction_details
                    ?.receiver_name
                : (data?.conta?.razao_social ?? data?.conta?.nome)}
            </Typography>
          </>
        );
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
      headerText: "",
      key: "",
      FullObject: (data) => {
        return (
          <>
            <Button
              onClick={() => {
                dispatch(setDadosBoleto(data));

                changePath("comprovanteAprovacao");
              }}
              variant="outlined"
              color="primary"
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "10px",
                color: APP_CONFIG.mainCollors.primary,
                borderRadius: 20,
              }}
            >
              Visualizar
            </Button>
          </>
        );
      },
    },
  ];

  const itemColumns = [
    {
      headerText: "Data",
      key: "banco_pagou",
      CustomValue: (banco) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Banco: {banco ? banco : "40473435 - REPASSES FINANCEIROS"}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "chave_recebedor",
      CustomValue: (chave) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Chave: {chave}
            </Typography>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        Extrato pix
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Box
          style={{
            width: "90%",
            height: "1px",
            backgroundColor: APP_CONFIG.mainCollors.primary,
          }}
        />

        <Box style={{ margin: 30 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
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
                <MenuItem value={"rejected"}>Estornado</MenuItem>
                <MenuItem value={"Error"}>Error</MenuItem>
              </Select>
            </Grid>
            {/* <Grid item xs={12} sm={3}>
              <SelectBeneficio
                state={filter?.tipo_beneficio_id}
                setState={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    tipo_beneficio_id: e.target.value,
                  }))
                }
              />
            </Grid> */}
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

            <CustomCurrencyInput
              value={filter.valor}
              onChangeEvent={(event, maskedValue, rawValue) => {
                setPage(1);
                setFilter((prev) => ({
                  ...prev,
                  valor: rawValue,
                }));
              }}
            />

            <TableHeaderButton
              Icon={Delete}
              text="Limpar"
              color="red"
              onClick={resetFilter}
            />

            <ExportTableButtons
              token={token}
              apiPath={"pagamento-pix"}
              page={page}
              filters={filters}
            />
          </Grid>
        </Box>

        <Box
          style={{
            marginTop: "30px",
            marginBottom: "30px",
            width: "100%",
            maxWidth: 900,
            padding: "10px",
          }}
        >
          {!loading && pagamentoPix.data ? (
            <>
              <Box minWidth={!matches ? "500px" : null}>
                <TableContainer
                  style={{ overflowX: "auto", overflowY: "hidden" }}
                >
                  <CustomCollapseTablePix
                    itemColumns={itemColumns}
                    data={pagamentoPix.data}
                    columns={columns}
                    Editar={() => <CustomRoundedCard icon="pix" />}
                  />
                </TableContainer>
              </Box>
              <Box
                alignSelf="flex-end"
                marginTop="8px"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Pagination
                  variant="outlined"
                  color="secondary"
                  size="large"
                  count={pagamentoPix.last_page}
                  onChange={(e, value) => setPage(value)}
                  page={page}
                />
                <Button
                  style={{
                    minWidth: "5px",
                    height: "40px",
                    borderRadius: "27px",
                    border: "solid",
                    borderWidth: "1px",
                    borderColor: "grey",
                  }}
                  onClick={() => window.location.reload()}
                >
                  <RefreshIcon style={{ fontSize: 25, color: "grey" }} />
                </Button>
              </Box>
            </>
          ) : (
            <LinearProgress />
          )}
        </Box>
      </Box>
    </>
  );
};

export default ExtratoPixContainer;
