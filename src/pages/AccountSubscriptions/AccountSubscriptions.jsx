import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  LinearProgress,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  delAssinatura,
  loadAssinaturasFilters,
  loadPlanosAll,
} from "../../actions/actions";

import CustomTable from "../../components/CustomTable/CustomTable";

import SettingsIcon from "@material-ui/icons/Settings";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import ChangePlanModal from "./ChangePlanModal/ChangePlanModal";

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
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    boxShadow: "none",
    borderRadius: "0px",
    alignSelf: "center",
    modal: {
      outline: " none",
      display: "flex",
      flexDirection: "column",
      alignSelf: "center",
      position: "absolute",
      top: "10%",
      left: "35%",
      width: "30%",
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
    inputLabelNoShrink: {
      transform: "translate(45px, 15px) scale(1)",
    },
    currencyInput: {
      marginBottom: "6px",

      alignSelf: "center",
      textAlign: "center",
      height: 45,
      fontSize: 17,
      borderWidth: "0px !important",
      borderRadius: 27,

      color: APP_CONFIG.mainCollors.primary,
      backgroundColor: "transparent",
      fontFamily: "Montserrat-Regular",
    },
  },
}));

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
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const userData = useSelector((state) => state.userData);
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const shrink = filters.like.length > 0;
  const assinaturasList = useSelector((state) => state.assinaturasList);
  const [loading, setLoading] = useState(false);

  const handlePlanos = () => {
    history.push("/dashboard/adquirencia/acao/planos-de-assinaturas");
  };
  const handleNovaAssinatura = () => {
    history.push("/dashboard/adquirencia/acao/nova-assinatura");
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
        id,
      ),
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

    const handleExcluir = async () => {
      await dispatch(delAssinatura(token, row.id));
      dispatch(
        loadAssinaturasFilters(
          token,
          page,
          debouncedLike,
          filters.order,
          filters.plano,
          filters.mostrar,
          id,
        ),
      );
    };

    return (
      <>
        {token && userData === "" ? null : (
          <>
            <Box
              onClick={handleClick}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                /* height: '50px',
								width: '50px', */

                cursor: "pointer",
                /* borderRadius: '32px', */
                alignItems: "center",
                justifyContent: "center",

                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
                },
              }}
            >
              <Box
                style={{
                  borderRadius: "32px",
                  backgroundColor: "white",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SettingsIcon
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                    fontSize: "30px",
                    "&:hover": {
                      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
                    },
                  }}
                />
              </Box>
            </Box>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                style={{ color: APP_CONFIG.mainCollors.primary }}
                onClick={() => {
                  setOpen(true);
                  dispatch(loadPlanosAll(token));
                  setAnchorEl(null);
                }}
              >
                Editar
              </MenuItem>
              <MenuItem
                style={{ color: APP_CONFIG.mainCollors.primary }}
                onClick={() => handleExcluir(row)}
              >
                Excluir
              </MenuItem>
            </Menu>
            <ChangePlanModal
              row={row}
              open={open}
              onClose={() => setOpen(false)}
            />
          </>
        )}
      </>
    );
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <Box style={{ marginBottom: "10px" }}>
          <CustomHeader pageTitle="Assinatura" />
        </Box>

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
                /* maxWidth: '90%', */
                minWidth: "100%",

                /* alignItems: 'center', */
              }}
            >
              <Box
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "30px",
                }}
              >
                <TextField
                  fullWidth
                  value={filters.like}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      like: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: shrink,
                    className: shrink ? undefined : classes.inputLabelNoShrink,
                  }}
                  variant="outlined"
                  label="Buscar por nome, documento..."
                  style={{ width: "40%" }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        style={{
                          fontSize: "30px",
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      />
                    ),
                  }}
                />
                <Box
                  style={{
                    display: "flex",
                  }}
                >
                  <Box style={{ marginRight: "20px" }}>
                    <CustomButton
                      onClick={handlePlanos}
                      color="horizontalGradient"
                    >
                      <Typography style={{ color: "white" }}>
                        Planos de Assinatura
                      </Typography>
                    </CustomButton>
                  </Box>

                  <CustomButton color="purple" onClick={handleNovaAssinatura}>
                    + Nova Assinatura
                  </CustomButton>
                </Box>
              </Box>
              <Box
                style={{
                  width: "100%",

                  borderRadius: 27,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box
                  display="flex"
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Box
                    style={
                      value === 3
                        ? {
                            width: "100%",
                            borderTopRightRadius: 27,
                            borderTopLeftRadius: 27,
                          }
                        : {
                            width: "100%",
                            borderTopRightRadius: 27,
                            borderTopLeftRadius: 27,
                          }
                    }
                  >
                    {assinaturasList && assinaturasList.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns ? columns : null}
                            data={assinaturasList.data}
                            Editar={Editar}
                          />
                        </Box>
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
    </Box>

    /* 
		<Box display="flex" flexDirection="column">
			{token && userData === '' ? (
				<CustomBreadcrumbs
					path1="Gerenciar Listas"
					to1="goBack"
					path2="Cobrança Recorrente"
				/>
			) : (
				<CustomBreadcrumbs path1="Cobrança Recorrente" />
			)}
			<Box
				display="flex"
				justifyContent="space-between"
				flexDirection={matches ? 'column' : null}
			>
				<Typography
					style={{ marginTop: '8px', marginBottom: 30, color: '#9D9CC6' }}
					variant="h4"
				>
					Cobrança Recorrente
				</Typography>
				{token && userData === '' ? null : (
					<Box>
						<Button
							onClick={handlePlanos}
							style={{ borderRadius: '27px', marginRight: '12px' }}
							variant="outlined"
						>
							Planos de Cobrança Recorrente
						</Button>
						<CustomButton onClick={handleNovaAssinatura}>
							+ Nova Assinatura
						</CustomButton>
					</Box>
				)}
			</Box>
			<Box
				style={{
					width: '100%',
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
		</Box> */
  );
};

export default AccountSubscriptions;
