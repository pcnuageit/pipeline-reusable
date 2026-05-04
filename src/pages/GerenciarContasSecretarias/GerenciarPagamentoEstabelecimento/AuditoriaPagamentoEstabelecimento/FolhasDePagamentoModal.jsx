import {
  Box,
  Grid,
  LinearProgress,
  Modal,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Close, Delete } from "@material-ui/icons";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import TableHeaderButton from "../../../../components/TableHeaderButton";
import { APP_CONFIG } from "../../../../constants/config";
import useAuth from "../../../../hooks/useAuth";
import useDebounce from "../../../../hooks/useDebounce";
import usePermission from "../../../../hooks/usePermission";
import {
  getPagamentosEstabelecimento,
  postAuditoriaPagamentoEstabelecimento,
  postCriarFolhaPagamentoEstabelecimento,
} from "../../../../services/beneficiarios";
import { errorMessageHelper } from "../../../../utils/errorMessageHelper";

export default function FolhasDePagamentoModal({
  show = false,
  setShow = () => null,
  getData,
  registros = [],
  filters,
  setRegistros,
}) {
  const classes = styles();
  const [selectedRow, setSelectedRow] = useState(null);

  const handleCloseModal = () => {
    setShow(false);
    setSelectedRow(null);
  };

  return (
    <Modal open={!!show} onBackdropClick={handleCloseModal}>
      <Box className={classes.modal}>
        <Box className={classes.closeModalButton} onClick={handleCloseModal}>
          <Close />
        </Box>

        {!selectedRow ? (
          <TableDataProvider>
            <FolhasContent setSelectedRow={setSelectedRow} />
          </TableDataProvider>
        ) : (
          <CriarPagamentoContent
            handleClose={handleCloseModal}
            getData={getData}
            registros={registros}
            setRegistros={setRegistros}
            sendToALL={show === "sendToALL"}
            filters={filters}
            folhaDePagamento={selectedRow}
          />
        )}
      </Box>
    </Modal>
  );
}

const TableDataContext = createContext();
function TableDataProvider({ children }) {
  const token = useAuth();
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);

  const getData = async (page = 1, filters = "status_aprovado=1") => {
    setLoading(true);
    try {
      const { data } = await getPagamentosEstabelecimento(
        token,
        id,
        page,
        "",
        filters
      );
      setListaContas(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <TableDataContext.Provider value={{ getData, listaContas, loading }}>
      {children}
    </TableDataContext.Provider>
  );
}

function FolhasContent({ setSelectedRow }) {
  const token = useAuth();
  const { getData } = useContext(TableDataContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    data_pagamento: "",
  });

  const handleCriarFolhaDePagamento = async () => {
    setLoading(true);
    try {
      await postCriarFolhaPagamentoEstabelecimento(
        token,
        formData?.descricao,
        formData?.data_pagamento
      );
      setFormData({
        descricao: "",
        data_pagamento: "",
      });
      toast.success("Folha de pagamento criada");
      await getData();
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    }
    setLoading(false);
  };

  return (
    <>
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginBottom: 8,
        }}
      >
        Folhas de pagamento
      </Typography>

      <Grid
        container
        spacing={2}
        style={{ alignItems: "center", marginBottom: 24 }}
      >
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Descrição"
            value={formData?.descricao}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, descricao: e.target.value }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            required
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              pattern: "d {4}- d {2}- d {2} ",
            }}
            type="date"
            label="Data de pagamento"
            value={formData?.data_pagamento}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                data_pagamento: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <CustomButton
            color="purple"
            onClick={handleCriarFolhaDePagamento}
            loading={loading}
          >
            <Typography>Criar</Typography>
          </CustomButton>
        </Grid>
      </Grid>

      <FolhasTable setSelectedRow={setSelectedRow} />
    </>
  );
}

function FolhasTable({ setSelectedRow }) {
  const { getData, listaContas, loading } = useContext(TableDataContext);
  const { hasPermission, PERMISSIONS } = usePermission();
  const [filter, setFilter] = useState({
    created_at: "",
    data_pagamento: "",
    descricao: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      created_at: "",
      data_pagamento: "",
      descricao: "",
    });
  };

  const filters = `created_at=${filter.created_at}&data_pagamento=${filter.data_pagamento}&&descricao=${filter.descricao}&status_aprovado=1`;

  useEffect(() => {
    getData(page, filters);
  }, [page, debouncedFilter]);

  return (
    <>
      <Box
        style={{
          width: "100%",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
        }}
      >
        <Box style={{ margin: 30 }}>
          {hasPermission(
            PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view
          ) && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por descrição"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.descricao}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Pesquisar por data"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
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

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Pesquisar por data de pagamento"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  value={filter.data_pagamento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      data_pagamento: e.target.value,
                    }));
                  }}
                />
              </Grid>
            </Grid>
          )}

          <Grid container spacing={3}>
            {hasPermission(
              PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view
            ) && (
              <TableHeaderButton
                text="Limpar"
                color="red"
                onClick={resetFilters}
                Icon={Delete}
              />
            )}
          </Grid>
        </Box>
      </Box>

      {hasPermission(
        PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view
      ) && (
        <Box>
          {!loading && listaContas?.data && listaContas?.per_page ? (
            <>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable
                  data={listaContas?.data ?? []}
                  columns={columns}
                  handleClickRow={(row) => setSelectedRow(row?.id)}
                />
              </TableContainer>

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
            </>
          ) : (
            <Box>
              <LinearProgress color="secondary" />
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

function CriarPagamentoContent({
  handleClose,
  getData,
  registros = [],
  setRegistros,
  sendToALL = false,
  filters = "",
  folhaDePagamento, 
}) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCriarPagamento = async (descricao, data_pagamento) => {
    setLoading(true);
    console.log(JSON.stringify(filters));
    try {
      await postAuditoriaPagamentoEstabelecimento(
        token,
        folhaDePagamento,
        sendToALL ? [] : registros,
        sendToALL ? filters : ""
      );
      toast.success("Pagamentos aprovados");
      await getData(token);
      setRegistros([]);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    }
    setLoading(false);
  };

  return (
    <>
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginBottom: 24,
        }}
      >
        Criar folha de pagamento
      </Typography>

      <Typography>
        {sendToALL
          ? "Você irá adicionar à folha de pagamento todos os pagamentos da tabela"
          : registros?.length === 0
          ? "Primeiro selecione pagamentos para continuar"
          : `Você irá adicionar à folha de pagamento ${
              registros?.length
            } pagamento${registros?.length === 1 ? "" : "s"} selecionado${
              registros?.length === 1 ? "" : "s"
            }`}
        .
      </Typography>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "24px",
          alignItems: "center",
        }}
      >
        <CustomButton
          color="purple"
          onClick={handleCriarPagamento}
          disabled={!sendToALL && registros?.length === 0}
          loading={loading}
        >
          <Typography>Criar</Typography>
        </CustomButton>
      </Box>
    </>
  );
}

const styles = makeStyles((theme) => ({
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "10%",
    left: "10%",
    width: "80%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
    padding: 24,
    overflowY: "auto",
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

const columns = [
  {
    headerText: "DATA",
    key: "created_at",
    CustomValue: (created_at) => {
      return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
    },
  },
  {
    headerText: "DESCRIÇÃO",
    key: "descricao",
  },
  { headerText: "STATUS", key: "status_aprovado" },
  {
    headerText: "DATA DE PAGAMENTO",
    key: "data_pagamento",
    CustomValue: (data_pagamento) => {
      return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
    },
  },
  {
    headerText: "Valor Total",
    key: "valor_total",
    CustomValue: (valor_total) => {
      return (
        <>
          R$
          {parseFloat(valor_total).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
  {
    headerText: "Total",
    key: "",
    FullObject: (obj) =>
      Number(obj?.status_sucesso) +
      Number(obj?.status_aguardando) +
      Number(obj?.status_falha),
  },
];
