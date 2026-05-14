import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { generatePath, useHistory } from "react-router";
import { toast } from "react-toastify";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../../constants/config";
import useDebounce from "../../../hooks/useDebounce";
import { useGetAproveckVeiculoQuery } from "../../../services/api";
import IndexStatusColumn from "./IndexStatusColumn";

function FindAproveckVeiculoDialog({
  open = false,
  setOpen = () => {},
  onClose = () => {},
}) {
  const history = useHistory();
  const [filters, setFilters] = useState({
    placa: "",
  });
  const debouncedFilters = useDebounce(filters, 1000);

  const {
    data: veiculo,
    isLoading: isLoadingVeiculo,
    isFetching: isFetchingVeiculo,
    isError,
    error,
  } = useGetAproveckVeiculoQuery(
    {
      ...debouncedFilters,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !debouncedFilters.placa,
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

  function goToShowVeiculo(veiculo) {
    const path = generatePath(`/dashboard/aproveck-veiculos/:id/detalhes`, {
      id: veiculo.placa,
    });
    history.push(path);
  }

  const columns = [
    {
      headerText: "-",
      key: "veiculo.codigo_veiculo",
      CustomValue: (codigo_veiculo) => (
        <Typography>{codigo_veiculo}</Typography>
      ),
    },
    {
      headerText: "Placa",
      key: "veiculo.placa",
      CustomValue: (placa) => <Typography>{placa}</Typography>,
    },
    {
      headerText: "Modelo",
      key: "veiculo.modelo",
      CustomValue: (modelo) => <Typography>{modelo}</Typography>,
    },
    {
      headerText: "Dono",
      key: "veiculo",
      CustomValue: (veiculo) => (
        <Box display="flex" flexDirection="column">
          <Typography>{veiculo?.nome}</Typography>
          <Typography>{veiculo?.cpf}</Typography>
        </Box>
      ),
    },
    {
      headerText: "Situação",
      key: "veiculo.codigo_situacao",
      CustomValue: (situacao) => {
        return <IndexStatusColumn status={situacao} />;
      },
    },
    {
      headerText: "",
      key: "veiculo_acoes_column",
      FullObject: (object) => (
        <Box display="flex" flexDirection="column">
          <Button
            variant="outlined"
            onClick={() => goToShowVeiculo(object.veiculo)}
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
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth={"md"}
    >
      <DialogTitle>
        <Typography
          variant="h5"
          style={{
            color: APP_CONFIG.mainCollors.primary,
            fontFamily: "Montserrat-SemiBold",
            marginBottom: "20px",
          }}
        >
          Buscar Veículo
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Pesquisar por placa..."
              value={filters.placa}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  placa: e.target.value,
                });
              }}
            />
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent
        style={{
          minWidth: 500,
        }}
      >
        {isLoading ? (
          <Box width="100%" style={{ marginTop: "30px" }}>
            <LinearProgress color="secondary" />
          </Box>
        ) : (
          <Box style={{ marginTop: "30px" }}>
            {veiculo && !isError ? (
              <Box style={{ marginTop: "30px" }}>
                <CustomTable columns={columns} data={[veiculo]} />
              </Box>
            ) : (
              <Typography>Veículo não encontrado</Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          width="100%"
          padding={2}
        >
          <Box>
            <Button
              variant="outlined"
              disabled={veiculo?.id === null}
              onClick={() => setOpen(false)}
              style={{
                width: "100%",
                marginRight: "10px",
                borderRadius: "37px",
                fontWeight: "bold",
                fontSize: "11px",
                height: "38px",
                boxShadow: "0px 0px 5px 0.7px grey",
                fontFamily: "Montserrat-SemiBold",
              }}
            >
              Ok
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default FindAproveckVeiculoDialog;
