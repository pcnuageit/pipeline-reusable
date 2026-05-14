import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { Dialog, Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { delPagador, loadPagadores, setPagadorId } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import CustomCollapseTablePix from "../CustomCollapseTablePix/CustomCollapseTablePix";
import CustomRoundedCard from "../CustomRoundedCard/CustomRoundedCard";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const useStyles = makeStyles((theme) => ({
  deleteButton: {
    borderRadius: "27px",
    minWidth: "20px !important",

    boxShadow: "none",
  },
}));

const ListaDePagadores = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const token = useAuth();
  const [page, setPage] = useState(1);
  const [like, setLike] = useState("");
  const [order, setOrder] = useState("");
  const [mostrar, setMostrar] = useState(10);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowId, setRowId] = useState("");

  const pagadoresList = useSelector((state) => state.pagadoresUser);

  moment.locale();
  let debouncedLike = useDebounce(like, 1000);

  useEffect(() => {
    dispatch(loadPagadores(token, page, like, order, mostrar));
  }, [token, page, debouncedLike]);

  const handleExcluirPagador = async () => {
    setLoading(true);
    const resExcluirPagador = await dispatch(delPagador(token, rowId));
    if (resExcluirPagador) {
      setLoading(false);
      setOpenModal(false);
    } else {
      toast.success("Pagador excluído com sucesso");
      setLoading(false);
      setOpenModal(false);
      setRowId("");
      await dispatch(loadPagadores(token, page, like, order, mostrar));
    }
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  // useEffect(() => {
  // 	console.log(pagadoresList);
  // }, [pagadoresList])

  const columns = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Button
              className={classes.deleteButton}
              onClick={() => {
                setOpenModal(true);
                setRowId(id);
              }}
            >
              <DeleteIcon style={{ color: "#ED757D" }} />
            </Button>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return (
          <>
            <Typography style={{ width: "50px" }}>
              {moment.utc(created_at).format("DD MMMM")}
            </Typography>
          </>
        );
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
            <PersonIcon style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },
    {
      headerText: "Nome",
      key: "nome",
      CustomValue: (nome) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "13px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {nome}
            </Typography>
          </>
        );
      },
    },

    {
      headerText: "Cobrar",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Button
              onClick={() => {
                dispatch(setPagadorId(id));
                changePath("gerarBoleto");
              }}
              variant="outlined"
              color="primary"
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "12px",
                color: APP_CONFIG.mainCollors.primary,
                borderRadius: 20,
              }}
            >
              Cobrar
            </Button>
          </>
        );
      },
    },
  ];

  const itemColumns = [
    {
      headerText: "Data",
      key: "nome",
      CustomValue: (nome) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Nome: {nome}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "email",
      CustomValue: (email) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              E-mail: {email}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "documento",
      CustomValue: (documento) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Documento: {documentMask(documento)}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "tipo",
      CustomValue: (tipo) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Tipo: {tipo}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "endereco",
      CustomValue: (endereco) => {
        return (
          <>
            {endereco && (
              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "15px",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                <strong>Endereço:</strong> <br />
                Bairro: {endereco.bairro}
                <br />
                CEP: {endereco.cep}
                <br />
                Cidade:{endereco.cidade}
                <br />
                Estado: {endereco.estado}
                <br />
                Rua: {endereco.rua}
                <br />
                Numero: {endereco.numero}
              </Typography>
            )}
          </>
        );
      },
    },
  ];

  const Editar = (row) => {
    return <CustomRoundedCard icon="transferir" />;
  };

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        Pagadores
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

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          {/* <CustomFilterButton title="Lorem ipsum" />
					<CustomFilterButton title="Lorem ipsum" />
					<CustomFilterButton title="Lorem ipsum" />
					<CustomFilterButton title="Lorem ipsum" /> */}
          <TextField
            onChange={(e) => {
              setLike(e.target.value);
            }}
            variant="outlined"
            label=""
            InputProps={{
              endAdornment: (
                <SearchIcon
                  style={{
                    fontSize: "25px",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                />
              ),
            }}
          />
        </Box>
        <Box
          style={{
            marginTop: "30px",
            marginBottom: "30px",
            width: "100%",
            maxWidth: 800,
          }}
        >
          {pagadoresList.data && pagadoresList.data.length > 0 ? (
            <>
              <Box minWidth={!matches ? "500px" : null}>
                <CustomCollapseTablePix
                  itemColumns={itemColumns}
                  data={pagadoresList.data}
                  columns={columns}
                  Editar={Editar}
                />
              </Box>
              <Box alignSelf="flex-end" marginTop="8px">
                <Pagination
                  variant="outlined"
                  color="secondary"
                  size="large"
                  count={pagadoresList.last_page}
                  onChange={handleChangePage}
                  page={page}
                />
              </Box>
            </>
          ) : (
            <Box minWidth={!matches ? "500px" : null}>
              <Typography
                style={{
                  textAlign: "center",
                }}
              >
                Não há dados para serem exibidos
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Dialog open={openModal} onBackdropClick={() => setOpenModal(false)}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            padding: "30px",
          }}
        >
          <Typography
            style={{
              fontSize: "17px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Excluir pagador
          </Typography>
          <Typography
            style={{
              marginTop: "10px",
              fontSize: "15px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Tem certeza que deseja excluir o pagador?
          </Typography>
        </Box>
        <Box style={{ alignSelf: "center", marginBottom: "30px" }}>
          <Button
            style={{ color: APP_CONFIG.mainCollors.primary }}
            variant="outlined"
            onClick={() => handleExcluirPagador()}
          >
            Sim
          </Button>
          <Button
            style={{
              color: APP_CONFIG.mainCollors.primary,
              marginLeft: "10px",
            }}
            variant="outlined"
            onClick={() => {
              setRowId("");
              setOpenModal(false);
            }}
          >
            Não
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default ListaDePagadores;
