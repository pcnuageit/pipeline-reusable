import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close, Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable/CustomTable";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getDevicesAddedToWhitelist } from "../../services/beneficiarios";
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
  { headerText: "Device", key: "device.device_code" },
  {
    headerText: "Status",
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
  // { headerText: "", key: "menu" },
];

export default function WhitelistDeDeviceDevices() {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [filter, setFilter] = useState({
    // device_id : "",
    device_code: "",
    device_brand: " ",
    device_model: "",
    device_os: " ",
    device_status: " ",
    mostrar: "15",
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
      device_code: "",
      device_brand: " ",
      device_model: "",
      device_os: " ",
      device_status: " ",
      mostrar: "15",
    });
  };

  const filters = `device_code=${filter.device_code}&device_brand=${filter.device_brand}&device_model=${filter.device_model}&device_os=${filter.device_os}&device_status=${filter.device_status}&mostrar=${filter.mostrar}
`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getDevicesAddedToWhitelist(token, page, filters);
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
            Whitelist de devices
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
                  label="Pesquisar por device ID"
                  value={filter.device_code}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      device_code: e.target.value,
                    }));
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Pesquisar por modelo"
                  value={filter.device_model}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      device_model: e.target.value,
                    }));
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputLabel id="status_label" shrink="true">
                  Status
                </InputLabel>
                <Select
                  labelId="status_label"
                  value={filter.device_status}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({ ...filter, device_status: e.target.value });
                  }}
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value={" "}>Todos</MenuItem>
                  <MenuItem value={"ativo"}>Ativo</MenuItem>
                  <MenuItem value={"whitelisted"}>Whitelisted</MenuItem>
                  <MenuItem value={"liberado_manual"}>Liberado manual</MenuItem>
                  <MenuItem value={"bloqueado_manual"}>
                    Bloqueado manual
                  </MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputLabel id="brand_label" shrink="true">
                  Marca
                </InputLabel>
                <Select
                  labelId="brand_label"
                  value={filter.device_brand}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({ ...filter, device_brand: e.target.value });
                  }}
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value={" "}>Todas</MenuItem>
                  <MenuItem value={"samsung"}>Samsung</MenuItem>
                  <MenuItem value={"motorola"}>Motorola</MenuItem>
                  <MenuItem value={"apple"}>Apple</MenuItem>
                  <MenuItem value={"xiaomi"}>Xiaomi</MenuItem>
                  <MenuItem value={"lg"}>LG</MenuItem>
                  <MenuItem value={"asus"}>ASUS</MenuItem>
                  <MenuItem value={"nokia"}>Nokia</MenuItem>
                  <MenuItem value={"huawei"}>Huawei</MenuItem>
                  <MenuItem value={"lenovo"}>Lenovo</MenuItem>
                  <MenuItem value={"alcatel"}>Alcatel</MenuItem>
                  <MenuItem value={"google"}>Google</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputLabel id="platform_label" shrink="true">
                  Plataforma
                </InputLabel>
                <Select
                  labelId="platform_label"
                  value={filter.device_os}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({ ...filter, device_os: e.target.value });
                  }}
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value={" "}>Todas</MenuItem>
                  <MenuItem value={"android"}>Android</MenuItem>
                  <MenuItem value={"ios"}>IOS</MenuItem>
                </Select>
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
                text="Limpar"
                onClick={resetFilters}
                Icon={Delete}
                color="red"
              />
            </Grid>
          </Box>
        </Box>

        <Box className={useStyles.tableContainer}>
          {!loading ? (
            <Box minWidth={!matches ? "800px" : null}>
              <CustomTable
                data={listaContas?.data ?? []}
                columns={columns}
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
