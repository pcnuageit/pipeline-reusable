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
import { useGetAproveckAssociadoQuery } from "../../../services/api";
import associadoColumns from "./IndexColumns";

function FindAproveckAssociadoDialog({ open, setOpen, onClose }) {
  const history = useHistory();
  const [filters, setFilters] = useState({
    documento: "",
  });
  const debouncedFilters = useDebounce(filters, 1000);

  const {
    data: associado,
    isLoading: isLoadingAssociado,
    isFetching: isFetchingAssociado,
    isError,
    error,
  } = useGetAproveckAssociadoQuery(
    {
      ...debouncedFilters,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !debouncedFilters.documento,
    },
  );

  const isLoading = useMemo(
    () => isLoadingAssociado || isFetchingAssociado,
    [isLoadingAssociado, isFetchingAssociado],
  );

  useEffect(() => {
    console.log({ isError, error });
    if (!isLoading && isError && error) {
      const error_details = error.data?.error;
      if (error_details) toast.warning(error_details[0]);
      else toast.warning("Verifique os filtros aplicados!");
    }
  }, [isLoading, isError, error]);

  function goToShowAssociado(associado) {
    const path = generatePath(`/dashboard/aproveck-associado/:id/detalhes`, {
      id: associado.cpf,
    });
    history.push(path);
  }

  const columns = [
    ...associadoColumns,
    {
      headerText: "-",
      key: "associado_acoes_column",
      FullObject: (associado) => (
        <Box display="flex" flexDirection="column">
          <Button
            variant="outlined"
            onClick={() => goToShowAssociado(associado)}
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
          Buscar Associado
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              size="small"
              placeholder="Pesquisar por documento..."
              type="number"
              label="CPF/CNPJ"
              value={filters.documento}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  documento: e.target.value,
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
            {associado && !isError ? (
              <Box style={{ marginTop: "30px" }}>
                <CustomTable columns={columns} data={[associado]} />
              </Box>
            ) : (
              <Typography>Associado não encontrado</Typography>
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
          <Box display="flex">
            <Button
              variant="outlined"
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

export default FindAproveckAssociadoDialog;
