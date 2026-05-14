import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Delete, Print } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

import { getFolhaDePagamentoConcAction } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  deleteFolhaDePagamentoConc,
  getArquivoDownload,
} from "../../services/services";

import { Download } from "@mui/icons-material";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../components/MenuOptionsTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import { ExportTableButtons } from "../../components/TableHeaderButtons";
import TableHeaderButton from "../../components/TableHeaderButtons/TableHeaderButton";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

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
    marginTop: "30px",
    marginLeft: "0px",
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
    headerText: "BENEFÍCIO",
    key: "",
    FullObject: (data) => (
      <Typography>
        {data?.beneficiarios[0]?.cartao?.tipo_beneficio?.nome_beneficio}
      </Typography>
    ),
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
    headerText: "Sucesso",
    key: "status_sucesso",
  },
  {
    headerText: "Aguardando",
    key: "status_aguardando",
  },
  {
    headerText: "Falha",
    key: "status_falha",
  },
  {
    headerText: "",
    key: "menu",
  },
];

const itemColumns = [
  {
    headerText: "Nome",
    key: "cartao.user.nome",
    CustomValue: (nome) => (
      <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
    ),
  },
  {
    headerText: "Email",
    key: "cartao.user.email",
    CustomValue: (email) => (
      <Typography style={{ lineBreak: "anywhere" }}>{email}</Typography>
    ),
  },
  {
    headerText: "CPF",
    key: "cartao.user.documento",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
  {
    headerText: "Contato",
    key: "cartao.user.celular",
    CustomValue: (celular) => (
      <Typography style={{ lineBreak: "anywhere" }}>
        {celular ? phoneMask(celular) : "*"}
      </Typography>
    ),
  },
  {
    headerText: "Valor",
    key: "valor_pagamento",
    CustomValue: (valor) => (
      <Typography style={{ lineBreak: "auto" }}>
        R$
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },
  {
    headerText: "Cartão",
    key: "cartao.external_msk",
  },
  {
    headerText: "Tipo Pagamento",
    key: "tipo_pagamento",
  },
  {
    headerText: "Status Transação",
    key: "status",
  },
  {
    headerText: "",
    key: "menuCollapse",
  },
];

moment.locale();

export default function ListaFolhaDePagamento() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    like: "",
    tipo_beneficio_id: " ",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const listaFolhaDePagamento = useSelector(
    (state) => state.folhaDePagamentoConc,
  );
  const headerLike = useSelector((state) => state.headerLike);
  const [page, setPage] = useState(1);

  const resetFilter = () => {
    setPage(1);
    setFilter({
      like: "",
      tipo_beneficio_id: " ",
      mostrar: "15",
    });
  };

  const filters = `like=${filter.like}&tipo_beneficio_id=${filter.tipo_beneficio_id}&mostrar=${filter.mostrar}`;

  useEffect(() => {
    dispatch(getFolhaDePagamentoConcAction(token, page, filters));
  }, [token, page, debouncedFilter]);

  const Editar = (row) => {
    const [showDeletarModal, setShowDeletarModal] = useState(false);

    function redirectPrintFolha() {
      const path = generatePath(
        "/dashboard/folha-de-pagamento/acao/print/:id??type=pagamento_cartao",
        { id: row?.row?.id },
      );

      const newWindow = window.open(path, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    }

    async function handleDownload() {
      console.log(row);

      try {
        toast.warning("Carregando arquivo...");
        const { data } = await getArquivoDownload(token, row?.row?.arquivo?.id);
        const newWindow = window.open(data, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
      } catch (err) {
        console.log(err);
      }
    }

    return (
      <Box style={{ display: "flex", flexDirection: "row" }}>
        <IconButton
          style={{ color: "#ED757D" }}
          onClick={() => setShowDeletarModal(true)}
        >
          <Delete />
        </IconButton>

        <IconButton
          style={{ color: APP_CONFIG.mainCollors.primary }}
          onClick={redirectPrintFolha}
        >
          <Print />
        </IconButton>

        <IconButton
          style={{ color: APP_CONFIG.mainCollors.primary }}
          onClick={() => handleDownload()}
        >
          <Download />
        </IconButton>

        <DeletarModal
          show={showDeletarModal}
          setShow={setShowDeletarModal}
          getData={() =>
            dispatch(getFolhaDePagamentoConcAction(token, page, headerLike))
          }
          data={row.row}
        />
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Recarga de Cartão"
          arquivosLote
          routeForGestao={"cartao"}
        />

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
                alignItems: "center",
                borderRadius: "17px",
                flexDirection: "column",
                minWidth: "100%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  borderRadius: 27,
                }}
              >
                <Box style={{ margin: "30px" }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pesquisar por nome, documento, email..."
                        size="small"
                        variant="outlined"
                        value={filter.like}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            like: e.target.value,
                          });
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <SelectBeneficio
                        state={filter?.tipo_beneficio_id}
                        setState={(e) =>
                          setFilter((prev) => ({
                            ...prev,
                            tipo_beneficio_id: e.target.value,
                          }))
                        }
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
                      text="Limpar"
                      onClick={resetFilter}
                      Icon={Delete}
                      color="red"
                    />

                    <ExportTableButtons
                      token={token}
                      path={"cartao-privado-pagamento"}
                      page={page}
                      filters={filters}
                    />
                  </Grid>
                </Box>

                <Box
                  style={{
                    width: "100%",
                    borderTopRightRadius: 27,
                    borderTopLeftRadius: 27,
                  }}
                >
                  {!loading &&
                  listaFolhaDePagamento.data &&
                  listaFolhaDePagamento.per_page ? (
                    <>
                      <Box minWidth={!matches ? "800px" : null}>
                        <CustomCollapseTable
                          compacta
                          columns={columns}
                          itemColumns={itemColumns}
                          data={listaFolhaDePagamento.data}
                          Editar={Editar}
                          EditarCollapse={({ row }) => (
                            <MenuOptionsTable JSONResponse={row?.response} />
                          )}
                          conta={listaFolhaDePagamento.data.conta}
                        />
                      </Box>

                      <Box alignSelf="flex-end" marginTop="8px">
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={listaFolhaDePagamento.last_page}
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
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function DeletarModal({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
}) {
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleDeletar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteFolhaDePagamentoConc(token, data?.id);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel deletar o pagamento. Tente novamente.",
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">Excluir pagamento</DialogTitle>
      <form onSubmit={handleDeletar}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de excluir o pagamento:
          </DialogContentText>
          <DialogContentText>
            {data?.descricao}
            <br />
            R${" "}
            {parseFloat(data?.valor_total).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <br />
            {data?.status_aprovado}
          </DialogContentText>
          <DialogContentText>Essa ação é irreversível.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Excluir
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
