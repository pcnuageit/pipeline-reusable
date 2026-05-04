import { faCalendarAlt, faInfo } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { getAllContasAction, loadBoletosFilter } from "../../actions/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import CustomTable from "../../components/CustomTable/CustomTable";
import SplitModal from "../../components/SplitModal/SplitModal";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const p = data.split(/\D/g);
      const dataFormatada = [p[2], p[1], p[0]].join("/");
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
      if (status === "Pendente") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              fontWeight: "bold",
            }}
          >
            PENDENTE
          </Typography>
        );
      }
      if (status === "Pago") {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            CONCLUIDO
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
        <Box>
          <Typography>
            {pagador.nome ? pagador.nome : pagador.razao_social}
          </Typography>
          <Typography>
            {pagador.documento ? pagador.documento : null}
          </Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Descrição",
    key: "descricao",
    CustomValue: (descricao) => {
      return (
        <Tooltip title={descricao}>
          <Box marginLeft="12px">
            <FontAwesomeIcon icon={faInfo} />
          </Box>
        </Tooltip>
      );
    },
  },
  {
    headerText: "Ações",
    key: "menu",
  },
];

const PaymentSlipList = () => {
  const boletos = useSelector((state) => state.boletos);
  const token = useAuth();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const contasUser = useSelector((state) => state.contas);
  const userData = useSelector((state) => state.userData);
  const id = useParams()?.id ?? "";
  useEffect(() => {
    dispatch(getAllContasAction(token));
  }, []);
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
  });

  const debouncedLike = useDebounce(filters.like, 800);

  useEffect(() => {
    dispatch(
      loadBoletosFilter(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        id
      )
    );
  }, [page, debouncedLike, filters.order, filters.mostrar, id]);

  useEffect(() => {
    return () => {
      setFilters({ ...filters });
    };
  }, []);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleNewBoleto = () => {
    history.push("/dashboard/gerar-boleto");
  };

  const Editar = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [openSplit, setOpenSplit] = useState(false);

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
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  window.open(`${row.url}`, "Boleto", "height=1000,width=1000");
                }}
              >
                Visualizar
              </MenuItem>
            </Menu>
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
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={matches ? "column" : null}
      >
        <Typography
          style={{
            marginTop: "8px",
            marginBottom: 30,
            color: APP_CONFIG.mainCollors.primary,
          }}
          variant="h4"
        >
          Boletos
        </Typography>

        {/* {token && userData === '' ? null : (
					<Box>
						<Button
							style={{ borderRadius: '27px', marginRight: '12px' }}
							variant="outlined"
						>
							Boleto em Lote
						</Button>
						<CustomButton
							onClick={handleNewBoleto}
							buttonText="Nova Cobrança"
						/>
					</Box>
				)} */}
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
            placeholder="Procurar por documento, nome..."
            value={filters.like}
            onChange={(e) =>
              setFilters({
                ...filters,
                like: e.target.value,
              })
            }
          />
        </Box>
      </Box>

      <>
        {boletos.data && boletos.per_page ? (
          <CustomTable columns={columns} data={boletos.data} Editar={Editar} />
        ) : (
          <LinearProgress />
        )}
        <Box alignSelf="flex-end" marginTop="8px">
          <Pagination
            variant="outlined"
            color="secondary"
            size="large"
            count={boletos.last_page}
            onChange={handleChangePage}
            page={page}
          />
        </Box>
      </>
    </Box>
  );
};

export default PaymentSlipList;
