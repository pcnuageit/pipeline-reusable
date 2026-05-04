import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
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
import {
  Check,
  Delete,
  LockOpenTwoTone,
  LockTwoTone,
  Visibility,
} from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  getDevices,
  postDevicesAddToWhitelist,
} from "../../services/beneficiarios";
import px2vw from "../../utils/px2vw";

import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import { ExportTableButtons } from "../../components/ExportTableButtons";
import TableHeaderButton from "../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import { documentMask } from "../../utils/documentMask";
import {
  ModalChangeStatus,
  ModalChangeStatusUser,
  ModalDelete,
  ModalDeleteUser,
} from "./ModalManager";

moment.locale("pt-br");

export default function BloqueioDeDevice() {
  const history = useHistory();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [filter, setFilter] = useState({
    created_at: "",
    documento: "",
    status: " ",
    marca_device: " ",
    plataforma_device: " ",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [registros, setRegistros] = useState([]);
  const [showModalChangeStatus, setShowModalChangeStatus] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalChangeStatusUser, setShowModalChangeStatusUser] =
    useState(false);
  const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);
  const [showAddDeviceToWhitelistModal, setShowAddDeviceToWhitelistModal] =
    useState(false);
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
    setRegistros([]);
    setPage(1);
    setFilter({
      created_at: "",
      documento: "",
      status: " ",
      marca_device: " ",
      plataforma_device: " ",
      mostrar: "15",
    });
  };

  const filters = `created_at=${debouncedFilter.created_at}&documento=${debouncedFilter.documento}&status=${debouncedFilter.status}&marca_device=${debouncedFilter.marca_device}&plataforma_device=${debouncedFilter.plataforma_device}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getDevices(token, page, filters);
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

  const Editar = ({ row }) => (
    <Box style={{ display: "flex" }}>
      {row?.status === "blacklisted" ? (
        <LockOpenTwoTone onClick={() => setShowModalChangeStatus(row)} />
      ) : (
        <LockTwoTone onClick={() => setShowModalChangeStatus(row)} />
      )}
      <Delete
        style={{ color: "#ED757D" }}
        onClick={() => setShowModalDelete(row)}
      />
    </Box>
  );

  const EditarCollapse = ({ row }) => (
    <Box style={{ display: "flex" }}>
      <LockTwoTone onClick={() => setShowModalChangeStatusUser(row)} />

      <Delete
        style={{ color: "#ED757D" }}
        onClick={() => setShowModalDeleteUser(row)}
      />
    </Box>
  );

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  const columns = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box>
              <Checkbox
                color="primary"
                checked={registros.includes(id)}
                onChange={() => {
                  if (registros.includes(id)) {
                    setRegistros(registros.filter((item) => item !== id));
                  } else {
                    setRegistros([...registros, id]);
                  }
                }}
              />
            </Box>
          </>
        );
      },
    },
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (created_at) => (
        <Typography>{moment.utc(created_at).format("DD/MM/YY")}</Typography>
      ),
    },
    { headerText: "Device", key: "device_code" },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (v) => (
        <Typography color={v === "blacklisted" ? "error" : "primary"}>
          {v}
        </Typography>
      ),
    },
    { headerText: "Marca", key: "device_brand" },
    { headerText: "Modelo", key: "device_model" },
    { headerText: "Sistema", key: "device_os" },
    { headerText: "Total", key: "usuarios_totais_registrados" },
    {
      headerText: "Ativo",
      key: "",
      FullObject: (obj) => (
        <Typography>
          {Number(obj?.usuarios_ativos_registrados) +
            Number(obj?.usuarios_whitelisted) +
            Number(obj?.usuarios_ativos_manualmente)}
        </Typography>
      ),
    },
    {
      headerText: "Bloqueado",
      key: "",
      FullObject: (obj) => (
        <Typography>
          {Number(obj?.usuarios_bloqueados) +
            Number(obj?.usuarios_bloqueados_manualmente)}
        </Typography>
      ),
    },
    // { headerText: "Deletado", key: "registros_deletados" },
    { headerText: "", key: "menu" },
  ];

  const itemColumns = [
    {
      headerText: "Nome do beneficiário",
      key: "user.nome",
    },
    {
      headerText: "Documento",
      key: "user.documento",
      CustomValue: (v) => <Typography>{documentMask(v)}</Typography>,
    },
    {
      headerText: "Email",
      key: "user.email",
    },
    {
      headerText: "Whitelist",
      key: "user.is_whitelisted",
      CustomValue: (v) => <Typography>{v ? "Sim" : "Não"}</Typography>,
    },
    {
      headerText: "Status",
      key: "registro.status",
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
    { headerText: "", key: "menuCollapse" },
  ];

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
            Bloqueio de Device
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
                  value={filter.marca_device}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({ ...filter, marca_device: e.target.value });
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
                  value={filter.plataforma_device}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({ ...filter, plataforma_device: e.target.value });
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

              <TableHeaderButton
                text="Whitelist de usuários"
                onClick={() => history.push("whitelist-device?type=user")}
                Icon={Check}
              />

              <TableHeaderButton
                text="Whitelist de dispositivos"
                onClick={() => history.push("whitelist-device?type=device")}
                Icon={Visibility}
              />

              <TableHeaderButton
                text="Selecionar todos"
                onClick={handleSelectAll}
                Icon={Check}
              />

              <TableHeaderButton
                text="Adicionar à whitelist"
                onClick={() => {
                  setShowAddDeviceToWhitelistModal(true);
                }}
                Icon={Check}
              />

              <ExportTableButtons
                token={token}
                path={"devices"}
                page={page}
                filters={filters}
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
                itemDataKey={"userDevices"}
                itemColumns={itemColumns}
                Editar={({ row }) => <Editar row={row} />}
                EditarCollapse={({ row }) => <EditarCollapse row={row} />}
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
              count={listaContas?.meta?.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </Box>
        </Box>
      </Box>

      <ModalChangeStatus
        show={showModalChangeStatus}
        setShow={setShowModalChangeStatus}
        getData={getData}
      />

      <ModalDelete
        show={showModalDelete}
        setShow={setShowModalDelete}
        getData={getData}
      />

      <ModalChangeStatusUser
        show={showModalChangeStatusUser}
        setShow={setShowModalChangeStatusUser}
        getData={getData}
      />

      <ModalDeleteUser
        show={showModalDeleteUser}
        setShow={setShowModalDeleteUser}
        getData={getData}
      />

      <AddDeviceToWhitelistModal
        show={showAddDeviceToWhitelistModal}
        setShow={setShowAddDeviceToWhitelistModal}
        getData={getData}
        registros={registros}
        setRegistros={setRegistros}
      />
    </Box>
  );
}

function AddDeviceToWhitelistModal({
  show = false,
  setShow = () => null,
  getData = () => null,
  registros = [],
  setRegistros = () => null,
}) {
  const token = useAuth();
  const userCount = registros.length;
  const addSCount = `${userCount === 1 ? "" : "s"}`;
  const deviceText = `${userCount} device${addSCount}`;

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async () => {
    try {
      await postDevicesAddToWhitelist(token, registros);
      toast.success(`${deviceText} adicionado${addSCount} à whitelist`);
      getData(token);
      setRegistros([]);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error(
        `O correu um erro ao adicionar os dispositivos à whitelist. Tente novamente`,
      );
    }
  };

  return (
    <Dialog open={show} onBackdropClick={handleClose}>
      <Box width="500px" padding="20px">
        <DialogTitle>Deseja adicionar {deviceText} à whitelist?</DialogTitle>

        <DialogContent></DialogContent>
        <Box display="flex" justifyContent="space-around" marginTop="20px">
          <CustomButton color="red" onClick={handleClose}>
            Cancelar
          </CustomButton>
          <CustomButton color="purple" onClick={handleSubmit}>
            Adicionar
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
}
