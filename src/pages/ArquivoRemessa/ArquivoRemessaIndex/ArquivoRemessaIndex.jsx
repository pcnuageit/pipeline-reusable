import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useMemo, useState } from "react";
import { generatePath, useHistory, useParams } from "react-router";

import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import DateTimeColumn from "../../../components/TableColumns/DateTimeColumn";
import { APP_CONFIG } from "../../../constants/config";
import useDebounce from "../../../hooks/useDebounce";
import {
  useIndexArquivoRemessaQuery,
  useLazyShowArquivoRemessaQuery,
} from "../../../services/api";
import DialogUpload from "./DialogUpload";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  dialogHeader: {
    background: APP_CONFIG.mainCollors.background,
    color: "white",
  },
  dialogTitle: {
    background: APP_CONFIG.mainCollors.background,
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  dialogSelectFile: {
    margin: "10px auto",
  },
}));

const amountOfItems = (items) => (items ? items.length : "-");

const successfullyCreatedBills = (items) => {
  const bills = items?.filter((item) => item.boleto_id != null);

  return bills ? bills.length : "-";
};

const columns = [
  { headerText: "Nome", key: "name" },
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (created_at) => {
      return <DateTimeColumn dateTime={created_at} />;
    },
  },
  {
    headerText: "Qnt de detalhes",
    key: "data.details",
    CustomValue: (details) => {
      return <Typography> {amountOfItems(details)}</Typography>;
    },
  },
  {
    headerText: "Qnt de itens criados",
    key: "items",
    CustomValue: (items) => {
      return <Typography> {amountOfItems(items)}</Typography>;
    },
  },
  {
    headerText: "Boletos gerados",
    key: "items",
    CustomValue: (items) => {
      return <Typography> {successfullyCreatedBills(items)}</Typography>;
    },
  },
  { headerText: "Ações", key: "menu" },
];

const Editar = ({ row }) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const { id: accountId } = useParams();

  const [showArquivoRemessa] = useLazyShowArquivoRemessaQuery();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowItems = () => {
    const path = generatePath(`/dashboard/arquivo-remessa/${row.id}/itens`);
    history.push(path, { accountId });
  };

  const handleShowShippingFile = async (row) => {
    try {
      const response = await showArquivoRemessa({ id: row.id }).unwrap();
      const path = generatePath(`/dashboard/detalhes-arquivo-remessa/:id/ver`, {
        id: row.id,
      });
      history.push(path, {
        response,
        isOnlyShow: true,
        shippingFileId: row.id,
        accountId,
      });
    } catch (e) {
      toast.error(e.data.error);
    }
  };

  return (
    <Box>
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
          <MenuItem onClick={() => handleShowShippingFile(row)}>
            Visualizar Arquivo de Remessa
          </MenuItem>
          <MenuItem onClick={handleShowItems}>
            Visualizar Itens da Remessa
          </MenuItem>
        </Menu>
      </>
    </Box>
  );
};

const ArquivoRemessaIndex = () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const userData = useSelector((state) => state.userData);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    nome: "",
    data_inicial: "",
    data_final: "",
    boleto_id: "",
  });

  const debounceNome = useDebounce(filters.nome, 800);
  const debouncedDataInicial = useDebounce(filters.data_inicial, 800);
  const debouncedDataFinal = useDebounce(filters.data_final, 800);
  const debouncedBoletoId = useDebounce(filters.boleto_id, 800);

  const accountId = useMemo(() => id ?? userData.id, [id, userData]);
  const isAdm = useMemo(() => id !== undefined, [id]);

  const {
    data: shippingFiles,
    isLoading,
    isError,
    isUninitialized,
  } = useIndexArquivoRemessaQuery(
    {
      page,
      nome: debounceNome,
      data_inicial: debouncedDataInicial,
      data_final: debouncedDataFinal,
      boleto_id: debouncedBoletoId,
      /* conta_id: accountId, */
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const handleCloseDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleArquivosRetorno = () => {
    const path = isAdm
      ? `/dashboard/gerenciar-contas/${accountId}/arquivo-retorno`
      : "/dashboard/arquivo-retorno";
    history.push(path, { accountId, isAdm });
  };

  /* 	useEffect(() => {
		if (isError) {
			toast.error('O usuário não está autenticado a entrar nessa página!');
			history.push('/dashboard/home');
		}
	}, [isError, history]); */

  return (
    <Box className={classes.root}>
      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Arquivos de Remessa" />
      </Box>
      <Box
        style={{
          display: "flex",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          /* alignItems: 'center', */
          borderTopRightRadius: "17px",
          borderTopLeftRadius: "17px",
          flexDirection: "column",
          /* maxWidth: '90%', */
          minWidth: "100%",

          /* alignItems: 'center', */
        }}
      >
        <DialogUpload open={openUploadDialog} handleClose={handleCloseDialog} />

        <Box marginBottom="16px" style={{ padding: "30px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                label="Filtrar arquivo por nome..."
                fullWidth
                value={filters.nome}
                onChange={(e) =>
                  setFilters({ ...filters, nome: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                label="Filtrar id do boleto..."
                fullWidth
                value={filters.boleto_id}
                onChange={(e) =>
                  setFilters({ ...filters, boleto_id: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
                }}
                type="date"
                label="Data Inicial"
                value={filters.data_inicial}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    data_inicial: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
                }}
                type="date"
                label="Data Final"
                value={filters.data_final}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    data_final: e.target.value,
                  })
                }
              />
            </Grid>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "15px",
              }}
            >
              {isAdm ? null : (
                <CustomButton
                  color="purple"
                  variant="outlined"
                  style={{
                    marginTop: "8px",
                    marginBottom: "12px",
                  }}
                  onClick={() => setOpenUploadDialog(true)}
                >
                  CARREGAR ARQUIVO DE REMESSA
                </CustomButton>
              )}
              <Box
                style={{
                  marginTop: "10px",
                }}
              >
                <CustomButton
                  color="purple"
                  variant="outlined"
                  style={{
                    marginTop: "8px",
                    marginBottom: "12px",
                    marginLeft: matches ? null : "10px",
                  }}
                  onClick={handleArquivosRetorno}
                >
                  ARQUIVOS DE RETORNO
                </CustomButton>
              </Box>
            </Box>
          </Grid>

          {/* <Box
						display="flex"
						justifyContent="space-between"
						flexDirection={matches ? 'column' : null}
					>
						<Box
							display="flex"
							justifyContent="space-around"
							flexDirection={matches ? 'column' : null}
						></Box>
					</Box> */}
        </Box>
      </Box>

      <>
        {!isLoading && !isError && !isUninitialized ? (
          <>
            <CustomTable
              columns={columns}
              data={shippingFiles.data}
              Editar={Editar}
            />
            <Box alignSelf="flex-end" marginTop="8px">
              <Pagination
                variant="outlined"
                color="secondary"
                size="large"
                count={shippingFiles.last_page}
                onChange={handleChangePage}
                page={page}
              />
            </Box>
          </>
        ) : (
          <LinearProgress />
        )}
      </>
    </Box>
  );
};

export default ArquivoRemessaIndex;
