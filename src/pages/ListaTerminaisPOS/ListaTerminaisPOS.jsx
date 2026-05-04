import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  LinearProgress,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router";
import {
  getAllContasAction,
  getTerminaisPOSFilterAction,
  postTerminalPosAction,
} from "../../actions/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import SplitModal from "../../components/SplitModal/SplitModal";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
  SplitModal: {
    padding: "20px",
  },
  saqueHeader: {
    background: APP_CONFIG.mainCollors.primary,
    color: "white",
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

const ListaTerminaisPOS = () => {
  const token = useAuth();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const terminaisPOS = useSelector((state) => state.terminaisPOS);
  const contasUser = useSelector((state) => state.contas);
  const userData = useSelector((state) => state.userData);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenPos, setTokenPos] = useState("");

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
    dispatch(getTerminaisPOSFilterAction(token, page, debouncedLike, id));
  }, [page, debouncedLike, id]);

  useEffect(() => {
    return () => {
      setFilters({ ...filters });
    };
  }, []);

  const handleStorePos = async () => {
    const resStorePos = await dispatch(
      postTerminalPosAction(token, id, tokenPos)
    );
    if (resStorePos) {
      toast.success(
        "POS habilitado! Ele será visível após a primeira transação."
      );
      handleClose();
      setTokenPos("");
    } else {
      toast.error("Erro ao habilitar POS!");
    }
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleNewPos = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleClickRow = (row) => {
    if (row.id) {
      const path = generatePath(
        "/dashboard/gerenciar-contas/:id/detalhes-terminal-pos",
        {
          id: row.id,
        }
      );
      history.push(path);
    }
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
        alignItems="center"
      >
        <Typography
          style={{
            marginTop: "8px",
            marginBottom: 30,
            color: APP_CONFIG.mainCollors.primary,
          }}
          variant="h4"
        >
          Terminais POS
        </Typography>
        <CustomButton color="purple" onClick={handleNewPos}>
          <Typography style={{ fontSize: "14px" }}>Habilitar POS</Typography>
        </CustomButton>

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
        {terminaisPOS.data && terminaisPOS.per_page ? (
          <CustomTable
            columns={columns}
            data={terminaisPOS.data}
            Editar={Editar}
            handleClickRow={handleClickRow}
          />
        ) : (
          <LinearProgress />
        )}
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
};

export default ListaTerminaisPOS;
