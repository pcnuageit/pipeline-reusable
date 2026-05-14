import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../constants/config";
import { useGetAproveckAssociadoQuery } from "../../../services/api";
import IndexStatusColumn from "../Veiculos/IndexStatusColumn";
import EditarAproveckAssociadoDialog from "./EditarAproveckAssociadoDialog";
import associadoColumns from "./IndexColumns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const ShowAproveckAssociado = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { id: documento } = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const {
    data: associado,
    isLoading: isLoadingAssociado,
    isError,
    isUninitialized,
    refetch,
  } = useGetAproveckAssociadoQuery(
    {
      documento,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !documento,
    },
  );

  useEffect(() => {
    if (isError && !isUninitialized && !isLoadingAssociado) {
      toast.error("Erro ao buscar dados do associado!");
      history.goBack();
    }
  }, [history, isLoadingAssociado, isError, isUninitialized]);

  const veiculosAssociadoColumns = [
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
      headerText: "Modelo",
      key: "descricao_modelo",
      CustomValue: (modelo) => <Typography>{modelo}</Typography>,
    },
    {
      headerText: "Situação",
      key: "codigo_situacao",
      CustomValue: (situacao) => {
        return <IndexStatusColumn status={situacao} />;
      },
    },
  ];

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={isLoading || isLoadingAssociado} />

      {openEditDialog && (
        <EditarAproveckAssociadoDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          setIsloading={setIsloading}
          onSucess={() => {
            setOpenEditDialog(false);
            refetch();
          }}
          associado={associado}
        />
      )}

      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Aprovec Associado" />
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
          <Typography variant="h4"> Detalhes do Associado </Typography>

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
                  <Box>
                    <Typography variant="h5">Veículos</Typography>
                    <CustomTable
                      data={associado.veiculos}
                      columns={veiculosAssociadoColumns}
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
                    Associado
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" marginTop="6px" flexDirection="column">
                <Box
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
                </Box>

                <Divider style={{ marginTop: 16, marginBottom: 8 }} />

                <Box>
                  <Typography variant="h6" align="center">
                    Associado - {associado?.codigo_associado}
                  </Typography>
                  <Box>
                    <Typography>Nome:</Typography>
                    <Typography variant="h6">
                      {associado?.nome ?? "-"}
                    </Typography>
                    <Typography>Documento:</Typography>
                    <Typography variant="h6">
                      {associado?.cpf ?? "-"}
                    </Typography>
                    <Typography>E-mail:</Typography>
                    <Typography variant="h6">
                      {associado?.email ?? "-"}
                    </Typography>
                    <Typography>Contato:</Typography>
                    <Typography variant="h6">
                      Fixo: {associado?.telefone_fixo ?? "-"}
                    </Typography>
                    <Typography variant="h6">
                      Celular: {associado?.celular ?? "-"}
                    </Typography>
                    <Typography variant="h6">
                      Comercial: {associado?.telefone_comercial ?? "-"}
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

export default ShowAproveckAssociado;
