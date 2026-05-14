import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import CustomCopyToClipboard from "../../../components/Text/CustomCopyToClipboard";
import { APP_CONFIG } from "../../../constants/config";
import {
  useGetAproveckAssociadoQuery,
  useGetAproveckBoletoQuery,
  useSendAproveckBoletoByEmailMutation,
} from "../../../services/api";
import IndexStatusColumn from "../Veiculos/IndexStatusColumn";
import BaixaAproveckBoletoDialog from "./BaixaAproveckBoletoDialog";
import CancelarAproveckBoletoDialog from "./CancelarAproveckBoletoDialog";
import EditarAproveckBoletoDialog from "./EditarAproveckBoletoDialog";
import columns from "./IndexColumns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const ShowAproveckBoleto = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { id: nosso_numero } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openBaixaDialog, setOpenBaixaDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [sendBoletoByEmail] = useSendAproveckBoletoByEmailMutation();

  const {
    data,
    isLoading: isLoadingBoleto,
    isError,
    isUninitialized,
    refetch,
  } = useGetAproveckBoletoQuery(
    {
      nosso_numero,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !nosso_numero,
    },
  );

  const { hinova: boletoHinova, boleto: boletoBanking } = useMemo(
    () => (data ? data : {}),
    [data],
  );

  const { data: associado } = useGetAproveckAssociadoQuery(
    {
      documento: boletoHinova?.codigo_associado,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !boletoHinova?.codigo_associado,
    },
  );

  const handleSendByEmail = async () => {
    if (!boletoBanking?.id) {
      toast.error("Não é possível enviar este boleto por email!");
      return false;
    }

    setIsLoading(true);
    try {
      await sendBoletoByEmail({ boleto_id: data.boleto.id }).unwrap();

      toast.success("Boleto enviado com sucesso");
    } catch (e) {
      toast.error("Erro ao enviar");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isError && !isUninitialized && !isLoadingBoleto) {
      toast.error("Erro ao buscar dados do boleto!");
      history.goBack();
    }
  }, [history, isLoadingBoleto, isError, isUninitialized]);

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
      headerText: "Modelo",
      key: "descricao_modelo",
      CustomValue: (modelo) => <Typography>{modelo}</Typography>,
    },
    {
      headerText: "Situação",
      key: "codigo_situacao_veiculo",
      CustomValue: (situacao) => {
        return <IndexStatusColumn status={situacao} />;
      },
    },
  ];

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={isLoading || isLoadingBoleto} />

      {openCancelDialog && (
        <CancelarAproveckBoletoDialog
          open={openCancelDialog}
          setOpen={setOpenCancelDialog}
          setLoading={setIsLoading}
          onCancel={() => {
            setOpenCancelDialog(false);
            refetch();
          }}
          boleto={boletoHinova}
        />
      )}

      {openBaixaDialog && (
        <BaixaAproveckBoletoDialog
          open={openBaixaDialog}
          setOpen={setOpenBaixaDialog}
          setLoading={setIsLoading}
          onSucess={() => {
            setOpenBaixaDialog(false);
            refetch();
          }}
          boleto={boletoHinova}
        />
      )}

      {openEditDialog && (
        <EditarAproveckBoletoDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          setLoading={setIsLoading}
          onSucess={() => {
            setOpenEditDialog(false);
            refetch();
          }}
          boleto={data}
        />
      )}

      <Box style={{ padding: "10px" }}>
        <CustomHeader pageTitle="Aprovec Boleto" />
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
          <Typography variant="h4"> Detalhes do Boleto </Typography>

          <Box
            display="flex"
            marginTop="12px"
            style={matches ? { flexDirection: "column" } : null}
          >
            <Box
              marginRight={matches ? "0px" : "20px"}
              marginBottom="20px"
              display="flex"
              flexDirection="column"
              width="100%"
            >
              {boletoHinova && !isLoadingBoleto ? (
                <>
                  <Box marginBottom="20px">
                    <CustomTable data={[boletoHinova]} columns={columns} />
                  </Box>
                  <Box marginBottom="20px">
                    <Typography variant="h5">Veículo</Typography>
                    <CustomTable
                      data={boletoHinova.veiculos}
                      columns={veiculoColumns}
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
                  backgroundColor: "#dfad06",
                  color: "white",
                }}
              >
                <Box>
                  <Typography variant="h6" align="center">
                    Boleto
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" marginTop="6px" flexDirection="column">
                <Box display="flex" flexDirection="column">
                  <Box>
                    <Typography variant="h6">Informações do Boleto</Typography>
                  </Box>
                  <Box>
                    <Box display="flex" alignItems="center" marginRight="10px">
                      <FontAwesomeIcon
                        style={{ marginRight: "10px" }}
                        icon={faBarcode}
                        size="2x"
                      />
                      <Typography>Código:</Typography>
                    </Box>
                    <CustomCopyToClipboard
                      title={"Copiar código do boleto"}
                      value={boletoHinova?.linha_digitavel}
                    />
                  </Box>
                  <Box>
                    <Typography>N° Documento:</Typography>
                    <CustomCopyToClipboard
                      title={"Copiar número do documento"}
                      value={boletoHinova?.nosso_numero}
                    />
                  </Box>
                  <Box>
                    <Typography>Emissão:</Typography>
                    <Typography variant="h6">
                      {boletoHinova?.data_emissao
                        ? dayjs(boletoHinova?.data_emissao).format("DD/MM/YYYY")
                        : "-"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography>Vencimento:</Typography>
                    <Typography variant="h6">
                      {boletoHinova?.data_vencimento
                        ? dayjs(boletoHinova?.data_vencimento).format(
                            "DD/MM/YYYY",
                          )
                        : "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography>Pagamento:</Typography>
                    <Typography variant="h6">
                      {boletoHinova?.data_pagamento
                        ? dayjs(boletoHinova?.data_pagamento).format(
                            "DD/MM/YYYY",
                          )
                        : "sem pagamento"}
                    </Typography>
                  </Box>
                </Box>

                <Divider style={{ marginTop: 16, marginBottom: 8 }} />

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
                      onClick={() =>
                        window.open(boletoHinova.link_boleto, "_blank").focus()
                      }
                      style={{
                        marginBottom: "5px",
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
                      2° Via
                    </Button>
                    <Button
                      color="purple"
                      variant="outlined"
                      onClick={handleSendByEmail}
                      style={{
                        marginBottom: "5px",
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
                      Enviar por E-mail
                    </Button>
                    <Button
                      color="purple"
                      variant="outlined"
                      onClick={() => setOpenCancelDialog(true)}
                      style={{
                        marginBottom: "5px",
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
                      Cancelar
                    </Button>
                    <Button
                      color="purple"
                      variant="outlined"
                      onClick={() => setOpenBaixaDialog(true)}
                      style={{
                        marginBottom: "5px",
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
                      Baixa
                    </Button>
                    <Button
                      color="purple"
                      variant="outlined"
                      onClick={() => setOpenEditDialog(true)}
                      style={{
                        marginBottom: "5px",
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
                    Associado - {boletoHinova?.codigo_associado}
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

export default ShowAproveckBoleto;
