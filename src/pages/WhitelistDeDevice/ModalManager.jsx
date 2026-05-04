import {
  Box,
  Checkbox,
  LinearProgress,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Add, Close, Delete } from "@material-ui/icons";
import { Grid, Modal, Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import {
  deleteDeviceFromWhitelist,
  getBeneficiarios,
  postDeviceAddToWhitelist,
} from "../../services/beneficiarios";
import { errorMessageHelper } from "../../utils/errorMessageHelper";

import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTable from "../../components/CustomTable/CustomTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import TableHeaderButton from "../../components/TableHeaderButton";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";

moment.locale("pt-br");

const styles = makeStyles((theme) => ({
  modal: {
    outline: "none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "10%",
    left: "25%",
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },
  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
}));

export function ModalAddUser({
  show = false,
  setShow = () => null,
  getData = () => null,
}) {
  const classes = styles();
  const token = useAuth();
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState("");
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    razao_social: "",
    celular: "",
    tipo_beneficio_id: [],
    cidade: [],
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      nome: "",
      documento: "",
      razao_social: "",
      celular: "",
      tipo_beneficio_id: [],
      cidade: [],
    });
  };

  const filters = `nome=${filter.nome}&documento=${filter.documento}&celular=${
    filter.celular
  }&razao_social=${filter.razao_social}&tipo_beneficio_id=${JSON.stringify(
    filter.tipo_beneficio_id
  )}&cidade=${JSON.stringify(filter.cidade)}`;

  const getTableData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getBeneficiarios(token, "", page, filters);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableData(token, page);
  }, [token, page, debouncedFilter]);

  const columns = [
    {
      headerText: "",
      key: "documento",
      CustomValue: (documento) => {
        return (
          <>
            <Box>
              <Checkbox
                color="primary"
                checked={registros.includes(documento)}
                onChange={() => {
                  if (registros.includes(documento)) {
                    setRegistros(
                      registros.filter((item) => item !== documento)
                    );
                  } else {
                    setRegistros([...registros, documento]);
                  }
                }}
              />
            </Box>
          </>
        );
      },
    },
    { headerText: "Nome", key: "nome" },
    { headerText: "Secretaria", key: "conta.razao_social" },
    {
      headerText: "CPF",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "Cidade", key: "concorrencia_endereco.cidade" },
  ];

  const handleAddUsers = async () => {
    setLoading(true);
    try {
      await postDeviceAddToWhitelist(token, registros);
      toast.success("Usuário adicionado");
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    }
    resetFilters();
    setShow(false);
    setLoading(false);
  };

  return (
    <Modal open={!!show} onClose={() => setShow(false)}>
      <Box className={classes.modal}>
        <Box
          className={classes.closeModalButton}
          onClick={() => setShow(false)}
        >
          <Close />
        </Box>

        <Grid container spacing={1} style={{ padding: 8 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Documento"
              size="small"
              variant="outlined"
              value={filter.documento}
              onChange={(e) => {
                setPage(1);
                setFilter((prev) => ({
                  ...prev,
                  documento: e.target.value,
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <SelectBeneficio
              state={filter?.tipo_beneficio_id}
              setState={(e) => {
                setPage(1);
                setFilter((prev) => ({
                  ...prev,
                  tipo_beneficio_id: e.target.value,
                }));
              }}
              multiple
            />
          </Grid>

          <TableHeaderButton
            Icon={Delete}
            text="Limpar"
            color="red"
            onClick={resetFilters}
            sm={4}
          />
          <TableHeaderButton
            Icon={Add}
            text="Adicionar"
            onClick={handleAddUsers}
            sm={4}
          />
        </Grid>

        {!loading && listaContas?.data && listaContas?.per_page ? (
          <>
            <TableContainer style={{ overflow: "scroll" }}>
              <CustomTable columns={columns} data={listaContas?.data} />
            </TableContainer>

            <Pagination
              variant="outlined"
              color="secondary"
              size="large"
              count={listaContas?.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </>
        ) : (
          <Box>
            <LinearProgress color="secondary" />
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export function ModalDelete({
  show = false,
  setShow = () => null,
  getData = () => null,
}) {
  const classes = styles();
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDeviceFromWhitelist(token, show?.id);
      toast.success("Usuário removido");
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    }
    setShow(false);
    setLoading(false);
  };

  return (
    <Modal open={!!show} onClose={() => setShow(false)}>
      <Box className={classes.modal}>
        <Box
          className={classes.closeModalButton}
          onClick={() => setShow(false)}
        >
          <Close />
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
            }}
          >
            Remover usuário da whitelist
          </Typography>

          <Typography>Nome do beneficiário: {show?.user?.nome}</Typography>
          <Typography>Documento: {show?.user?.documento}</Typography>
          <Typography>Email: {show?.user?.email}</Typography>
          <Typography>
            Whitelist: {show?.user?.is_whitelisted ? "Sim" : "Não"}
          </Typography>
          <Typography>Status: {show?.registro?.status}</Typography>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleDelete}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Remover
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
