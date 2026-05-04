import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { loadAssinaturasFilters, loadPlanosAll } from "../../actions/actions";

import CustomTable from "../../components/CustomTable/CustomTable";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
/* import ChangePlanModal from './ChangePlanModal/ChangePlanModal'; */

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
    headerText: "Pagador",
    key: "pagador",
    CustomValue: (pagador) => {
      return (
        <>
          <Typography>{pagador.nome ? pagador.nome : null}</Typography>
          <Typography>
            {pagador.documento ? pagador.documento : null}
          </Typography>
        </>
      );
    },
  },
  { headerText: "Plano", key: "" },
  { headerText: "Ações", key: "menu" },
];

const AccountSubscriptions = () => {
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
    plano: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const token = useAuth();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const userData = useSelector((state) => state.userData);
  const id = useParams()?.id ?? "";

  const assinaturasList = useSelector((state) => state.assinaturasList);

  const handlePlanos = () => {
    history.push("/dashboard/planos-de-assinaturas");
  };
  const handleNovaAssinatura = () => {
    history.push("/dashboard/nova-assinatura");
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(
      loadAssinaturasFilters(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.plano,
        filters.mostrar,
        id
      )
    );
  }, [page, filters.order, filters.plano, filters.mostrar, debouncedLike, id]);

  const Editar = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleExcluir = async () => {};

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
                  setOpen(true);
                  dispatch(loadPlanosAll(token));
                  setAnchorEl(null);
                }}
              >
                Editar
              </MenuItem>
              <MenuItem onClick={() => handleExcluir(row)}>Excluir</MenuItem>
            </Menu>
            {/* <ChangePlanModal
							row={row}
							open={open}
							onClose={() => setOpen(false)}
						/> */}
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
          Cobrança Recorrente
        </Typography>
        {/* {token && userData === '' ? null : (
					<Box>
						<Button
							onClick={handlePlanos}
							style={{ borderRadius: '27px', marginRight: '12px' }}
							variant="outlined"
						>
							Planos de Cobrança Recorrente
						</Button>
						<GradientButton
							buttonText="+ Nova Assinatura"
							onClick={handleNovaAssinatura}
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
      </Box>

      {assinaturasList.data && assinaturasList.per_page ? (
        <CustomTable
          columns={columns}
          data={assinaturasList.data}
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
          count={assinaturasList.last_page}
          onChange={handleChangePage}
          page={page}
        />
      </Box>
    </Box>
  );
};

export default AccountSubscriptions;
