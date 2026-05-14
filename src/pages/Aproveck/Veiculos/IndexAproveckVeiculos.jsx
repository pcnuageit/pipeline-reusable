import {
  Box,
  Button,
  Grid,
  LinearProgress,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useEffect, useMemo, useState } from "react";
import { generatePath, useHistory } from "react-router";
import { toast } from "react-toastify";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../../constants/config";
import useDebounce from "../../../hooks/useDebounce";
import { useIndexAproveckVeiculosQuery } from "../../../services/api";
import FindAproveckVeiculoDialog from "./FindAproveckVeiculoDialog";
import veiculoColumns from "./IndexColumns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const IndexAproveckVeiculos = () => {
  const history = useHistory();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [openFindVeiculoDialog, setOpenFindVeiculoDialog] = useState(false);
  const [filters, setFilters] = useState({
    documento: "",
  });

  const debouncedFilters = useDebounce(filters, 800);

  const {
    data: listaVeiculos,
    isLoading: isLoadingVeiculo,
    isFetching: isFetchingVeiculo,
    isError,
    error,
  } = useIndexAproveckVeiculosQuery(
    {
      page,
      ...debouncedFilters,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !debouncedFilters.documento,
    },
  );

  const isLoading = useMemo(
    () => isLoadingVeiculo || isFetchingVeiculo,
    [isLoadingVeiculo, isFetchingVeiculo],
  );

  useEffect(() => {
    console.log({ isError, error });
    if (!isLoading && isError && error) {
      const error_details = error.data?.error;
      if (error_details) toast.warning(error_details[0]);
      else toast.warning("Verifique os filtros aplicados!");
    }
  }, [isLoading, isError, error]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  function goToShowVeiculo(veiculo) {
    const path = generatePath(`/dashboard/aproveck-veiculos/:id/detalhes`, {
      id: veiculo.placa,
    });
    history.push(path);
  }

  const columns = [
    ...veiculoColumns,
    {
      headerText: "",
      key: "veiculo_acoes_column",
      FullObject: (veiculo) => (
        <Box display="flex" flexDirection="column">
          <Button
            variant="outlined"
            onClick={() => goToShowVeiculo(veiculo)}
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
      {openFindVeiculoDialog && (
        <FindAproveckVeiculoDialog
          open={openFindVeiculoDialog}
          setOpen={setOpenFindVeiculoDialog}
          onClose={() => setOpenFindVeiculoDialog(false)}
        />
      )}

      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Aprovec Veículos" />
      </Box>
      <Box
        style={{
          display: "flex",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          borderTopRightRadius: "17px",
          borderTopLeftRadius: "17px",
          flexDirection: "column",
          padding: "30px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              label="Filtrar por documento associado..."
              type="number"
              fullWidth
              value={filters.documento}
              onChange={(e) =>
                setFilters({ ...filters, documento: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              color="purple"
              variant="outlined"
              onClick={() => setOpenFindVeiculoDialog(true)}
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
              Pesqusar Placa
            </Button>
          </Grid>
        </Grid>
      </Box>

      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <CustomTable
            columns={columns}
            data={listaVeiculos && !isError ? listaVeiculos : []}
            // Editar={Editar}
          />
          <Box alignSelf="flex-end" marginTop="8px">
            <Pagination
              variant="outlined"
              color="secondary"
              size="large"
              count={listaVeiculos?.last_page}
              onChange={handleChangePage}
              page={page}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default IndexAproveckVeiculos;
