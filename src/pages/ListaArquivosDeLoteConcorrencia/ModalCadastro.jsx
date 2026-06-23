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
import {
  postAddLoteBeneficiarios,
  postAddLoteCartoes,
  postAddLoteContratoAluguel,
  postAddLotePagamentoCartao,
  postAddLotePagamentoContratoAluguel,
  postAddLotePagamentoEstabelecimento,
  postAddLotePagamentoVoucher,
  postAddLoteVouchers,
} from "../../services/beneficiarios";
import { errorMessageHelper } from "../../utils/errorMessageHelper";

import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

function useLoteCadastroRequests(
  tipo, //beneficiario, cartao, voucher, pagamento_cartao, pagamento_estabelecimento, pagamento_voucher, contrato_aluguel, pagamento_contrato_aluguel
) {
  const token = useAuth();
  const [conta, setConta] = useState({
    descricao: "",
    data_pagamento: "",
    password: "",
  });

  async function requestHandler(file) {
    if (tipo === "beneficiario") {
      await postAddLoteBeneficiarios(token, file);
    }
    if (tipo === "cartao") {
      await postAddLoteCartoes(token, file);
    }
    if (tipo === "voucher") {
      await postAddLoteVouchers(token, file);
    }
    if (tipo === "pagamento_cartao") {
      await postAddLotePagamentoCartao(
        token,
        file,
        conta.descricao,
        conta.data_pagamento,
        conta.password,
      );
    }
    if (tipo === "pagamento_estabelecimento") {
      await postAddLotePagamentoEstabelecimento(
        token,
        file,
        conta.descricao,
        conta.data_pagamento,
      );
    }
    if (tipo === "pagamento_voucher") {
      await postAddLotePagamentoVoucher(
        token,
        file,
        conta.descricao,
        conta.data_pagamento,
      );
    }
    if (tipo === "contrato_aluguel") {
      await postAddLoteContratoAluguel(token, file);
    }
    if (tipo === "pagamento_contrato_aluguel") {
      await postAddLotePagamentoContratoAluguel(token, file);
    }
  }

  return { conta, setConta, requestHandler };
}

export function CadastroEmLote({
  tipo = "beneficiario", //beneficiario, cartao, voucher, pagamento_cartao, pagamento_estabelecimento, pagamento_voucher, contrato_aluguel, pagamento_contrato_aluguel
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

  const handleClose = () => {
    setShow(false);
    setLoteArquivo("");
  };

  const handleCriarLote = async (e) => {
    e.preventDefault();
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

            {tipo === "pagamento_cartao" && (
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

            {tipo === "pagamento_cartao" ||
              tipo === "pagamento_estabelecimento" ||
              tipo === "pagamento_voucher" ? (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: "30px",
                }}
              >
                <Box>
                  <TextField
                    required
                    style={{ width: "175px" }}
                    label="Descrição"
                    variant="outlined"
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                    }}
                    value={conta.descricao}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                  />
                </Box>
                <Box style={{ marginLeft: "10px" }}>
                  <TextField
                    required
                    variant="outlined"
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
                </Box>
              </Box>
            ) : null}
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
  tipo, //beneficiario, cartao, voucher, pagamento_cartao, pagamento_estabelecimento, pagamento_voucher, contrato_aluguel, pagamento_contrato_aluguel
) => {
  const file = {
    instructions: "/arquivos/Instruções - Cadastro com arquivo csv.xlsx",
    example: "",
  };

  switch (tipo) {
    case "beneficiario":
      file.example = "/arquivos/Arquivo Modelo - Cadastro de Beneficiario.xlsx";
      break;
    case "cartao":
      file.example =
        "/arquivos/Arquivo Modelo - Cadastro de Beneficiario Cartao.xlsx";
      break;
    case "voucher":
      file.example =
        "/arquivos/Arquivo Modelo - Cadastro de Beneficiario Voucher.xlsx";
      break;
    case "pagamento_cartao":
    case "pagamento_estabelecimento":
    case "pagamento_voucher":
      file.instructions =
        "/arquivos/Instruções - Pagamentos Cartao Conta Estabelecimento.xlsx";
      file.example =
        "/arquivos/Arquivo Modelo - Pagamentos Cartao Conta Estabelecimento.xlsx";
      break;
    case "contrato_aluguel":
      file.instructions =
        "/arquivos/Instruções - Cadastro de Contrato Aluguel.txt";
      file.example =
        "/arquivos/Arquivo Modelo - Cadastro de Contrato Aluguel.xlsx";
      break;
    case "pagamento_contrato_aluguel":
      file.example =
        "/arquivos/Arquivo Modelo - Pagamentos Contrato Aluguel.xlsx";
      break;
    default:
      break;
  }

  return file;
};
