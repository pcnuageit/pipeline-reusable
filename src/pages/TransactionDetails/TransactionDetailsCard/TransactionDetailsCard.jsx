import "react-credit-cards/es/styles-compiled.css";

import { faCalendarAlt, faCopy } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  LinearProgress,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cards from "react-credit-cards";
import CurrencyInput from "react-currency-input";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { postCancelarTransacaoAction } from "../../../actions/actions";
import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";

const columnsSplit = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const p = data.split(/\D/g);
      const dataFormatada = [p[2], p[1], p[0]].join("/");
      return (
        <Box display="flex" justifyContent="center">
          <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
          <Typography style={{ marginLeft: "6px" }}>{dataFormatada}</Typography>
        </Box>
      );
    },
  },
  {
    headerText: "ID Conta repartida",
    key: "conta",
    CustomValue: (conta) => {
      return (
        <Box>
          <Typography>{conta.nome ? conta.nome : null}</Typography>
          <Typography>{conta.documento ? conta.documento : null}</Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Arcou com Prejuizo",
    key: "responsavel_pelo_prejuizo",
    CustomValue: (responsavel) => {
      if (responsavel === true) {
        return <Typography>Sim</Typography>;
      } else {
        return <Typography>Não</Typography>;
      }
    },
  },
  {
    headerText: "Valor repartido",
    key: "split.receivable_amount",
    CustomValue: (valor) => <Typography>R$ {valor}</Typography>,
  },
];

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const p = data.split(/\D/g);
      const dataFormatada = [p[2], p[1], p[0]].join("/");
      return (
        <Box display="flex" justifyContent="center">
          <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
          <Typography style={{ marginLeft: "6px" }}>{dataFormatada}</Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Situação",
    key: "transaction.status",
    CustomValue: (status) => {
      if (status === "succeeded") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            SUCESSO
          </Typography>
        );
      }
      if (status === "failed") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            FALHADA
          </Typography>
        );
      }
      if (status === "canceled") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            CANCELADA
          </Typography>
        );
      }
      if (status === "pending") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            PENDENTE
          </Typography>
        );
      }
      if (status === "new") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            NOVO
          </Typography>
        );
      }
      if (status === "pre_authorized") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            PRÉ-AUTORIZADO
          </Typography>
        );
      }
      if (status === "reversed") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            REVERTIDO
          </Typography>
        );
      }
      if (status === "refunded") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            REEMBOLSADO
          </Typography>
        );
      }
      if (status === "dispute") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            DISPUTA
          </Typography>
        );
      }
      if (status === "charged_back ") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            DEBITADO
          </Typography>
        );
      }
    },
  },
  {
    headerText: "Valor",
    key: "transaction.amount",
    CustomValue: (amount) => {
      if (amount < 0) {
        return (
          <Typography
            variant=""
            style={{ fontSize: 17, fontWeight: 600, color: "red" }}
          >
            R$ {amount}
          </Typography>
        );
      } else {
        return (
          <Typography
            variant=""
            style={{ fontSize: 17, fontWeight: 600, color: "green" }}
          >
            R$ {amount}
          </Typography>
        );
      }
    },
  },
];
const useStyles = makeStyles((theme) => ({
  SplitModal: {
    padding: "20px",
  },
  saqueHeader: {
    background: APP_CONFIG.mainCollors.primary,
    color: "white",
  },
  currency: {
    font: "inherit",
    color: "currentColor",
    width: "100%",
    border: "0px",
    borderBottom: "1px solid gray",
    height: "1.1876em",
    margin: 0,
    display: "block",
    padding: "6px 0 7px",
    minWidth: 0,
    background: "none",
    boxSizing: "content-box",
    animationName: "mui-auto-fill-cancel",
    letterSpacing: "inherit",
    animationDuration: "10ms",
    appearance: "textfield",
    textAlign: "start",
    paddingLeft: "5px",
  },
}));

const TransactionDetailsCard = ({ transacaoId }) => {
  const { transaction, pagador, split, conta } = transacaoId;
  const [arrayObjetos] = useState([transacaoId]);
  const [background, setBackground] = useState("");
  const theme = useTheme();
  const classes = useStyles();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [tipoExtorno, setTipoExtorno] = useState("");
  const [amount, setAmount] = useState(0);
  const token = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (transaction.status === "succeeded") {
      setBackground("green");
    }
    if (transaction.status === "failed") {
      setBackground("red");
    }
    if (transaction.status === "canceled") {
      setBackground("red");
    }
    if (transaction.status === "pending") {
      setBackground("#dfad06");
    }
    if (transaction.status === "new") {
      setBackground("green");
    }
    if (transaction.status === "pre_authorized") {
      setBackground("#dfad06");
    }

    if (transaction.status === "reversed") {
      setBackground("red");
    }
    if (transaction.status === "refunded") {
      setBackground("red");
    }
    if (transaction.status === "dispute") {
      setBackground("red");
    }
    if (transaction.status === "charged_back ") {
      setBackground("red");
    }
  }, [transaction.status]);

  const handleExtorno = async () => {
    if (tipoExtorno === "") {
      toast.error("Selecione um tipo de extorno");
    } else {
      setLoading(true);
      const resExtorno = await dispatch(
        postCancelarTransacaoAction(
          token,
          transaction.id,
          tipoExtorno === "total" ? true : false,
          tipoExtorno === "total" ? transaction.amount : amount
        )
      );
      if (resExtorno) {
        setLoading(false);
        setModalCancelar(false);
        toast.error("Falha ao cancelar transação");
      } else {
        setLoading(false);
        setModalCancelar(false);
        toast.success("Transação cancelada com sucesso!");
      }
    }
  };

  return (
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
        <Typography variant="h4"> Detalhes da Transação </Typography>

        <Box
          display="flex"
          marginTop="12px"
          style={matches ? { flexDirection: "column" } : null}
        >
          <Box display="flex" flexDirection="column" style={{ width: "100%" }}>
            {transacaoId.created_at === undefined ? (
              <LinearProgress />
            ) : (
              <CustomTable data={arrayObjetos} columns={columns} />
            )}
            <Box marginTop="18px">
              <Typography style={{ margin: "6px 0" }} variant="h4">
                Repartições de valor
              </Typography>
              {split ? (
                <CustomTable data={split} columns={columnsSplit} />
              ) : null}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            style={{ marginLeft: "20px", width: "100%" }}
          >
            <Box
              style={{
                padding: "12px",
                borderRadius: "15px 15px 0 0 ",
                backgroundColor: background,
                color: "white",
              }}
            >
              <Box>
                <Typography variant="h6" align="center">
                  Cartão de{" "}
                  {transaction.payment_type === "credit" ? "Crédito" : "Débito"}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" marginTop="6px" flexDirection="column">
              <Box
                display="flex"
                marginTop="12px"
                justifyContent="space-around"
                style={matches ? { flexDirection: "column" } : null}
              >
                <Box>
                  <Typography variant="h6">
                    ID da transação: <br />
                    <TextField value={transaction.id} />
                    <Tooltip title="Copiar">
                      <CopyToClipboard text={transaction.id}>
                        <Button
                          aria="Copiar"
                          style={{
                            marginLeft: "6px",
                            width: "60px",
                            height: "20px",
                            alignSelf: "center",
                            color: "green",
                          }}
                          onClick={() =>
                            toast.success(
                              "Copiado para area de transferência",
                              {
                                autoClose: 2000,
                              }
                            )
                          }
                        >
                          <FontAwesomeIcon
                            style={{
                              width: "60px",
                              height: "20px",
                            }}
                            icon={faCopy}
                          />
                        </Button>
                      </CopyToClipboard>
                    </Tooltip>
                  </Typography>
                </Box>
                <Box>
                  <Cards
                    name={transaction.payment_method.holder_name}
                    number={
                      transaction.payment_method.first4_digits +
                      "********" +
                      transaction.payment_method.last4_digits
                    }
                    placeholders={{ name: "NOME DO TITULAR" }}
                  />
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                marginTop="10px"
              >
                <Typography variant="h6">ID do Vendedor:</Typography>
                {conta.id ? conta.id : ""}
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                marginTop="10px"
              >
                <Typography variant="h6">Código de autorização</Typography>
                {transaction.payment_authorization &&
                transaction.payment_authorization.authorization_code
                  ? transaction.payment_authorization.authorization_code
                  : "Não autorizada"}
              </Box>
              <Divider style={{ margin: "6px 0px" }} />
              {pagador ? (
                <>
                  <Typography variant="h6" align="center">
                    Pagador
                  </Typography>
                  <Typography>Nome:</Typography>
                  <Typography variant="h6">
                    {pagador.nome ? pagador.nome : "-"}
                  </Typography>
                  <Typography>Id:</Typography>
                  <Typography variant="h6">
                    {pagador.id ? pagador.id : "-"}
                  </Typography>
                  <Typography>Documento:</Typography>
                  <Typography variant="h6">
                    {pagador.documento !== "..-" ? pagador.documento : "-"}
                  </Typography>
                  <Typography>E-mail:</Typography>
                  <Typography variant="h6">
                    {pagador.email ? pagador.email : "-"}
                  </Typography>
                  <Typography>Contato:</Typography>
                  <Typography variant="h6">
                    {pagador.celular ? pagador.celular : "-"}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" align="center">
                  Sem pagador específico
                </Typography>
              )}
            </Box>
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                alignContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography style={{ alignSelf: "center" }}>Opções:</Typography>
              <Box style={{ marginTop: "10px" }}>
                <CustomButton onClick={() => setModalCancelar(true)}>
                  Cancelar Transação
                </CustomButton>
              </Box>
            </Box>
          </Box>
        </Box>
        <Dialog
          onClose={() => {
            setModalCancelar(false);
            setTipoExtorno("");
          }}
          open={modalCancelar}
          className={classes.SplitModal}
        >
          <Box display="flex" flexDirection="column" width="500px">
            <LoadingScreen isLoading={loading} />
            <DialogTitle className={classes.saqueHeader}>
              <Typography align="center" variant="h6">
                Solicitação de Extorno
              </Typography>
            </DialogTitle>

            <Box margin="20px">
              <FormControl fullWidth>
                <Box marginTop={2}>
                  <Typography variant="h6">Tipo de Extorno</Typography>
                  <RadioGroup
                    row
                    value={tipoExtorno}
                    onChange={(_, value) => setTipoExtorno(value)}
                  >
                    <FormControlLabel
                      value="total"
                      control={<Radio />}
                      label="Total"
                    />
                    <FormControlLabel
                      value="parcial"
                      control={<Radio />}
                      label="Parcial"
                    />
                  </RadioGroup>
                  {tipoExtorno === "parcial" && (
                    <Box marginY={1}>
                      <Typography variant="h6" align="center">
                        Valor extornavel: {transaction.amount}
                      </Typography>
                    </Box>
                  )}
                  <CurrencyInput
                    className={classes.currency}
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    disabled={tipoExtorno === "total"}
                    label="Valor do extorno"
                    value={
                      tipoExtorno === "total" ? transaction.amount : amount
                    }
                    style={{
                      marginBottom: "6px",
                      width: "100%",
                    }}
                    onChangeEvent={(event, maskedvalue, floatvalue) =>
                      setAmount(floatvalue)
                    }
                  />
                  {/* {storePosError ? (
									<FormHelperText
										style={{
											marginBottom: '6px',
											width: '60%',
											color: 'red',
										}}
									>
										{storePosError.token
											? storePosError.token[0]
											: null}
									</FormHelperText>
								) : null} */}
                </Box>
              </FormControl>
            </Box>

            <Box
              width="50%"
              alignSelf="end"
              display="flex"
              justifyContent="space-around"
              padding="12px 24px"
            >
              <Box margin="6px 0">
                <Button
                  variant="outlined"
                  style={{ borderRadius: "37px", marginRight: "10px" }}
                  onClick={handleExtorno}
                >
                  Confirmar
                </Button>
              </Box>
              <Box>
                <Button
                  style={{ borderRadius: "37px", margin: "6px 0" }}
                  variant="outlined"
                  onClick={() => {
                    setModalCancelar(false);
                    setTipoExtorno("");
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Box>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default TransactionDetailsCard;
