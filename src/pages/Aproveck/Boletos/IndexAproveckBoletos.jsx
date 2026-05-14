import {
  Box,
  Button,
  Grid,
  LinearProgress,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { generatePath, useHistory } from "react-router";
import { toast } from "react-toastify";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../../constants/config";
import useDebounce from "../../../hooks/useDebounce";
import useSgaAuth from "../../../hooks/useSgaAuth";
import { useIndexAproveckBoletosQuery } from "../../../services/api";
import FindAproveckAssociadoDialog from "../Associados/FindAproveckAssociadoDialog";
import columns from "./IndexColumns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const IndexAproveckBoletos = () => {
  const sgaToken = useSgaAuth();
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [openFindAssociadoDialog, setOpenFindAssociadoDialog] = useState(false);
  const [filters, setFilters] = useState({
    data_emissao_inicial: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
    data_emissao_final: dayjs().format("YYYY-MM-DD"),
    codigo_veiculo: "",
    placa: "",
    codigo_associado: "",
    cpf_associado: "",
    nosso_numero: "",
  });

  const debouncedFilters = useDebounce(filters, 800);

  const {
    data,
    isLoading: isLoadingBoletos,
    isFetching: isFetchingBoletos,
    isError,
    isUninitialized,
    error,
  } = useIndexAproveckBoletosQuery(
    {
      page,
      ...debouncedFilters,
      data_emissao_inicial: dayjs(debouncedFilters.data_emissao_inicial).format(
        "DD/MM/YYYY",
      ),
      data_emissao_final: dayjs(debouncedFilters.data_emissao_final).format(
        "DD/MM/YYYY",
      ),
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !sgaToken,
    },
  );

  let listaBoletos = useMemo(() => {
    if (isError) return [];
    if (!data) return [];

    const sortedData = Array.from(data);
    return sortedData.sort((a, b) => {
      const dateA = dayjs(a.data_emissao);
      const dateB = dayjs(b.data_emissao);
      // Compare the dates
      if (dateA.isBefore(dateB)) {
        return 1;
      } else if (dateA.isAfter(dateB)) {
        return -1;
      } else {
        return 0;
      }
    });
  }, [data, isError]);

  const isLoading = useMemo(
    () => isLoadingBoletos || isFetchingBoletos,
    [isLoadingBoletos, isFetchingBoletos],
  );

  const goToCriarNovoBoleto = () => {
    const path = generatePath(`/dashboard/aproveck-boletos-criar`);
    history.push(path);
  };

  const goToVeiculosPage = () => {
    const path = generatePath(`/dashboard/aproveck-veiculos`);
    history.push(path);
  };

  const goToDetalhesBoleto = (boleto) => {
    const path = generatePath(`/dashboard/aproveck-boletos/:id/detalhes`, {
      id: boleto.nosso_numero,
    });
    history.push(path);
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (!isLoading && isError && error) {
      const error_details = error.data?.error;
      if (error_details) toast.warning(error_details[0]);
      else toast.warning("Verifique os filtros aplicados!");
    }
  }, [isLoading, isUninitialized, isError, error]);

  const indexBoletoColumns = [
    ...columns,
    {
      headerText: "",
      key: "acoes_boleto_column",
      FullObject: (boleto) => (
        <Box display="flex" flexDirection="column">
          <Button
            variant="outlined"
            onClick={() => goToDetalhesBoleto(boleto)}
            style={{
              width: "100%",
              backgroundColor: APP_CONFIG.mainCollors.primary,
              color: "white",
              borderRadius: "37px",
              fontWeight: "bold",
              fontSize: "11px",
              height: "38px",
              boxShadow: "0px 0px 5px 0.7px grey",
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            +
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className={classes.root}>
      {openFindAssociadoDialog && (
        <FindAproveckAssociadoDialog
          open={openFindAssociadoDialog}
          setOpen={setOpenFindAssociadoDialog}
          onClose={() => setOpenFindAssociadoDialog(false)}
        />
      )}

      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Aprovec Boletos" />
      </Box>
      <Grid
        container
        style={{
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          borderTopRightRadius: "17px",
          borderTopLeftRadius: "17px",
          padding: "20px",
        }}
      >
        <Grid item xs={12} sm={9}>
          <Grid container spacing={3} style={{ padding: "10px" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                label="Filtrar por código do veículo..."
                fullWidth
                value={filters.codigo_veiculo}
                onChange={(e) =>
                  setFilters({ ...filters, codigo_veiculo: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                label="Filtrar por placa..."
                fullWidth
                value={filters.placa}
                onChange={(e) =>
                  setFilters({ ...filters, placa: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                label="Filtrar por código do associado..."
                fullWidth
                value={filters.codigo_associado}
                onChange={(e) =>
                  setFilters({ ...filters, codigo_associado: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                label="Filtrar por cpf associado..."
                fullWidth
                value={filters.cpf_associado}
                onChange={(e) =>
                  setFilters({ ...filters, cpf_associado: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                label="Filtrar por nosso número..."
                fullWidth
                value={filters.nosso_numero}
                onChange={(e) =>
                  setFilters({ ...filters, nosso_numero: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                label="Data Emissão Inicial"
                value={filters.data_emissao_inicial}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    data_emissao_inicial: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                label="Data Emissão Final"
                value={filters.data_emissao_final}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    data_emissao_final: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3} style={{ padding: "10px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                color="purple"
                variant="outlined"
                onClick={goToCriarNovoBoleto}
                style={{
                  width: "100%",
                  backgroundColor: APP_CONFIG.mainCollors.primary,
                  color: "white",
                  borderRadius: "37px",
                  fontWeight: "bold",
                  fontSize: "11px",
                  height: "38px",
                  boxShadow: "0px 0px 5px 0.7px grey",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                Criar Boleto
              </Button>
              <Button
                color="purple"
                variant="outlined"
                onClick={goToVeiculosPage}
                style={{
                  marginTop: "6px",
                  width: "100%",
                  backgroundColor: APP_CONFIG.mainCollors.primary,
                  color: "white",
                  borderRadius: "37px",
                  fontWeight: "bold",
                  fontSize: "11px",
                  height: "38px",
                  boxShadow: "0px 0px 5px 0.7px grey",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                Veículos
              </Button>
              <Button
                color="purple"
                variant="outlined"
                onClick={() => setOpenFindAssociadoDialog(true)}
                style={{
                  marginTop: "6px",
                  width: "100%",
                  backgroundColor: APP_CONFIG.mainCollors.primary,
                  color: "white",
                  borderRadius: "37px",
                  fontWeight: "bold",
                  fontSize: "11px",
                  height: "38px",
                  boxShadow: "0px 0px 5px 0.7px grey",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                Associados
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <CustomTable
            columns={indexBoletoColumns}
            data={listaBoletos && !isError ? listaBoletos : []}
            // Editar={Editar}
          />
          <Box alignSelf="flex-end" marginTop="8px">
            <Pagination
              variant="outlined"
              color="secondary"
              size="large"
              count={listaBoletos?.last_page}
              onChange={handleChangePage}
              page={page}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default IndexAproveckBoletos;
