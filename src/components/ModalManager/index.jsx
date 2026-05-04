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
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { Download } from "@mui/icons-material";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { errorMessageHelper } from "../../utils/errorMessageHelper";
import { useLoteCadastroRequests, useNovoCadastroRequests } from "./hooks";

import ReactInputMask from "react-input-mask";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { NovoCadastroContent } from "./NovoCadastroContent";
import { SenhaAprovar } from "./SenhaAprovar";

function NovoCadastro({
  tipo = "beneficiario", //beneficiario, cartao, voucher, beneficio
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
  update = false,
}) {
  const token = useAuth();
  const [loading, setLoading] = useState("");
  const { errors, setErrors, conta, setConta, requestHandler, resetFields } =
    useNovoCadastroRequests(tipo, update, data);

  const handleClose = () => {
    setShow(false);
    if (!update) {
      resetFields();
    }
  };

  const handleCriar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestHandler();
      getData(token);
      handleClose();
    } catch (err) {
      console.log(err);
      setErrors(err?.response?.data?.errors || {});
      toast.error("Ocorreu um erro. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const screenName = () => {
    switch (tipo) {
      case "beneficiario":
        return "beneficiário";
      case "cartao":
        return "cartão";
      case "voucher":
        return "voucher";
      case "beneficio":
        return "benefício";
      default:
        return "";
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
        {update ? "Editar" : "Cadastrar"} {screenName()}
      </DialogTitle>

      <form onSubmit={handleCriar}>
        <DialogContent style={{ overflow: "hidden" }}>
          <NovoCadastroContent
            tipo={tipo}
            errors={errors}
            setErrors={setErrors}
            conta={conta}
            setConta={setConta}
            update={update}
          />
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
}

function CadastroEmLote({
  tipo = "beneficiario", //beneficiario, cartao, voucher, pagamento_cartao, pagamento_estabelecimento, pagamento_voucher, contrato_aluguel, pagamento_contrato_aluguel, estabelecimento, notificacoes, cancelamento_cartao, bloquear_cartao, status_cartao, segunda_via_cartao, contrato_aluguel_excluir, voucher_embossing
  show = false,
  setShow = () => false,
  getData = () => null,
}) {
  const token = useAuth();
  const classes = useStyles();
  const [loteArquivo, setLoteArquivo] = useState("");
  const [loading, setLoading] = useState(false);
  const { conta, setConta, requestHandler } = useLoteCadastroRequests(tipo);
  var cardImage = loteArquivo[0];

  const isExcluir = () => {
    switch (tipo) {
      case "contrato_aluguel_excluir":
        return true;
      default:
        return false;
    }
  };

  const handleClose = () => {
    setShow(false);
    setLoteArquivo("");
  };

  const handleCriarLote = async (e) => {
    e.preventDefault();

    if (!loteArquivo[0]?.file)
      return toast.warning("Selecione um arquivo para continuar!");

    if (!conta?.password && tipo === "cartao")
      return toast.warning("A senha é obrigatória para continuar!");

    setLoading(true);
    try {
      await requestHandler(loteArquivo[0].file);
      getData(token);
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
      arquivo.map((item) => {
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
        {isExcluir() ? "Excluir" : "Cadastrar"} em lote por arquivo
      </DialogTitle>

      <form onSubmit={handleCriarLote}>
        <DialogContent>
          <DialogContentText>
            Siga as instruções e use o arquivo modelo:
          </DialogContentText>

          <Link
            target="_blank"
            download
            to={fileDownloadManger(tipo).instructions}
          >
            <Button>
              <Download />
              Instruções
            </Button>
          </Link>

          <Link target="_blank" download to={fileDownloadManger(tipo).example}>
            <Button>
              <Download />
              Arquivo modelo
            </Button>
          </Link>

          <DialogContentText>Insira o arquivo abaixo:</DialogContentText>

          <Box className={classes.dropzoneContainer}>
            <DropzoneAreaBase
              dropzoneParagraphClass={classes.textoDropzone}
              maxFileSize={3145728}
              onDropRejected={() => {
                toast.error("Tamanho máximo: 3mb ");
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

            <Box style={{ marginTop: "10px" }}>
              <Grid container>
                {loteArquivo ? (
                  <Card className={classes.card}>
                    <CardActionArea
                      style={{
                        padding: 16,
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Box style={{ marginRight: "16px" }}>
                        <IconButton
                          onClick={() => handleExcluirArquivo(loteArquivo)}
                          size="small"
                          style={{
                            color: "white",
                            backgroundColor: "red",
                          }}
                        >
                          <Clear />
                        </IconButton>
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => window.open(cardImage.data)}
                      >
                        <Typography style={{ fontSize: 12 }}>
                          {cardImage.file.name}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                ) : null}
              </Grid>
            </Box>

            <Grid
              container
              spacing={3}
              style={{
                marginTop: "24px",
              }}
            >
              {(tipo === "cartao" || tipo === "pagamento_cartao") && (
                <TextField
                  label="Senha*"
                  placeholder="*******"
                  value={conta.password}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  fullWidth
                  type="password"
                  variant="outlined"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                />
              )}

              {tipo === "pagamento_contrato_aluguel" ||
              tipo === "pagamento_cartao" ||
              tipo === "pagamento_estabelecimento" ||
              tipo === "pagamento_voucher" ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Descrição"
                    required
                    variant="outlined"
                    fullWidth
                    value={conta.descricao}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                  />
                </Grid>
              ) : null}

              {tipo === "pagamento_cartao" ||
              tipo === "pagamento_estabelecimento" ||
              tipo === "pagamento_voucher" ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data de pagamento"
                    required
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    value={conta.data_pagamento}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        data_pagamento: e.target.value,
                      }))
                    }
                  />
                </Grid>
              ) : null}
              {tipo === "cancelamento_cartao" ||
              tipo === "bloquear_cartao" ||
              tipo === "status_cartao" ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data de agendamento"
                    required
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    value={conta.data_agendamento}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        data_agendamento: e.target.value,
                      }))
                    }
                  />
                </Grid>
              ) : null}
              {tipo === "pagamento_cartao" || tipo === "pagamento_voucher" ? (
                <Grid item xs={12} sm={6}>
                  <ReactInputMask
                    mask={"99/9999"}
                    value={conta.competencia}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        competencia: e.target.value,
                      }))
                    }
                  >
                    {() => (
                      <TextField
                        label="Competência"
                        required
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </ReactInputMask>
                </Grid>
              ) : null}
            </Grid>
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
}

export const ModalManager = {
  NovoCadastro,
  CadastroEmLote,
  SenhaAprovar,
};

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    borderRadius: 16,
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

const fileDownloadManger = (
  tipo, //beneficiario, cartao, voucher, contrato_aluguel, pagamento_contrato_aluguel, pagamento_cartao, cancelamento_cartao, bloquear_cartao, segunda_via_cartao, pagamento_estabelecimento, pagamento_voucher, estabelecimento, notificacoes, voucher_embossing
) => {
  const file = {
    instructions: "/arquivos/Instruções - Cadastro com arquivo csv.xlsx",
    example: "",
  };

  switch (tipo) {
    case "beneficiario":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Cadastro_Beneficiario.xlsx ";
      file.example = "/arquivos/Arquivo Modelo - Cadastro de Beneficiario.xlsx";
      break;
    case "cartao":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Cadastro_Beneficiario_Cartao.xlsx";
      file.example =
        "/arquivos/Arquivo Modelo - Cadastro de Beneficiario Cartao.xlsx";
      break;
    case "voucher":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Cadastro_Beneficiario_Voucher.xlsx";
      file.example =
        "/arquivos/Arquivo Modelo - Cadastro de Beneficiario Voucher.xlsx";
      break;
    case "contrato_aluguel":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Cadastro_Contrato_Aluguel.xlsx";
      file.example =
        "/arquivos/Arquivo Modelo - Cadastro de Contrato Aluguel.xlsx";
      break;
    case "contrato_aluguel_excluir":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Excluir_Contrato_Aluguel.xlsx";
      file.example = "/arquivos/Arquivo Modelo - Excluir Contrato Aluguel.xlsx";
      break;
    case "pagamento_contrato_aluguel":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Pagamentos_Contrato_Aluguel.xlsx";
      file.example =
        "/arquivos/Arquivo Modelo - Pagamentos Contrato Aluguel.xlsx";
      break;
    case "estabelecimento":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Cadastro_Estabelecimento.xlsx";
      file.example =
        "/arquivos/Arquivo Modelo - Cadastro de Estabelecimento.xlsx";
      break;
    case "notificacoes":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Enviar_Notificacoes.xlsx";
      file.example = "/arquivos/Arquivo Modelo - Enviar Notificacoes.xlsx";
      break;
    case "pagamento_cartao":
    case "pagamento_estabelecimento":
    case "pagamento_voucher":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Pagamentos_Cartao_Conta_Estabelecimento.xlsx";
      file.example =
        "/arquivos/Arquivo Modelo - Pagamentos Cartao Conta Estabelecimento.xlsx";
      break;
    case "cancelamento_cartao":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Cancelamento_Cartao.xlsx";
      file.example = "/arquivos/Arquivo Modelo - Cancelamento Cartao.xlsx";
      break;
    case "bloquear_cartao":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Bloquear_Cartao.xlsx ";
      file.example = "/arquivos/Arquivo Modelo - Bloquear Cartao.xlsx";
      break;
    case "status_cartao":
      file.instructions = "/arquivos/Instrucoes_Importacao_Status_Cartao.xlsx";
      file.example = "/arquivos/Arquivo Modelo - Status Cartao.xlsx";
      break;
    case "segunda_via_cartao":
      file.instructions =
        "/arquivos/Instrucoes_Importacao_Segunda_Via_Cartao.xlsx";
      file.example = "/arquivos/Arquivo Modelo - Segunda Via Cartao.xlsx";
      break;
    case "voucher_embossing":
      // file.instructions = "/arquivos/";
      file.example =
        "/arquivos/Arquivo Modelo - Cadastro de Beneficiario Voucher Embossing.xlsx";
      break;
    default:
      break;
  }

  return file;
};
