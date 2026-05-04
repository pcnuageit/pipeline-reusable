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
  LinearProgress,
  TableContainer,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Refresh } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Delete } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  deleteFavoritoPix,
  getFavoritosPix,
  postAddFavoritePix,
} from "../../services/services";
import { documentMask } from "../../utils/documentMask";
import { parseTipoContaBanco } from "../../utils/parseTipoContaBanco";
import { parseTipoPix } from "../../utils/parseTipoPix";
import px2vw from "../../utils/px2vw";
import PixFields from "./PixFields";

moment.locale();

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
}));

const columns = [
  {
    headerText: "nome",
    key: "nome",
  },
  {
    headerText: "documento",
    FullObject: (data) => (
      <Typography>
        {documentMask(data?.documento ?? data?.documento_conta)}
      </Typography>
    ),
  },
  {
    headerText: "Tipo",
    key: "",
    FullObject: (data) => (
      <Typography>
        {parseTipoPix(data?.tipo) ?? parseTipoContaBanco(data?.tipo_conta)}
      </Typography>
    ),
  },
  {
    headerText: "DADOS",
    key: "",
    FullObject: (data) => (
      <Typography>
        {data?.chave_recebedor ||
          `${data?.banco} ${data?.agencia} ${data?.conta_sem_digito}-${data?.digito_conta}`}
      </Typography>
    ),
  },
  { headerText: "", key: "menu" },
];

export default function ContasAutorizadas() {
  const token = useAuth();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [showNovaContaModal, setShowNovaContaModal] = useState(false);
  const [lista, setLista] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    like: "",
  });
  const debouncedFilters = useDebounce(filter, 800);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      like: "",
    });
  };

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getFavoritosPix(token, id, page, filter?.like);
      setLista(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [dispatch, token, page, debouncedFilters]);

  const Editar = ({ row }) => {
    const [showEditarContaModal, setShowEditarContaModal] = useState(false);
    const [showDeletarModal, setShowDeletarModal] = useState(false);

    return (
      <Box style={{ display: "flex", flexDirection: "row" }}>
        <Delete
          style={{
            color: "#ED757D",
          }}
          onClick={() => setShowDeletarModal(true)}
        />

        <ContaModal
          show={showEditarContaModal}
          setShow={setShowEditarContaModal}
          getData={getData}
          data={row}
          conta_id={id}
          update
        />
        <DeletarModal
          show={showDeletarModal}
          setShow={setShowDeletarModal}
          getData={getData}
          data={row}
        />
      </Box>
    );
  };

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
            Contas Autorizadas
          </Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <Refresh />
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
                  placeholder="Pesquisar por nome, documento ou chave Pix"
                  value={filter.like}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      like: e.target.value,
                    }));
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <TableHeaderButton
                text="Limpar"
                color="red"
                onClick={resetFilters}
                Icon={Delete}
              />
              <TableHeaderButton
                text="Adicionar"
                onClick={() => setShowNovaContaModal(true)}
                Icon={Add}
              />
            </Grid>
          </Box>
        </Box>

        <Box className={classes.tableContainer}>
          {!loading && lista.data && lista.per_page ? (
            <>
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={lista.data}
                    Editar={Editar}
                  />
                </TableContainer>
              </Box>

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
            </>
          ) : (
            <Box>
              <LinearProgress color="secondary" />
            </Box>
          )}
        </Box>
      </Box>

      <ContaModal
        show={showNovaContaModal}
        setShow={setShowNovaContaModal}
        getData={getData}
        conta_id={id}
      />
    </Box>
  );
}

const ContaModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
  conta_id = "",
  update = false,
}) => {
  const token = useAuth();
  const [conta, setConta] = useState({
    nome: data?.nome ?? "",
    tipo_transferencia: data?.tipo_transferencia ?? "Dict", //"Dict" "Manual"
    nome_conta: data?.nome_conta ?? "",
    documento_conta: data?.documento_conta ?? "",
    numero_conta: data?.numero_conta ?? "",
    digito_conta: data?.digito_conta ?? "0",
    banco: data?.banco ?? "",
    agencia: data?.agencia ?? "",
    tipo_conta: data?.tipo_conta ?? "conta_corrente", //"conta_corrente" "conta_salario" "conta_poupanca" "conta_pagamento"
    tipo: data?.tipo ?? "0", //CPF = 0 CNPJ = 1 EMAIL = 2 PHONE = 3 EVP = 4
    chave_recebedor: data?.chave_recebedor ?? "",
    documento: data?.documento ?? "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
    setErrors({});
    if (!update) {
      setConta({
        tipo_transferencia: "Dict",
        tipo_conta: "conta_corrente",
        tipo: "0",
        digito_conta: "0",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (update) {
        //NO UPDATE
        await postAddFavoritePix(token, conta_id, conta);
      } else {
        await postAddFavoritePix(token, conta_id, conta);
      }
      getData();
      handleClose();
    } catch (err) {
      console.log(err);
      setErrors(err?.response?.data?.errors);
    } finally {
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
      <DialogTitle id="form-dialog-title">
        {update ? "Editar" : "Cadastrar"} conta
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent style={{ overflow: "hidden" }}>
          <PixFields conta={conta} setConta={setConta} errors={errors} />
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
};

const DeletarModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
}) => {
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleDeletar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteFavoritoPix(token, data?.id);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel deletar a conta. Tente novamente."
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
      <DialogTitle id="form-dialog-title">Excluir conta autorizada</DialogTitle>
      <form onSubmit={handleDeletar}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de excluir a conta:
          </DialogContentText>

          <DialogContentText>
            <Typography>{documentMask(data?.nome)}</Typography>
            <Typography>{documentMask(data?.documento)}</Typography>
            <Typography>
              {parseTipoPix(data?.tipo) ??
                parseTipoContaBanco(data?.tipo_conta)}
            </Typography>
            <Typography>
              {data?.chave_recebedor ||
                `${data?.banco} ${data?.agencia} ${data?.conta_sem_digito}-${data?.digito_conta}`}
            </Typography>
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
};
