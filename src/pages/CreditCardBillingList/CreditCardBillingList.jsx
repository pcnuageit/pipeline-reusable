import {
  Box,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  getAllContasAction,
  loadCobrancasCartaoFilters,
  postCobrancaEstornarAction,
} from "../../actions/actions";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import SplitModal from "../../components/SplitModal/SplitModal";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import CreditCardCaptureModal from "./CreditCardCaptureModal/CreditCardCaptureModal";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "25px",
  },
  tableContainer: {},
  pageTitle: {
    color: "#c6930a",
    fontFamily: "Montserrat-SemiBold",
  },
}));

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const date = new Date(data);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const dataFormatada = date.toLocaleDateString("pt-br", option);
      return (
        <Box display="flex" justifyContent="center">
          <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
          <Typography style={{ marginLeft: "6px" }}>{dataFormatada}</Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Situação",
    key: "status",
    CustomValue: (status) => {
      if (status === "Pré-autorizado") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            <b>PRÉ-AUTORIZADO</b>
          </Typography>
        );
      }
      if (status === "Pago") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            <b>PAGO</b>
          </Typography>
        );
      }
      if (status === "Cancelado") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            <b>CANCELADO</b>
          </Typography>
        );
      }
    },
  },
  {
    headerText: "Pagador",
    key: "pagador",
    CustomValue: (pagador) => {
      return (
        <>
          <Typography>
            {pagador ? pagador.nome : "Sem pagador específico"}
          </Typography>
          <Typography>{pagador ? pagador.documento : null}</Typography>
        </>
      );
    },
  },
  {
    headerText: "Tarifas",
    key: "taxa",
    CustomValue: (taxa) => {
      if (taxa > 0) {
        return (
          <Typography
            variant=""
            style={{ fontSize: 16, color: "#dfad06", fontWeight: 600 }}
          >
            R$ {taxa}
          </Typography>
        );
      } else {
        return (
          <Typography
            variant=""
            style={{ fontSize: 16, color: "	green", fontWeight: 600 }}
          >
            R$ {taxa}
          </Typography>
        );
      }
    },
  },
  {
    headerText: "Valor",
    key: "valor",
    CustomValue: (valor) => {
      return (
        <Typography
          variant=""
          style={{ fontSize: 17, fontWeight: 600, color: "green" }}
        >
          R$ {valor}
        </Typography>
      );
    },
  },

  {
    headerText: "Ações",
    key: "menu",
  },
];

const CreditCardBillingList = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useAuth();
  const userData = useSelector((state) => state.userData);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const id = useParams()?.id ?? "";

  const [page, setPage] = useState(1);
  const contasUser = useSelector((state) => state.contas);
  useEffect(() => {
    dispatch(getAllContasAction(token));
  }, []);
  const handleNovaCobrancaCartao = () => {
    history.push("/dashboard/credito");
  };

  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
  });

  const debouncedLike = useDebounce(filters.like, 800);

  const cobrancaCartaoList = useSelector((state) => state.cobrancaCartaoList);

  useEffect(() => {
    dispatch(
      loadCobrancasCartaoFilters(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        id
      )
    );
  }, [page, filters.order, filters.mostrar, debouncedLike, id]);

  useEffect(() => {
    return () => {
      setFilters({ ...filters });
    };
  }, []);

  const handleChangePage = (e, value) => {
    setPage(value);
  };
  const [loading, setLoading] = useState(false);
  const Editar = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [openSplit, setOpenSplit] = useState(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleEstornar = async (id) => {
      setAnchorEl(null);
      setLoading(true);
      const resEstornar = await dispatch(postCobrancaEstornarAction(token, id));
      if (resEstornar) {
        toast.success("Cobrança estornada com sucesso!");
        setLoading(false);
      } else {
        toast.error("Erro ao estornar");
        setLoading(false);
      }
    };

    return (
      <Box>
        {token && userData === "" ? null : (
          <>
            <Button
              style={{ height: "15px", width: "10px" }}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              ...
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* <MenuItem
								onClick={() => {
									setOpen(true);
									setAnchorEl(null);
								}}
							>
								Capturar Valor
							</MenuItem> */}
              <MenuItem onClick={() => handleEstornar(row.id)}>
                Estornar Valor
              </MenuItem>
              {/* <MenuItem
								onClick={() => {
									setAnchorEl(null);
									setOpenSplit(true);
								}}
							>
								Repartir valor
							</MenuItem> */}
            </Menu>
            {open ? (
              <CreditCardCaptureModal
                row={row}
                open={open}
                onClose={() => setOpen(false)}
              />
            ) : null}
            {openSplit ? (
              <SplitModal
                row={row}
                open={openSplit}
                onClose={() => setOpenSplit(false)}
                contasUser={contasUser.data}
              />
            ) : null}
          </>
        )}
      </Box>
    );
  };
  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box display="flex" justifyContent="space-between" flexDirection="column">
        <Typography
          style={{
            marginTop: "8px",
            color: APP_CONFIG.mainCollors.primary,
            marginBottom: 30,
          }}
          variant="h4"
        >
          Lista de Máquinas Virtuais
        </Typography>
      </Box>
      <Box
        style={{
          width: "100%",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
        }}
      >
        <Box marginTop="16px" marginBottom="16px" style={{ margin: 30 }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Pesquisar por nome, documento..."
            value={filters.like}
            onChange={(e) =>
              setFilters({
                ...filters,
                like: e.target.value,
              })
            }
          />
        </Box>
        {cobrancaCartaoList.data && cobrancaCartaoList.per_page ? (
          <CustomTable
            columns={columns}
            data={cobrancaCartaoList.data}
            Editar={Editar}
          />
        ) : (
          <LinearProgress />
        )}

        <Box alignSelf="flex-end" marginTop="8px">
          <Pagination
            variant="outlined"
            color="secondary"
            size="large"
            count={cobrancaCartaoList.last_page}
            onChange={handleChangePage}
            page={page}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CreditCardBillingList;
