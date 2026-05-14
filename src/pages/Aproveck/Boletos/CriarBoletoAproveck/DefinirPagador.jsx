import {
  Box,
  Button,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../../../constants/config";
import useDebounce from "../../../../hooks/useDebounce";
import { useGetAproveckAssociadoQuery } from "../../../../services/api";
import associadoColumns from "../../Associados/IndexColumns";

function DefinirPagador({ boleto = {}, setBoleto = () => {} }) {
  const [veiculoSelecionado, setVeiculoSelecionado] = useState({});
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

  const DefinirPagador = (veiculo) => {
    setVeiculoSelecionado(veiculo);
    setBoleto({
      ...boleto,
      pagador: {
        documento: associado.cpf,
        nome: associado.nome,
        celular: associado.telefone_celular,
        data_nascimento: associado.data_nascimento,
        email: associado.email,
        endereco: {
          cep: associado.cep,
          rua: associado.logradouro,
          numero: associado.numero,
          complemento: associado.complemento,
          bairro: associado.bairro,
          cidade: associado.cidade,
          estado: associado.estado,
        },
      },
      sga: {
        codigo_modulo: veiculo.codigo_veiculo.toString(),
        codigo_associado: associado.codigo_associado.toString(),
        descricao: "",
        codigo_tipo_boleto: "",
      },
    });
  };

  const veiculoColumns = [
    {
      headerText: "-",
      key: "codigo_veiculo",
      CustomValue: (codigo_veiculo) => (
        <Typography>{codigo_veiculo}</Typography>
      ),
    },
    {
      headerText: "Placa",
      key: "placa",
      CustomValue: (placa) => <Typography>{placa}</Typography>,
    },
    {
      headerText: "Descrição",
      key: "descricao_modelo",
      CustomValue: (descricao_modelo) => (
        <Typography>{descricao_modelo}</Typography>
      ),
    },
    {
      headerText: "Selecionar",
      key: "detalhes_veiculos",
      FullObject: (veiculo) => (
        <Box display="flex" flexDirection="column">
          <Button
            variant="outlined"
            onClick={() => DefinirPagador(veiculo)}
            style={{
              width: "100%",
              backgroundColor:
                !veiculoSelecionado.codigo_veiculo ||
                veiculo.codigo_veiculo === veiculoSelecionado.codigo_veiculo
                  ? APP_CONFIG.mainCollors.primary
                  : "gray",
              color: "white",
              borderRadius: "37px",
              fontWeight: "bold",
              fontSize: "11px",
              height: "38px",
              boxShadow: "0px 0px 5px 0.7px grey",
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            {veiculo.codigo_veiculo === veiculoSelecionado.codigo_veiculo
              ? "Selecionado"
              : "Selecionar"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box width="100%">
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
      {isLoading ? (
        <Box width="100%" style={{ marginTop: "30px" }}>
          <LinearProgress color="secondary" />
        </Box>
      ) : (
        <Box style={{ marginTop: "30px" }}>
          {associado && associado?.veiculos && !isError ? (
            <Box>
              <CustomTable columns={associadoColumns} data={[associado]} />
              <CustomTable columns={veiculoColumns} data={associado.veiculos} />
            </Box>
          ) : (
            <Typography>Associado não encontrado</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default DefinirPagador;
