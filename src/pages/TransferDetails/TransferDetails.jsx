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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { loadTransferenciaId } from "../../actions/actions";
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
    headerText: "Situação",
    key: "status",
    CustomValue: (status) => {
      if (
        status === "Bem sucedida" ||
        status === "Sucesso" ||
        status === "Confirmada" ||
        status === "Aprovado" ||
        status === "Criada"
      ) {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",

              borderRadius: "27px",
            }}
          >
            {status}
          </Typography>
        );
      }
      if (status === "Pendente") {
        return (
          <Typography
            style={{
              color: "#CCCC00",
              fontWeight: "bold",

              borderRadius: "27px",
            }}
          >
            {status}
          </Typography>
        );
      }
      return (
        <Typography
          style={{
            color: "red",
            fontWeight: "bold",

            borderRadius: "27px",
          }}
        >
          {status}
        </Typography>
      );
    },
  },
  {
    headerText: "Tipo",
    key: "tipo",
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

const TransferDetails = () => {
  const { subsectionId } = useParams();
  const dispatch = useDispatch();
  const token = useAuth();
  const transferenciaId = useSelector((state) => state.transferenciaId);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [background, setBackground] = useState("gray");

  useEffect(() => {
    dispatch(loadTransferenciaId(token, subsectionId));
  }, [subsectionId]);

  useEffect(() => {
    if (transferenciaId && transferenciaId.status) {
      switch (transferenciaId.status) {
        case "Bem sucedida":
        case "Sucesso":
        case "Confirmada":
        case "Aprovado":
        case "Criada":
          setBackground("green");
          break;

        default:
          setBackground("red");
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
        <Typography variant="h4"> Detalhes da Transferência </Typography>

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
                backgroundColor: "green",
                color: "white",
              }}
            >
              <Box>
                <Typography variant="h6" align="center">
                  Transferência
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="h6">
                  Valor: R$
                  {transferenciaId.valor ? transferenciaId.valor : ""}
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
                  <TextField
                    value={transferenciaId.id ? transferenciaId.id : ""}
                  />
                  <Tooltip title="Copiar">
                    <CopyToClipboard
                      text={transferenciaId.id ? transferenciaId.id : ""}
                    >
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
                <Typography>Razao Social:</Typography>
                <Typography variant="h6">
                  {transferenciaId.destino.razao_social
                    ? transferenciaId.destino.razao_social
                    : "-"}
                </Typography>

                <Typography>Nome:</Typography>
                <Typography variant="h6">
                  {transferenciaId.destino.nome
                    ? transferenciaId.destino.nome
                    : "-"}
                </Typography>
                <Typography>Documento:</Typography>
                <Typography variant="h6">
                  {transferenciaId.destino.documento !== "..-"
                    ? transferenciaId.destino.documento
                    : "-"}
                </Typography>
                <Typography>Cnpj:</Typography>
                <Typography variant="h6">
                  {transferenciaId.destino.cnpj
                    ? transferenciaId.destino.cnpj
                    : "-"}
                </Typography>
                <Typography>E-mail:</Typography>
                <Typography variant="h6">
                  {transferenciaId.destino.email
                    ? transferenciaId.destino.email
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

export default TransferDetails;
