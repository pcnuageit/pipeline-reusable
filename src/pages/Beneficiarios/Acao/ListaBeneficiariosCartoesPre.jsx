import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/styles";
import ArticleIcon from "@mui/icons-material/Article";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import { Pagination } from "@mui/material";
import { DropzoneAreaBase } from "material-ui-dropzone";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { loadUserData, setHeaderLike } from "../../../actions/actions";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";
import {
  deleteBeneficiario,
  getCartoesPre,
  getTransacoesPre,
  postAddBeneficiario,
  postAddLoteBeneficiarios,
  putUpdateBeneficiario,
} from "../../../services/beneficiarios";
import { getCep } from "../../../services/services";
import { errorMessageHelper } from "../../../utils/errorMessageHelper";

import CustomCollapseTable from "../../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../constants/config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dadosBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: "24px",
    marginLeft: "0px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    boxShadow: "none",
    borderRadius: "0px",
    alignSelf: "center",
  },
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",

    top: "10%",
    left: "35%",
    width: "30%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },

  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
  dropzoneAreaBaseClasses: {
    width: "70%",
    height: "250px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
  },
  dropzoneContainer: {
    margin: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px",
    minHeight: "422px",
    fontSize: "12px",
  },
  textoDropzone: {
    fontSize: "1.2rem",
    color: APP_CONFIG.mainCollors.primary,
  },
}));

const columns = [
  { headerText: "NOME", key: "response_card.name" },
  { headerText: "NUM. CARTAO", key: "response_card.mask" },
  { headerText: "TIPO", key: "response_card.type" },
  { headerText: "STATUS", key: "response_card.appBlock" },
  // {
  //   headerText: "SALDO",
  //   key: "concorrencia_saldo.valor",
  //   CustomValue: (valor) => {
  //     return (
  //       <>
  //         <Typography
  //           style={{
  //             fontFamily: "Montserrat-Regular",
  //             fontSize: "15px",
  //             color: APP_CONFIG.mainCollors.primary,
  //           }}
  //         >
  //           R${" "}
  //           {parseFloat(valor).toLocaleString("pt-br", {
  //             minimumFractionDigits: 2,
  //             maximumFractionDigits: 2,
  //           })}
  //         </Typography>
  //       </>
  //     );
  //   },
  // },
  { headerText: "", key: "menu" },
];

const CadastrarLoteModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
}) => {
  const token = useAuth();
  const classes = useStyles();
  const [loteArquivo, setLoteArquivo] = useState("");
  const [loading, setLoading] = useState(false);
  var cardImage = loteArquivo[0];

  const handleClose = () => {
    setShow(false);
    setLoteArquivo("");
  };

  const handleCriarLote = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postAddLoteBeneficiarios(token, loteArquivo[0].file);
      getData();
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    } finally {
      setLoading(false);
    }
  };

  const onDropArquivo = async (arquivo) => {
    setLoteArquivo(
      arquivo.map((item, index) => {
        return item;
      }),
    );
  };

  const handleExcluirArquivo = async (item) => {
    setLoteArquivo("");
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">
        Cadastrar em lote por arquivo
      </DialogTitle>
      <form onSubmit={handleCriarLote}>
        <DialogContent>
          <DialogContentText>
            Siga as instruções e use o arquivo modelo:
          </DialogContentText>
          <Link
            target="_blank"
            download
            to="/arquivos/Instruções - Cadastro com arquivo csv.xlsx"
          >
            <Button>
              <DownloadIcon />
              Instruções
            </Button>
          </Link>
          <Link
            target="_blank"
            download
            to="/arquivos/Arquivo Modelo - Cadastro de Beneficiario.xlsx"
          >
            <Button>
              <DownloadIcon />
              Arquivo modelo
            </Button>
          </Link>
          <DialogContentText>Insira o arquivo abaixo:</DialogContentText>
          <Box className={classes.dropzoneContainer}>
            <DropzoneAreaBase
              dropzoneParagraphClass={classes.textoDropzone}
              maxFileSize={3145728}
              onDropRejected={() => {
                toast.error("Tamanho máximo: 3mb");
                toast.error("Arquivos suportados: .csv, .txt, .xls, .xlsx");
              }}
              acceptedFiles={[
                "text/csv",
                "text/plain",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ]}
              dropzoneClass={classes.dropzoneAreaBaseClasses}
              onAdd={onDropArquivo}
              filesLimit={1}
              dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
              showPreviews={false}
              showPreviewsInDropzone={false}
            />
            <Box width="300px" style={{ marginTop: "10px" }}>
              <Grid container>
                {loteArquivo ? (
                  <Grid item xs={6}>
                    <Card className={classes.card}>
                      <CardActionArea>
                        <Box position="absolute">
                          <IconButton
                            onClick={() => handleExcluirArquivo(loteArquivo)}
                            size="small"
                            style={{
                              color: "white",
                              backgroundColor: "red",
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100px",
                          }}
                          onClick={() => window.open(cardImage.data)}
                        >
                          <ArticleIcon
                            style={{
                              color: "black",
                              fontSize: "40px",
                            }}
                          />
                          <Typography style={{ fontSize: 12 }}>
                            {cardImage.file.name}
                          </Typography>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Enviar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const BeneficiarioModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
  update = false,
}) => {
  const token = useAuth();
  const [conta, setConta] = useState({
    beneficiario: {
      nome: data?.nome,
      email: data?.email,
      documento: data?.documento,
      celular: data?.celular,
    },
    endereco: {
      cep: data?.concorrencia_endereco?.cep,
      rua: data?.concorrencia_endereco?.rua,
      numero: data?.concorrencia_endereco?.numero,
      complemento: data?.concorrencia_endereco?.complemento,
      bairro: data?.concorrencia_endereco?.bairro,
      cidade: data?.concorrencia_endereco?.cidade,
      estado: data?.concorrencia_endereco?.estado,
    },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
    if (!update) {
      setConta({ beneficiario: {}, endereco: {} });
    }
  };

  const handleCep = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({
      ...prev,
      "endereco.cep": null,
    }));

    try {
      const response = await getCep(e.target.value);
      setConta((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          rua: response.data.logradouro,
          complemento: response.data.complemento,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          estado: response.data.uf,
        },
      }));
    } catch (err) {
      console.log(err);
      setErrors((prev) => ({
        ...prev,
        "endereco.cep": ["Erro ao buscar dados do CEP"],
      }));
    }
  };

  const handleCriarBeneficiario = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      if (update) {
        await putUpdateBeneficiario(token, data?.id, conta);
      } else {
        await postAddBeneficiario(token, conta);
      }
      getData();
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Verifique os dados e tente novamente.");
      setErrors(err?.response?.data?.errors ?? {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">
        {update ? "Editar" : "Cadastrar"} beneficiário
      </DialogTitle>
      <form onSubmit={handleCriarBeneficiario}>
        <DialogContent style={{ overflow: "hidden" }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                label={"Nome completo"}
                value={conta?.beneficiario?.nome}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      nome: e.target.value,
                    },
                  }))
                }
                error={errors["beneficiario.nome"]}
                helperText={
                  errors["beneficiario.nome"]
                    ? errors["beneficiario.nome"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Email"}
                value={conta?.beneficiario?.email}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      email: e.target.value,
                    },
                  }))
                }
                error={errors["beneficiario.email"]}
                helperText={
                  errors["beneficiario.email"]
                    ? errors["beneficiario.email"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <ReactInputMask
                mask={"999.999.999-99"}
                value={conta?.beneficiario?.documento}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      documento: e.target.value,
                    },
                  }))
                }
              >
                {() => (
                  <TextField
                    label={"Documento"}
                    error={errors["beneficiario.documento"]}
                    helperText={
                      errors["beneficiario.documento"]
                        ? errors["beneficiario.documento"]?.join(" ")
                        : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                )}
              </ReactInputMask>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Celular"}
                value={conta?.beneficiario?.celular}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      celular: e.target.value,
                    },
                  }))
                }
                error={errors["beneficiario.celular"]}
                helperText={
                  errors["beneficiario.celular"]
                    ? errors["beneficiario.celular"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={4}>
              <ReactInputMask
                mask={"99999-999"}
                value={conta?.endereco?.cep}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      cep: e.target.value,
                    },
                  }))
                }
                onBlur={(e) => handleCep(e)}
              >
                {() => (
                  <TextField
                    label={"CEP"}
                    error={errors["endereco.cep"]}
                    helperText={
                      errors["endereco.cep"]
                        ? errors["endereco.cep"]?.join(" ")
                        : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                )}
              </ReactInputMask>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Rua"}
                value={conta?.endereco?.rua}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      rua: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.rua"]}
                helperText={
                  errors["endereco.rua"]
                    ? errors["endereco.rua"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                disabled={true}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={"Número"}
                value={conta?.endereco?.numero}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      numero: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.numero"]}
                helperText={
                  errors["endereco.numero"]
                    ? errors["endereco.numero"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Complemento"}
                value={conta?.endereco?.complemento}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      complemento: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.complemento"]}
                helperText={
                  errors["endereco.complemento"]
                    ? errors["endereco.complemento"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Bairro"}
                value={conta?.endereco?.bairro}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      bairro: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.bairro"]}
                helperText={
                  errors["endereco.bairro"]
                    ? errors["endereco.bairro"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                disabled={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Cidade"}
                value={conta?.endereco?.cidade}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      cidade: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.cidade"]}
                helperText={
                  errors["endereco.cidade"]
                    ? errors["endereco.cidade"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                disabled={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Estado"}
                value={conta?.endereco?.estado}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      estado: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.estado"]}
                helperText={
                  errors["endereco.estado"]
                    ? errors["endereco.estado"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                disabled={true}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Enviar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ExtratoBeneficiarioModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
  update = false,
}) => {
  const token = useAuth();

  const [conta, setConta] = useState({
    beneficiario: {
      id: data?.identificador_cartao,
    },
  });
  const [dataBeneficiario, setDataBeneficiario] = useState("");
  const [page, setPage] = useState(1);
  const headerLike = useSelector((state) => state.headerLike);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
    if (!update) {
      setConta({ beneficiario: {} });
    }
  };

  const handleLoadExtrato = async (page = 1, headerLike = "") => {
    setLoading(true);
    try {
      const res = await getTransacoesPre(
        token,
        conta.beneficiario.id,
        page,
        headerLike,
      );
      console.log(res.data);
      setDataBeneficiario(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (e, value) => {
    setPage(value);
  };

  useEffect(() => {
    handleLoadExtrato(page, headerLike);
  }, [token, page, headerLike]);

  const columns = [
    {
      headerText: "Data da Transação",
      key: "date",
      CustomValue: (data) => {
        const p = data.split(/\D/g);
        const dataFormatada = [p[2], p[1], p[0]].join("/");
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <FontAwesomeIcon icon={faCalendarAlt} size="lg" /> */}
            <Typography style={{ marginLeft: "6px" }}>
              {moment.utc(data).format("DD MMMM")}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Beneficiário",
      key: "store",
      CustomValue: (nome) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography style={{ marginLeft: "6px" }}>{nome}</Typography>
          </Box>
        );
      },
    },

    // {
    // 	headerText: 'Valor Bloqueado',
    // 	key: 'valor_bloqueado',
    // 	CustomValue: (value) => (
    // 		<Box
    // 			style={{
    // 				display: 'flex',
    // 				flexDirection: 'row',
    // 				alignItems: 'center',
    // 				justifyContent: 'center',
    // 			}}
    // 		>
    // 			<FontAwesomeIcon icon={faBan} size="lg" />
    // 			<Typography style={{ marginLeft: '6px', color: 'red' }}>
    // 				R${' '}
    // 				{parseFloat(value).toLocaleString('pt-br', {
    // 					minimumFractionDigits: 2,
    // 					maximumFractionDigits: 2,
    // 				})}
    // 			</Typography>
    // 		</Box>
    // 	),
    // },

    {
      headerText: "Valor",
      key: "price",
      CustomValue: (valor) => (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon icon={faWallet} style={{ fontSize: "17px" }} />
          <Typography style={{ marginLeft: "6px" }}>
            R${" "}
            {parseFloat(valor / 100).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
      ),
    },
  ];

  const itemColumns = [
    {
      headerText: "Data e hora",
      key: "date",
      CustomValue: (date) => {
        return (
          <Typography variant="" style={{ fontSize: 16 }}>
            {date}
          </Typography>
        );
      },
    },
    {
      headerText: <Typography variant="h6">Código da Transação</Typography>,
      key: "transactionCode",
      CustomValue: (idTransacao) => {
        return (
          <Typography variant="" style={{ fontSize: 16 }}>
            {idTransacao ? idTransacao : null}
          </Typography>
        );
      },
    },
    // {
    // 	headerText: <Typography variant="h6">Data e hora</Typography>,
    // 	key: 'dtTransacao',
    // 	CustomValue: (dtTransacao) => {
    // 		return (
    // 			<Typography variant="" style={{ fontSize: 16 }}>
    // 				{dtTransacao ? dtTransacao : null}
    // 			</Typography>
    // 		);
    // 	},
    // },
    {
      headerText: <Typography variant="h6">NSU</Typography>,
      key: "nsu",
      CustomValue: (nsu) => {
        return (
          <Typography variant="" style={{ fontSize: 16 }}>
            {nsu}
          </Typography>
        );
      },
    },
    // {
    // 	headerText: <Typography variant="h6">Taxas</Typography>,
    // 	key: 'fee',
    // 	CustomValue: (fee) => {
    // 		if (fee > 0) {
    // 			return (
    // 				<Box style={{ display: 'flex' }}>
    // 					<Typography
    // 						variant=""
    // 						style={{
    // 							fontSize: 17,
    // 							fontWeight: 600,
    // 							color: 'red',
    // 							marginLeft: '6px',
    // 						}}
    // 					>
    // 						R$ 0,00{fee}
    // 					</Typography>
    // 				</Box>
    // 			);
    // 		} else {
    // 			return (
    // 				<Box style={{ display: 'flex' }}>
    // 					<Typography
    // 						variant=""
    // 						style={{
    // 							fontSize: 17,
    // 							fontWeight: 600,
    // 							color: 'green',
    // 							marginLeft: '6px',
    // 						}}
    // 					>
    // 						R$ 0,00 {fee}
    // 					</Typography>
    // 				</Box>
    // 			);
    // 		}
    // 	},
    // },
    {
      headerText: <Typography variant="h6">Valor Transação</Typography>,
      key: "price",
      CustomValue: (vlTransacao) => {
        if (vlTransacao < 0) {
          return (
            <Box style={{ display: "flex" }}>
              <Typography
                variant=""
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "red",
                  marginLeft: "6px",
                }}
              >
                R${" "}
                {parseFloat(
                  vlTransacao == null ? 0 : vlTransacao / 100,
                ).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          );
        } else {
          return (
            <Box style={{ display: "flex" }}>
              <Typography
                variant=""
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "green",
                  marginLeft: "6px",
                }}
              >
                R${" "}
                {parseFloat(
                  vlTransacao == null ? 0 : vlTransacao / 100,
                ).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          );
        }
      },
    },
    // {
    // 	headerText: <Typography variant="h6">Valor Saldo</Typography>,
    // 	key: 'vlSaldo',
    // 	CustomValue: (vlSaldo) => {
    // 		if (vlSaldo < 0) {
    // 			return (
    // 				<Box style={{ display: 'flex' }}>
    // 					<Typography
    // 						variant=""
    // 						style={{
    // 							fontSize: 17,
    // 							fontWeight: 600,
    // 							color: 'red',
    // 							marginLeft: '6px',
    // 						}}
    // 					>
    // 						R${' '}
    // 						{parseFloat(vlSaldo == null ? 0 : vlSaldo).toLocaleString('pt-br', {
    // 							minimumFractionDigits: 2,
    // 							maximumFractionDigits: 2,
    // 						})}
    // 					</Typography>
    // 				</Box>
    // 			);
    // 		} else {
    // 			return (
    // 				<Box style={{ display: 'flex' }}>
    // 					<Typography
    // 						variant=""
    // 						style={{
    // 							fontSize: 17,
    // 							fontWeight: 600,
    // 							color: 'green',
    // 							marginLeft: '6px',
    // 						}}
    // 					>
    // 						R${' '}
    // 						{parseFloat(vlSaldo == null ? 0 : vlSaldo).toLocaleString('pt-br', {
    // 							minimumFractionDigits: 2,
    // 							maximumFractionDigits: 2,
    // 						})}
    // 					</Typography>
    // 				</Box>
    // 			);
    // 		}
    // 	},
    // },

    {
      headerText: "",
      key: "menuCollapse",
    },
  ];

  const EditarCollapse = (row) => {
    // const comprovanteExtrato = async () => {
    // 	if (
    // 		row.row.externalId &&
    // 		(row.row.description === 'Internal in out' ||
    // 			row.row.description === 'Payment boleto' ||
    // 			row.row.description === 'Refund out Pix' ||
    // 			row.row.description === 'Cashin Pix' ||
    // 			row.row.description === 'Cashout Pix')
    // 	) {
    // 		if (row.row.description === 'Internal in out') {
    // 			await dispatch(getTransferenciaExtratoActionClear());
    // 			const resTransferenciaExtrato = await dispatch(
    // 				getTransferenciaExtratoAction(token, row.row.externalId)
    // 			);
    // 			if (resTransferenciaExtrato) {
    // 				setSemComprovante(true);
    // 			} else {
    // 				setExtratoModal(true);
    // 			}
    // 		}
    // 		/* if (row.row.description === 3 || row.row.description === 4) {
    // 			await dispatch(getTedExtratoActionClear());
    // 			const resTedExtrato = await dispatch(
    // 				getTedExtratoAction(token, row.row.externalId)
    // 			);
    // 			if (resTedExtrato) {
    // 				setSemComprovante(true);
    // 			} else {
    // 				setExtratoModal(true);
    // 			}
    // 		} */
    // 		if (row.row.description === 'Payment boleto') {
    // 			await dispatch(getPagamentoContaExtratoActionClear());
    // 			const resPagamentoContaExtrato = await dispatch(
    // 				getPagamentoContaExtratoAction(token, row.row.externalId)
    // 			);
    // 			if (resPagamentoContaExtrato) {
    // 				setSemComprovante(true);
    // 			} else {
    // 				setExtratoModal(true);
    // 			}
    // 		}
    // 		if (
    // 			row.row.description === 'Cashin Pix' ||
    // 			row.row.description === 'Cashout Pix' ||
    // 			row.row.description === 'Refund out Pix'
    // 		) {
    // 			await dispatch(getPagamentoPixExtratoActionClear());
    // 			const resPagamentoPixExtrato = await dispatch(
    // 				getPagamentoPixExtratoAction(token, row.row.externalId)
    // 			);
    // 			if (resPagamentoPixExtrato) {
    // 				setSemComprovante(true);
    // 			} else {
    // 				setExtratoModal(true);
    // 			}
    // 		}
    // 	} else {
    // 		toast.error('Falha ao carregar extrato');
    // 		setSemComprovante(true);
    // 	}
    // };
    return (
      <>
        {row.row.externalId && row.row.description && (
          <Button
            // onClick={() => {
            // 	comprovanteExtrato();
            // 	setOperationType(row.row.description);
            // }}
            variant="outlined"
            color="primary"
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: "10px",
              color: APP_CONFIG.mainCollors.primary,
              borderRadius: 20,
            }}
          >
            Visualizar
          </Button>
        )}
      </>
    );
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"lg"}
      minWidth={"lg"}
      width={"lg"}
      scroll={"paper"}
    >
      <LoadingScreen isLoading={loading} />

      <DialogContent style={{ paddingBottom: 40, minWidth: "60%" }}>
        <Grid container spacing={4}>
          <Box>
            <Box
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  /* alignItems: 'center', */
                  borderRadius: "17px",
                  flexDirection: "column",
                  width: "100%",

                  /* alignItems: 'center', */
                }}
              >
                <Box
                  style={{
                    width: "100%",
                    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                    borderTopLeftRadius: 27,
                    borderTopRightRadius: 27,
                  }}
                ></Box>

                {dataBeneficiario ? (
                  <>
                    <Box /* minWidth={!matches ? '500px' : null} */>
                      <CustomCollapseTable
                        itemColumns={itemColumns}
                        data={dataBeneficiario.movements}
                        columns={columns}
                        EditarCollapse={EditarCollapse}
                        /* handleClickRow={handleClickRow} */
                      />
                    </Box>
                    <Box alignSelf="start" marginTop="8px">
                      {
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={dataBeneficiario.last_page}
                          onChange={handleChangePage}
                          page={page}
                        />
                      }
                    </Box>
                  </>
                ) : (
                  <LinearProgress />
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeletarBeneficiarioModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
}) => {
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleDeletarBeneficiario = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteBeneficiario(token, data?.id);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel deletar o beneficiário. Tente novamente.",
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">Excluir beneficiário</DialogTitle>
      <form onSubmit={handleDeletarBeneficiario}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de excluir o beneficiário:
          </DialogContentText>
          <DialogContentText>
            {data?.nome}
            <br />
            {data?.documento}
            <br />
            {data?.email}
          </DialogContentText>
          <DialogContentText>Essa ação é irreversível.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Excluir
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const MenuTable = ({ getData, row, hasPermission }) => {
  const [showEditarBeneficiarioModal, setShowEditarBeneficiarioModal] =
    useState(false);
  const [showDeletarBeneficiarioModal, setShowDeletarBeneficiarioModal] =
    useState(false);
  const [showTransacoesModal, setShowTrasacoesModal] = useState(false);

  return (
    <Box>
      <Box style={{ display: "flex" }}>
        {hasPermission && (
          <Box onClick={() => setShowEditarBeneficiarioModal(true)}>
            <EditIcon
              style={{
                fontSize: "25px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            />
          </Box>
        )}

        {hasPermission && (
          <Box
            style={{ marginLeft: "20px" }}
            onClick={() => {
              setShowDeletarBeneficiarioModal(true);
            }}
          >
            <DeleteForeverIcon
              style={{
                fontSize: "25px",
                color: "#ED757D",
              }}
            />
          </Box>
        )}

        <Box
          style={{ marginLeft: "20px" }}
          onClick={() => {
            setShowTrasacoesModal(true);
          }}
        >
          <CompareArrowsIcon
            style={{
              fontSize: "25px",
              color: "#202020",
            }}
          />
        </Box>
      </Box>

      <BeneficiarioModal
        show={showEditarBeneficiarioModal}
        setShow={setShowEditarBeneficiarioModal}
        getData={getData}
        data={row}
        update
      />
      <DeletarBeneficiarioModal
        show={showDeletarBeneficiarioModal}
        setShow={setShowDeletarBeneficiarioModal}
        getData={getData}
        data={row}
      />
      <ExtratoBeneficiarioModal
        show={showTransacoesModal}
        setShow={setShowTrasacoesModal}
        getData={getData}
        data={row}
      />
    </Box>
  );
};

export default function ListaBeneficiarios() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(false);
  const [showCadastrarLoteModal, setShowCadastrarLoteModal] = useState(false);
  const [showCadastrarBeneficiarioModal, setShowCadastrarBeneficiarioModal] =
    useState(false);
  const headerLike = useSelector((state) => state.headerLike);
  const [listaBeneficiarios, setListaBeneficiarios] = useState([]);
  const [page, setPage] = useState(1);

  const getData = async (page = 1, headerLike = "") => {
    setLoading(true);
    try {
      const res = await getCartoesPre(token, page, headerLike);
      setListaBeneficiarios(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    getData(page, headerLike);
  }, [token, page, headerLike]);

  useEffect(() => {
    return () => {
      dispatch(setHeaderLike(""));
    };
  }, []);

  const beneficiarioButtons = [
    {
      text: "Cadastrar em Lote por arquivo",
      callback: () => setShowCadastrarLoteModal(true),
    },
    {
      text: "Novo cadastro",
      callback: () => setShowCadastrarBeneficiarioModal(true),
      color: "horizontalGradient",
      icon: <AddIcon style={{ color: "white", marginRight: "10px" }} />,
    },
  ];

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Beneficiários"
          isSearchVisible
          customButtons={beneficiarioButtons}
        />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                borderRadius: "17px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  borderRadius: 27,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box
                  display="flex"
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Box
                    style={{
                      width: "100%",
                      borderTopRightRadius: 27,
                      borderTopLeftRadius: 27,
                    }}
                  >
                    {ListaBeneficiarios ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns ? columns : null}
                            data={listaBeneficiarios}
                            Editar={(props) => (
                              <MenuTable
                                getData={getData}
                                hasPermission={hasPermission()}
                                {...props}
                              />
                            )}
                          />
                        </Box>

                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={listaBeneficiarios.last_page}
                            onChange={(e, v) => setPage(v)}
                            page={page}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <LinearProgress color="primary" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <CadastrarLoteModal
        show={showCadastrarLoteModal}
        setShow={setShowCadastrarLoteModal}
        getData={getData}
      />
      <BeneficiarioModal
        show={showCadastrarBeneficiarioModal}
        setShow={setShowCadastrarBeneficiarioModal}
        getData={getData}
      />
    </Box>
  );
}
