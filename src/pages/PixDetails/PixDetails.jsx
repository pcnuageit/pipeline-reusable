import { faCalendarAlt, faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getTransacaoPixIdAction } from "../../actions/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable/CustomTable";
import useAuth from "../../hooks/useAuth";

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      if (data) {
        const p = data.split(/\D/g);
        const dataFormatada = [p[2], p[1], p[0]].join("/");
        return (
          <Box display="flex" justifyContent="center">
            <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
            <Typography style={{ marginLeft: "6px" }}>
              {dataFormatada}
            </Typography>
          </Box>
        );
      }
    },
  },

  {
    headerText: "Descricao",
    key: "descricao",
  },
  {
    headerText: "Situação",
    key: "response.status",
    CustomValue: (status) => {
      return status === "SUCCEEDED" ? (
        <Typography
          style={{
            color: "green",
            fontWeight: "bold",
            borderRadius: "27px",
          }}
        >
          Sucesso
        </Typography>
      ) : status === "pending" ? (
        <Typography
          style={{
            color: "red",
            fontWeight: "bold",
            borderRadius: "27px",
          }}
        >
          Pendente
        </Typography>
      ) : status === "executed" ? (
        <Typography
          style={{
            color: "green",
            fontWeight: "bold",
            borderRadius: "27px",
          }}
        >
          Confirmado
        </Typography>
      ) : status === "REFUNDED" ? (
        <Typography
          style={{
            color: "blue",
            fontWeight: "bold",
            borderRadius: "27px",
          }}
        >
          Reembolsado
        </Typography>
      ) : null;
    },
  },
  {
    headerText: "Valor",
    key: "valor",
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

const PixDetails = () => {
  const { subsectionId } = useParams();
  const dispatch = useDispatch();
  const token = useAuth();
  const transferenciaId = useSelector((state) => state.pixId);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [background, setBackground] = useState("gray");

  useEffect(() => {
    dispatch(getTransacaoPixIdAction(token, subsectionId));
  }, [subsectionId]);

  useEffect(() => {
    if (transferenciaId && transferenciaId.response) {
      switch (transferenciaId.response.status) {
        case "SUCCEEDED":
          setBackground("green");
          break;

        case "pending":
          setBackground("red");
          break;

        case "executed":
          setBackground("green");
          break;

        case "REFUNDED":
          setBackground("blue");
          break;

        default:
          break;
      }
    }
  }, [transferenciaId]);

  return transferenciaId.id ? (
    <Box
      style={{
        display: "flex",
        position: "absolute",
        flexDirection: "column",
        minWidth: !matches ? 1200 : null,
      }}
    >
      <Paper
        style={{
          padding: "24px",
          margin: "12px 0",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4"> Detalhes do TED </Typography>

        <Box
          display="flex"
          marginTop="12px"
          style={matches ? { flexDirection: "column" } : null}
        >
          <Box display="flex" flexDirection="column" style={{ width: "100%" }}>
            {transferenciaId.created_at === undefined ? (
              <LinearProgress />
            ) : (
              <Box style={{ minWidth: !matches ? 500 : null }}>
                <CustomTable data={[transferenciaId]} columns={columns} />
              </Box>
            )}
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            style={{ marginLeft: !matches ? 20 : 0, width: "100%" }}
          >
            <Box
              style={{
                padding: "12px",
                borderRadius: "8px 8px 0 0 ",
                backgroundColor: background,
                color: "white",
              }}
            >
              <Box>
                <Typography variant="h6" align="center">
                  PIX
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="h6">
                  Valor: R${transferenciaId.valor}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignContent="center"
                marginTop="12px"
                style={matches ? { flexDirection: "column" } : null}
              >
                <Typography variant="h6">
                  ID da transação: <br />
                  <TextField value={transferenciaId.zoop_transaction_id} />
                  <Tooltip title="Copiar">
                    <CopyToClipboard text={transferenciaId.zoop_transaction_id}>
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
                          toast.success("Copiado para area de transferência", {
                            autoClose: 2000,
                          })
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
              <Divider style={{ margin: "6px" }} />
              <Typography variant="h6" align="center">
                Recebedor
              </Typography>
              <Box>
                <Typography>Nome:</Typography>
                <Typography variant="h6">
                  {transferenciaId.conta.nome
                    ? transferenciaId.conta.nome
                    : "-"}
                </Typography>
                <Typography>Banco:</Typography>
                <Typography variant="h6">
                  {transferenciaId.banco ? transferenciaId.banco : "-"}
                </Typography>
                <Typography>Conta:</Typography>
                <Typography variant="h6">
                  {transferenciaId.conta.conta
                    ? transferenciaId.conta.conta
                    : "-"}
                </Typography>

                <Typography>Documento:</Typography>
                <Typography variant="h6">
                  {transferenciaId.conta.documento !== "..-"
                    ? transferenciaId.conta.documento
                    : "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  ) : (
    <CircularProgress />
  );
};

export default PixDetails;
