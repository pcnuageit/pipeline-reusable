import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

import {
  getTerminaisPOSAction,
  loadUserData,
  postTerminalPosAction,
  setHeaderLike,
} from "../../actions/actions";
import useAuth from "../../hooks/useAuth";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";

import moment from "moment";

import CustomTable from "../../components/CustomTable/CustomTable";

import CustomButton from "../../components/CustomButton/CustomButton";
import { APP_CONFIG } from "../../constants/config";

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
export default function ListaTerminaisPOS() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [data_liberacao, setData_liberacao] = useState("");
  const terminaisPOS = useSelector((state) => state.terminaisPOS);
  const userData = useSelector((state) => state.userData);
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({
    order: "",
    mostrar: "",
    like: "",
    type: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const [openDialog, setOpenDialog] = useState(false);
  const [tokenPos, setTokenPos] = useState("");

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(
      getTerminaisPOSAction(
        token,
        page,
        userData.id,
        debouncedLike,
        filters.order,
        filters.mostrar,
      ),
    );
  }, [token, page, filters.order, filters.mostrar, debouncedLike, userData.id]);

  useEffect(() => {
    return () => {
      dispatch(setHeaderLike(""));
    };
  }, []);

  const handleClickRow = (row) => {
    if (row.id) {
      const path = generatePath(
        "/dashboard/adquirencia/acao/terminais-pos/:id",
        {
          subsectionId: row.id,
        },
      );
      history.push(path);
    }
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleNewPos = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleStorePos = async () => {
    const resStorePos = await dispatch(
      postTerminalPosAction(token, userData.id, tokenPos),
    );
    if (resStorePos) {
      toast.error("Erro ao habilitar POS!");
    } else {
      toast.success(
        "POS habilitado! Ele será visível após a primeira transação.",
      );
      handleClose();
      setTokenPos("");
    }
  };
  /* 
	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []); */

  const columns = [
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (data) => {
        const dataFormatada = moment.utc(data).format("dd/MM/yyyy HH:mm:ss");
        return (
          <Box display="flex" justifyContent="center">
            <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
            <Typography style={{ marginLeft: "6px" }}>
              {dataFormatada}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Identificador do POS",
      key: "id",
      CustomValue: (value) => (
        <Box display="flex" justifyContent="center">
          <Typography>{value}</Typography>
        </Box>
      ),
    },
    {
      headerText: "Nome",
      key: "name",
      CustomValue: (name) => {
        return (
          <Typography
            style={{
              borderRadius: "27px",
            }}
          >
            <b>{name}</b>
          </Typography>
        );
      },
    },
  ];

  const Editar = (row) => {
    return <></>;
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Terminais POS" />

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
              <Box style={{ alignSelf: "flex-end", padding: "12px" }}>
                <CustomButton color="purple" onClick={handleNewPos}>
                  <Typography style={{ fontSize: "14px" }}>
                    Habilitar POS
                  </Typography>
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
                    {terminaisPOS.data && terminaisPOS.per_page > 0 ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            handleClickRow={handleClickRow}
                            data={terminaisPOS.data}
                            columns={columns}
                          />
                        </Box>
                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={terminaisPOS.last_page}
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
      <Dialog
        onClose={handleClose}
        open={openDialog}
        className={classes.SplitModal}
      >
        <Box display="flex" flexDirection="column" width="500px">
          <LoadingScreen isLoading={loading} />
          <DialogTitle className={classes.saqueHeader}>
            <Typography align="center" variant="h6">
              Habilitar novo POS
            </Typography>
          </DialogTitle>

          <Box margin="20px">
            <FormControl fullWidth>
              <Box marginTop={2}>
                <Typography variant="h6">Token do terminal POS</Typography>
                <TextField
                  className={classes.currency}
                  value={tokenPos}
                  onChange={(event) => setTokenPos(event.target.value)}
                  style={{
                    marginBottom: "6px",
                    width: "100%",
                  }}
                />
                {/* {storePosError ? (
									<FormHelperText
										style={{
											marginBottom: '6px',
											width: '60%',
											color: 'red',
										}}
									>
										{storePosError.token
											? storePosError.token[0]
											: null}
									</FormHelperText>
								) : null} */}
              </Box>
            </FormControl>
          </Box>

          <Box
            width="50%"
            alignSelf="end"
            display="flex"
            justifyContent="space-around"
            padding="12px 24px"
          >
            <Box margin="6px 0">
              <Button
                variant="outlined"
                style={{ borderRadius: "37px", marginRight: "10px" }}
                onClick={handleStorePos}
              >
                Habilitar
              </Button>
            </Box>
            <Box>
              <Button
                style={{ borderRadius: "37px", margin: "6px 0" }}
                variant="outlined"
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
