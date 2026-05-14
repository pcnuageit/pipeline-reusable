import {
  Box,
  Button,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useState } from "react";
import { useHistory } from "react-router";

import { faDownload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DialogExport from "./DialogExport";

import { useLocation } from "react-router-dom/cjs/react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import DateTimeColumn from "../../components/TableColumns/DateTimeColumn";
import { APP_CONFIG } from "../../constants/config";
import useDebounce from "../../hooks/useDebounce";
import { useIndexArquivoRetornoQuery } from "../../services/api";
import { downloadReturnFile } from "../../services/downloadReturnFile";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (created_at) => {
      return <DateTimeColumn dateTime={created_at} />;
    },
  },
  {
    headerText: "Download",
    key: "url",
    CustomValue: (value, data) => (
      <Box textAlign="center">
        {value ? (
          <Button
            onClick={() =>
              downloadReturnFile({
                id: data.id,
                accountId: data.conta_id,
              })
            }
          >
            <Box>
              <FontAwesomeIcon icon={faDownload} size="lg" />
              <Typography>Download</Typography>
            </Box>
          </Button>
        ) : (
          <FontAwesomeIcon spin icon={faSpinner} size="lg" />
        )}
      </Box>
    ),
  },
];

const ArquivoRetornoIndex = () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const accountId = useLocation().state?.accountId;
  const isAdm = useLocation().state?.isAdm;

  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    data_inicial: "",
    data_final: "",
  });

  const debouncedDataInicial = useDebounce(filters.data_inicial, 800);
  const debouncedDataFinal = useDebounce(filters.data_final, 800);

  const {
    data: returnFiles,
    isLoading,
    isError,
    isUninitialized,
  } = useIndexArquivoRetornoQuery(
    {
      page,
      data_inicial: debouncedDataInicial,
      data_final: debouncedDataFinal,
      conta_id: accountId,
    },
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 5000,
    },
  );

  const handleArquivosRemessa = () => {
    const path = isAdm
      ? `/dashboard/gerenciar-contas/${accountId}/arquivo-remessa`
      : `/dashboard/arquivo-remessa`;
    history.push(path);
  };

  const handleCloseDialog = () => {
    setOpenExportDialog(false);
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  /* useEffect(() => {
		if (isError) {
			toast.error('O usuário não está autenticado a entrar nessa página!');
			history.push('/dashboard/home');
		}
	}, [isError, history]); */

  return (
    <Box className={classes.root}>
      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Arquivos de Retorno" />
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
        {/* <Box
					display="flex"
					justifyContent="space-between"
					flexDirection={matches ? 'column' : null}
				>
					<Box
						display="flex"
						justifyContent="space-around"
						flexDirection={matches ? 'column' : null}
					>
						{isAdm ? null : (
							<CustomButton
								color="purple"
								variant="outlined"
								style={{
									marginTop: '8px',
									marginBottom: '12px',
									marginLeft: matches ? null : '10px',
								}}
								onClick={() => setOpenExportDialog(true)}
							>
								SOLICITAR NOVO ARQUIVO DE RETORNO
							</CustomButton>
						)}
						<CustomButton
							color="purple"
							variant="outlined"
							style={{
								marginTop: '8px',
								marginBottom: '12px',
								marginLeft: matches ? null : '10px',
							}}
							onClick={handleArquivosRemessa}
						>
							ARQUIVOS DE REMESSA
						</CustomButton>
					</Box>
				</Box> */}

        <DialogExport open={openExportDialog} handleClose={handleCloseDialog} />

        <Box marginBottom="16px" style={{ padding: "30px" }}>
          <Grid container spacing={2}>
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
                flexDirection: "row",
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
                    marginLeft: matches ? null : "10px",
                  }}
                  onClick={() => setOpenExportDialog(true)}
                >
                  SOLICITAR NOVO ARQUIVO DE RETORNO
                </CustomButton>
              )}
              <Box
                style={{
                  marginLeft: "10px",
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
                  onClick={handleArquivosRemessa}
                >
                  ARQUIVOS DE REMESSA
                </CustomButton>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Box>

      <>
        {!isLoading && !isError && !isUninitialized ? (
          <>
            <CustomTable columns={columns} data={returnFiles.data} />
            <Box alignSelf="flex-end" marginTop="8px">
              <Pagination
                variant="outlined"
                color="secondary"
                size="large"
                count={returnFiles.last_page}
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

export default ArquivoRetornoIndex;
