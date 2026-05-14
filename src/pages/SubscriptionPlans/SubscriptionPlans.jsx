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
import { generatePath, useHistory } from "react-router";
import {
  delPlano,
  loadPlanoId,
  loadPlanosFilters,
} from "../../actions/actions";

import SettingsIcon from "@material-ui/icons/Settings";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

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
  // { headerText: 'Situação', key: 'situacao' },
  { headerText: "Plano", key: "nome" },
  { headerText: "Frequência", key: "frequencia" },
  { headerText: "Descrição", key: "descricao" },
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
  { headerText: "Ações", key: "menu" },
];

const SubscriptionPlans = () => {
  const history = useHistory();
  const classes = useStyles();
  const token = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
  });
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const shrink = filters.like.length > 0;
  const planosList = useSelector((state) => state.planosList);

  useEffect(() => {
    dispatch(
      loadPlanosFilters(
        token,
        page,
        filters.like,
        filters.order,
        filters.mostrar,
      ),
    );
  }, [token, page, filters, planosList.data.total]);

  const handleNewPlano = () => {
    history.push("/dashboard/novo-plano");
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const Editar = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleExcluir = async () => {
      setLoading(true);
      const resDelPlano = await dispatch(delPlano(token, row.id));
      if (!resDelPlano) {
        await dispatch(
          loadPlanosFilters(
            token,
            page,
            filters.like,
            filters.order,
            filters.mostrar,
          ),
        );
        setLoading(false);
      }

      setAnchorEl(null);
    };
    const handleEditar = async (row) => {
      const resLoadPlano = await dispatch(loadPlanoId(token, row.id));
      if (resLoadPlano) {
        toast.error("Erro ao carregar plano");
      } else {
        const path = generatePath(
          "/dashboard/adquirencia/acao/planos-de-assinaturas/:subsectionId",
          {
            subsectionId: row.id,
          },
        );
        history.push(path);
      }
    };

    return (
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
              handleEditar(row);
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
      </>
    );
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Planos de Assinatura" />

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
                  style={{ width: "80%" }}
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
                <CustomButton
                  color="purple"
                  onClick={() =>
                    history.push(
                      "/dashboard/adquirencia/acao/criar-plano-de-assinatura",
                    )
                  }
                >
                  + Novo plano
                </CustomButton>
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
                    {planosList.data && planosList.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns ? columns : null}
                            data={planosList.data}
                            Editar={Editar}
                          />
                        </Box>
                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={planosList.last_page}
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
    /* 	<Box display="flex" flexDirection="column">
			<CustomBreadcrumbs path1="Planos" />
			<Box
				display="flex"
				justifyContent="space-between"
				flexDirection={matches ? 'column' : null}
			>
				<Typography style={{ marginTop: '8px' }} variant="h4">
					Planos
				</Typography>
				<Box>
					<GradientButton
						buttonText="+ Novo Plano"
						onClick={handleNewPlano}
					/>
				</Box>
			</Box>
			<Box marginTop="16px" marginBottom="16px">
				<SearchBar
					fullWidth
					placeholder="Pesquisar por nome, descrição..."
					value={filters.like}
					onChange={(e) =>
						setFilters({
							...filters,
							like: e.target.value,
						})
					}
				/>
			</Box>

			{planosList.data && planosList.per_page ? (
				<CustomTable
					columns={columns}
					data={planosList.data}
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
					count={planosList.last_page}
					onChange={handleChangePage}
					page={page}
				/>
			</Box>
		</Box> */
  );
};

export default SubscriptionPlans;
