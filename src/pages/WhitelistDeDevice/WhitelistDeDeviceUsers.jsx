import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Close, Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import SelectCidade from "../../components/SelectCidade";
import TableHeaderButton from "../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getDevicesWhitelist } from "../../services/beneficiarios";
import { documentMask } from "../../utils/documentMask";
import px2vw from "../../utils/px2vw";
import { ModalAddUser, ModalDelete } from "./ModalManager";

moment.locale("pt-br");

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (created_at) => (
      <Typography>{moment.utc(created_at).format("DD/MM/YY")}</Typography>
    ),
  },
  {
    headerText: "Documento",
    key: "documento",
    CustomValue: (v) => <Typography>{documentMask(v)}</Typography>,
  },
  {
    headerText: "Nome",
    key: "nome",
  },
  {
    headerText: "email",
    key: "email",
  },
  {
    headerText: "cidade",
    key: "cidade",
  },
  { headerText: "", key: "menu" },
];

const itemColumns = [
  {
    headerText: "Último uso",
    key: "last_used_at",
    CustomValue: (date) => (
      <Typography>{moment.utc(date).format("DD/MM/YY HH:mm")}</Typography>
    ),
  },
  {
    headerText: "Status",
    key: "status",
    CustomValue: (v) => (
      <Typography
        color={
          v === "bloqueado" || v === "bloqueado_manual" ? "error" : "primary"
        }
      >
        {v}
      </Typography>
    ),
  },
  { headerText: "Device", key: "device.device_code" },
  {
    headerText: "Status device",
    key: "device.device_status",
    CustomValue: (v) => (
      <Typography color={v === "blacklisted" ? "error" : "primary"}>
        {v}
      </Typography>
    ),
  },
  { headerText: "Marca", key: "device.device_brand" },
  { headerText: "Modelo", key: "device.device_model" },
  { headerText: "Sistema", key: "device.device_os" },
];

export default function WhitelistDeDeviceUsers() {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [filter, setFilter] = useState({
    created_at: "",
    documento: "",
    nome: "",
    cidade: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [showModalAddUser, setShowModalAddUser] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
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

  const resetFilters = () => {
    setPage(1);
    setFilter({
      created_at: "",
      documento: "",
      nome: "",
      cidade: "",
    });
  };

  const filters = `created_at=${debouncedFilter.created_at}&documento=${debouncedFilter.documento}&nome=${debouncedFilter.nome}&cidade=${debouncedFilter.cidade}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getDevicesWhitelist(token, page, filters);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const Editar = ({ row }) => (
    <Box style={{ display: "flex" }}>
      <Close
        style={{ color: "#ED757D" }}
        onClick={() => setShowModalDelete(row)}
      />
    </Box>
  );

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

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
            Whitelist de usuários
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pesquisar por data"
                  size="small"
                  variant="outlined"
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
                <TextFieldCpfCnpj
                  placeholder="Pesquisar documento"
                  value={filter.documento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      documento: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nome do beneficiário"
                  variant="outlined"
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
                  }}
                  value={filter.nome}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      nome: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
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

              <TableHeaderButton
                text="Limpar"
                onClick={resetFilters}
                Icon={Delete}
                color="red"
              />

              <TableHeaderButton
                text="Adicionar"
                onClick={() => setShowModalAddUser(true)}
                Icon={Add}
              />
            </Grid>
          </Box>
        </Box>

        <Box className={useStyles.tableContainer}>
          {!loading ? (
            <Box minWidth={!matches ? "800px" : null}>
              <CustomCollapseTable
                data={listaContas?.data ?? []}
                columns={columns}
                itemDataKey={"devices"}
                itemColumns={itemColumns}
                Editar={({ row }) => <Editar row={row} />}
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
              color="secondary"
              size="large"
              count={listaContas?.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </Box>
        </Box>
      </Box>

      <ModalAddUser
        show={showModalAddUser}
        setShow={setShowModalAddUser}
        getData={getData}
      />

      <ModalDelete
        show={showModalDelete}
        setShow={setShowModalDelete}
        getData={getData}
      />
    </Box>
  );
}
