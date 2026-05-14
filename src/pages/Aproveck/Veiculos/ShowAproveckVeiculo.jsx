import {
  Box,
  Divider,
  LinearProgress,
  Paper,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../constants/config";
import {
  useGetAproveckAssociadoQuery,
  useGetAproveckVeiculoQuery,
} from "../../../services/api";
import associadoColumns from "../Associados/IndexColumns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const ShowAproveckVeiculo = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { id: placa } = useParams();

  const {
    data: { veiculo },
    isLoading: isLoadingVeiculo,
    isUninitialized,
    isError,
  } = useGetAproveckVeiculoQuery(
    {
      placa,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !placa,
    },
  );

  const { data: associado, isLoading: isLoadingAssociado } =
    useGetAproveckAssociadoQuery(
      {
        documento: veiculo?.cpf,
      },
      {
        refetchOnMountOrArgChange: true,
        skip: !veiculo?.cpf,
      },
    );

  const isLoading = useMemo(
    () => isLoadingVeiculo || isLoadingAssociado,
    [isLoadingVeiculo, isLoadingAssociado],
  );

  useEffect(() => {
    if (isError && !isUninitialized && !isLoadingVeiculo) {
      toast.error("Erro ao buscar dados do veiculo!");
      history.goBack();
    }
  }, [history, isError, isUninitialized, isLoadingVeiculo]);

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={isLoading} />

      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Aprovec Veículo" />
      </Box>
      <Box display="flex" flexDirection="column">
        <Paper
          style={{
            padding: "24px",
            margin: "12px 0",
            borderRadius: "27px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4"> Detalhes do Veículo </Typography>

          <Box
            display="flex"
            marginTop="12px"
            style={matches ? { flexDirection: "column" } : null}
          >
            <Box
              marginRight={matches ? "0px" : "20px"}
              marginBottom={matches ? "20px" : "0px"}
              display="flex"
              flexDirection="column"
              width="100%"
            >
              {associado && !isLoadingAssociado ? (
                <>
                  <Box marginBottom="20px">
                    <CustomTable
                      data={[associado]}
                      columns={associadoColumns}
                    />
                  </Box>
                </>
              ) : (
                <LinearProgress />
              )}
            </Box>

            <Box display="flex" flexDirection="column" width="100%">
              <Box
                style={{
                  padding: "12px",
                  borderRadius: "15px 15px 0 0 ",
                  backgroundColor: APP_CONFIG.mainCollors.primary,
                  color: "white",
                }}
              >
                <Box>
                  <Typography variant="h6" align="center">
                    Veículo
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" marginTop="6px" flexDirection="column">
                {/* <Box
                  display="flex"
                  flexDirection="column"
                  width="100%"
                  alignItems="center"
                >
                  <Typography variant="h6">Opções</Typography>
                  <Box
                    marginTop="8px"
                    display="flex"
                    flexDirection="column"
                    width="100%"
                  >
                    <Button
                      color="purple"
                      variant="outlined"
                      onClick={() => setOpenEditDialog(true)}
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
                      Editar
                    </Button>
                  </Box>
                </Box> */}

                <Divider style={{ marginTop: 16, marginBottom: 8 }} />

                <Box>
                  <Typography variant="h6" align="center">
                    Veículo - {veiculo?.placa}
                  </Typography>
                  <Box>
                    <Typography>Código:</Typography>
                    <Typography variant="h6">
                      {veiculo?.codigo_veiculo ?? "-"}
                    </Typography>
                    <Typography>Chassi:</Typography>
                    <Typography variant="h6">
                      {veiculo?.chassi ?? "-"}
                    </Typography>
                    <Typography>Ano modelo:</Typography>
                    <Typography variant="h6">
                      {veiculo?.ano_modelo ?? "-"}
                    </Typography>
                    <Typography>Modelo:</Typography>
                    <Typography variant="h6">
                      Fixo: {veiculo?.modelo ?? "-"}
                    </Typography>
                    <Typography>data_cadastro:</Typography>
                    <Typography variant="h6">
                      Fixo:{" "}
                      {veiculo?.data_cadastro
                        ? dayjs(veiculo.data_cadastro).format("DD/MM/YYYY")
                        : "-"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ShowAproveckVeiculo;
