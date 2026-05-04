import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  makeStyles,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  deleteCondicaoComercial,
  getCondicoesComerciais,
  postCondicaoComercial,
  postCondicaoComercialToggleStatus,
  updateCondicaoComercial,
} from "../../services/beneficiarios";

import CustomCurrencyInput from "../../components/CustomCurrencyInput";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../components/MenuOptionsTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import SelectConta from "../../components/SelectConta";
import TableHeaderButton from "../../components/TableHeaderButton";

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

export default function CondicoesComerciais() {
  const token = useAuth();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lista, setLista] = useState([]);
  const [filter, setFilter] = useState({
    created_at: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [show, setShow] = useState(false);

  const resetFilter = () => {
    setFilter({
      created_at: "",
      mostrar: "15",
    });
  };

  const filters = `created_at=${debouncedFilter.created_at}&mostrar=${filter.mostrar}`;

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getCondicoesComerciais(token, page, filters);
      console.log(data);
      setLista(data);
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
    }
    setLoading(false);
  };

  const handleDeleteCondicao = async (id) => {
    setLoading(true);
    try {
      await deleteCondicaoComercial(token, id);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page, debouncedFilter]);

  const handleToggleStatus = async (id) => {
    setLoading(true);
    try {
      await postCondicaoComercialToggleStatus(token, id);
      getData();
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
    }
    setLoading(false);
  };

  const columns = [
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (value) => (
        <Typography>{moment.utc(value).format("DD/MM/YYYY HH:mm")}</Typography>
      ),
    },
    { headerText: "Lista de benefícios", key: "tipo_beneficio_id" },
    { headerText: "Lista de Tipo de corte", key: "tipo_contagem_corte" },
    { headerText: "Vendedor", key: "vendedor" },
    {
      headerText: "Lista de tipo de frequência de pagamento",
      key: "tipo_contagem_pagamento",
    },
    {
      headerText: "Data do contrato",
      key: "data_contrato",
      CustomValue: (value) => (
        <Typography>{moment.utc(value).format("DD/MM/YYYY")}</Typography>
      ),
    },
    {
      headerText: " Taxa de serviço",
      key: "service_tax",
      CustomValue: (value) => {
        if (!value) return "-";
        const parsedValue =
          value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + "%";

        return <Typography>{parsedValue}</Typography>;
      },
    },
    {
      headerText: "Tipo de contagem",
      key: "tipo_contagem_corte",
    },
    {
      headerText: "Ativo",
      key: "",
      FullObject: (row) => (
        <Switch
          checked={row?.status === "ativa"}
          onClick={() => handleToggleStatus(row?.id)}
        />
      ),
    },
    { headerText: "", key: "menu" },
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
          <Typography className={classes.pageTitle}>
            Condições Comerciais
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ margin: 30 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={2}>
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

              <Grid item xs={12} sm={2}>
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
                Icon={Add}
                text="Criar"
                onClick={() => setShow("create")}
              />

              <TableHeaderButton
                Icon={Delete}
                text="Limpar"
                color="red"
                onClick={resetFilter}
              />
            </Grid>
          </Box>
        </Box>
      </Box>

      <Box className={classes.tableContainer}>
        {!loading && lista.data && lista.per_page ? (
          <CustomTable
            columns={columns}
            data={lista.data}
            Editar={({ row }) => (
              <Box style={{ display: "flex" }}>
                <Edit
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                    fontSize: "28px",
                  }}
                  onClick={() => setShow(row)}
                />
                <MenuOptionsTable
                  row={row}
                  getData={getData}
                  deleteCallback={() => handleDeleteCondicao(row?.id)}
                />
              </Box>
            )}
          />
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
            count={lista.last_page}
            onChange={(e, value) => setPage(value)}
            page={page}
          />
        </Box>
      </Box>

      <NovoCadastro show={show} setShow={setShow} getData={getData} />
    </Box>
  );
}

function NovoCadastro({
  show = false, // "create" | {}
  setShow = () => false,
  getData = () => null,
}) {
  const token = useAuth();
  const [data, setData] = useState({
    dias_de_corte: [],
    cortes_por_mes: "",
    intervalo_dias_pagamento: "",
    tipo_contagem_corte: "",
    tipo_contagem_pagamento: "",
    data_contrato: "",
    tipo_beneficio_id: "",
    conta_id: "",
    vendedor: "",
    service_tax: "",
    status: "inativa",
  });
  const [loading, setLoading] = useState("");
  const update = show !== "create";

  const handleClose = () => {
    setShow(false);
    setData({ dias_de_corte: [], status: "inativa" });
  };

  const handleCriar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (update) await updateCondicaoComercial(token, show?.id, data);
      else await postCondicaoComercial(token, data);
      getData(token);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (update) setData({ ...show });
  }, [show]);

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"lg"}
      minWidth={"lg"}
      width={"lg"}
      scroll={"paper"}
    >
      <LoadingScreen isLoading={loading} />

      <DialogTitle id="form-dialog-title">
        {update ? "Editar" : "Cadastrar"} condição comercial
      </DialogTitle>

      <form onSubmit={handleCriar}>
        <DialogContent
          style={{
            width: "50dvw",
          }}
        >
          {update && (
            <Typography style={{ marginBottom: "16px" }}>
              ID: {show?.id}
            </Typography>
          )}

          <Grid container spacing={3}>
            <Grid item sm={4} xs={12}>
              <InputLabel id="select-dias_de_corte" shrink="true">
                Dias de corte
              </InputLabel>
              <Select
                labelId="select-dias_de_corte"
                variant="outlined"
                fullWidth
                value={data?.dias_de_corte || []}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    dias_de_corte: e.target.value,
                  }))
                }
                multiple
              >
                <MenuItem key={0} value={"5"}>
                  5
                </MenuItem>
                <MenuItem key={0} value={"10"}>
                  10
                </MenuItem>
                <MenuItem key={0} value={"15"}>
                  15
                </MenuItem>
                <MenuItem key={0} value={"20"}>
                  20
                </MenuItem>
                <MenuItem key={0} value={"25"}>
                  25
                </MenuItem>
                <MenuItem key={0} value={"30"}>
                  30
                </MenuItem>
              </Select>
            </Grid>

            <Grid item sm={4} xs={12}>
              <TextField
                fullWidth
                label="Cortes por mês"
                variant="outlined"
                value={data.cortes_por_mes}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    cortes_por_mes: e.target.value,
                  }));
                }}
                type="number"
              />
            </Grid>

            <Grid item sm={4} xs={12}>
              <TextField
                fullWidth
                label="Intervalo dias pagamento"
                variant="outlined"
                value={data.intervalo_dias_pagamento}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    intervalo_dias_pagamento: e.target.value,
                  }));
                }}
                type="number"
              />
            </Grid>

            <Grid item sm={4} xs={12}>
              <InputLabel id="select-tipo_contagem_corte" shrink="true">
                Tipo contagem de corte
              </InputLabel>
              <Select
                labelId="select-tipo_contagem_corte"
                variant="outlined"
                fullWidth
                value={data?.tipo_contagem_corte}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    tipo_contagem_corte: e.target.value,
                  }))
                }
              >
                <MenuItem key={0} value={"dias fixos"}>
                  Dias fixos
                </MenuItem>
              </Select>
            </Grid>

            <Grid item sm={4} xs={12}>
              <InputLabel id="select-tipo_contagem_pagamento" shrink="true">
                Tipo contagem de pagamento
              </InputLabel>
              <Select
                labelId="select-tipo_contagem_pagamento"
                variant="outlined"
                fullWidth
                value={data?.tipo_contagem_pagamento}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    tipo_contagem_pagamento: e.target.value,
                  }))
                }
              >
                <MenuItem key={0} value={"dias fixos"}>
                  Dias fixos
                </MenuItem>
              </Select>
            </Grid>

            <Grid item sm={4} xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
                }}
                type="date"
                label="Data do contrato"
                value={data.data_contrato}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    data_contrato: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <SelectBeneficio
                state={data?.tipo_beneficio_id}
                setState={(e) => {
                  setData((prev) => ({
                    ...prev,
                    tipo_beneficio_id: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <SelectConta
                label={"Conta"}
                value={data?.conta_id}
                onChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    conta_id: value,
                  }))
                }
              />
            </Grid>

            <Grid item sm={9} xs={12}>
              <TextField
                fullWidth
                label="Vendedor"
                variant="outlined"
                value={data.vendedor}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    vendedor: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item sm={3} xs={12}>
              <CustomCurrencyInput
                label="Taxa de serviço"
                value={data.service_tax}
                onChangeEvent={(event, maskedvalue, floatvalue) =>
                  setData((prev) => ({
                    ...prev,
                    service_tax: floatvalue.toFixed(2),
                  }))
                }
                prefix="% "
                gridSm={12}
              />
            </Grid>
          </Grid>

          <Box
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: "1rem",
              gap: "16px",
            }}
          >
            <Typography>Ativo</Typography>
            <Switch
              checked={data.status === "ativa"}
              onClick={() =>
                setData((prev) => ({
                  ...prev,
                  status: data.status === "ativa" ? "inativa" : "ativa",
                }))
              }
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Enviar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
