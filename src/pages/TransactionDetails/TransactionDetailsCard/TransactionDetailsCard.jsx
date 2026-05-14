import "react-credit-cards/es/styles-compiled.css";

import { faCalendarAlt, faCopy } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cards from "react-credit-cards";
import { toast } from "react-toastify";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../../constants/config";

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
    CustomValue: (valor) => (
      <Typography>
        R${" "}
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
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
            R${" "}
            {parseFloat(amount).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      } else {
        return (
          <Typography
            variant=""
            style={{ fontSize: 17, fontWeight: 600, color: "green" }}
          >
            R${" "}
            {parseFloat(amount).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      }
    },
  },
];
const columnsRecebiveis = [
  {
    headerText: "Data Prevista",
    key: "expected_on",
    CustomValue: (data) => {
      const p = data.split(/\D/g);
      const dataFormatada = [p[2], p[1]].join("/");
      return (
        <Box display="flex" justifyContent="center">
          <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
          <Typography style={{ marginLeft: "6px" }}>{dataFormatada}</Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Status",
    key: "status",
    CustomValue: (status) => {
      if (status === "paid") {
        return <Typography>Pago</Typography>;
      } else if (status === "pending") {
        return <Typography>Pendente</Typography>;
      } else if (status === "canceled") {
        return <Typography>Cancelado</Typography>;
      } else if (status === "refunded") {
        return <Typography>Estornado</Typography>;
      }
    },
  },
  {
    headerText: "Parcela",
    key: "installment",
    CustomValue: (installment) => {
      return <Typography>{installment || "Única"}</Typography>;
    },
  },
  {
    headerText: "Destinatário",
    key: "conta",
    CustomValue: (conta) => {
      return <Typography>{conta.nome}</Typography>;
    },
  },
  {
    headerText: "Valor Bruto",
    key: "gross_amount",
    CustomValue: (amount) => <Typography>R${amount}</Typography>,
  },
  {
    headerText: "Valor Líquido",
    key: "amount",
    CustomValue: (amount) => <Typography>R${amount}</Typography>,
  },
];

const TransactionDetailsCard = ({
  transacaoId,
  recebiveis,
  reloadTransaction,
}) => {
  const {
    transaction,
    conta_id,
    pagador,
    split,
    conta,
    cartao,
    cancellation_receipts: cancellationReceipts = [],
  } = transacaoId;
  const [arrayObjetos] = useState([transacaoId]);
  const [background, setBackground] = useState("");
  const [openSplitModal, setOpenSplitModal] = useState(false);
  const [splitModalInfo, setSplitModalInfo] = useState(null);
  const [splitId, setSplitId] = useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

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

  const openEditDialog = (transaction) => {
    setSplitId(transaction.id);
    setSplitModalInfo({
      porcentagem: Number(transaction.porcentagem),
      valor: Number(transaction.valor),
      usar_valor_liquido: transaction.usar_valor_liquido,
      conta_id: transaction.conta_id,
    });

    setOpenSplitModal(true);
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "10px",
      }}
    >
      {/* <SplitModal
				id={cartao.id}
				open={openSplitModal}
				onClose={() => setOpenSplitModal(false)}
				onSplit={reloadTransaction}
				info={splitModalInfo}
				splitId={splitId}
				accountId={conta_id}
			/> */}
      <CustomHeader pageTitle="Detalhes" />
      <Paper
        style={{
          padding: "24px",
          margin: "12px 0",
          borderRadius: "27px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
        }}
      >
        <Typography
          style={{ color: APP_CONFIG.mainCollors.primary }}
          variant="h4"
        >
          {" "}
          Detalhes da Transação{" "}
        </Typography>

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
            {/* 	<Box marginTop="18px">
							<Typography
								style={{
									margin: '6px 0',
									color: APP_CONFIG.mainCollors.primary,
								}}
								variant="h4"
							>
								Recebimentos
							</Typography>
							{recebiveis ? (
								<CustomTable
									data={recebiveis.data}
									columns={columnsRecebiveis}
								/>
							) : null}
						</Box> */}
            <Box marginTop="18px">
              <Typography
                style={{ color: APP_CONFIG.mainCollors.primary }}
                style={{
                  margin: "6px 0",
                  color: APP_CONFIG.mainCollors.primary,
                }}
                variant="h4"
              >
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
                <Typography
                  style={{ color: "#000" }}
                  variant="h6"
                  align="center"
                >
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
                  <Typography
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    variant="h6"
                  >
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
                              },
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
                <Typography
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                  variant="h6"
                >
                  ID do Vendedor:
                </Typography>
                <Typography
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                  variant="h8"
                >
                  {conta.id ? conta.id : ""}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                marginTop="10px"
              >
                <Typography
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                  variant="h6"
                >
                  Código de autorização
                </Typography>
                <Typography
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                  variant="h8"
                >
                  {transaction.payment_authorization &&
                  transaction.payment_authorization.authorization_code
                    ? transaction.payment_authorization.authorization_code
                    : "Não autorizada"}
                </Typography>
              </Box>
              <Divider style={{ margin: "6px 0px" }} />
              {pagador ? (
                <>
                  <Typography
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    variant="h6"
                    align="center"
                  >
                    Pagador
                  </Typography>
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    Nome:
                  </Typography>
                  <Typography
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    variant="h6"
                  >
                    {pagador.nome ? pagador.nome : "-"}
                  </Typography>
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    Id:
                  </Typography>
                  <Typography
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    variant="h6"
                  >
                    {pagador.id ? pagador.id : "-"}
                  </Typography>
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    Documento:
                  </Typography>
                  <Typography
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    variant="h6"
                  >
                    {pagador.documento !== "..-" ? pagador.documento : "-"}
                  </Typography>
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    E-mail:
                  </Typography>
                  <Typography
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    variant="h6"
                  >
                    {pagador.email ? pagador.email : "-"}
                  </Typography>
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    Contato:
                  </Typography>
                  <Typography
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    variant="h6"
                  >
                    {pagador.celular ? pagador.celular : "-"}
                  </Typography>
                </>
              ) : (
                <Typography
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                  variant="h6"
                  align="center"
                >
                  Sem pagador específico
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TransactionDetailsCard;
