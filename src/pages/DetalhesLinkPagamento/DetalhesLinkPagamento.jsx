import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  LinearProgress,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router";

import { loadLinkPagamentoId } from "../../actions/actions";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { phoneMask } from "../../utils/phoneMask";

const columns = [
  {
    headerText: "Pago em",
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
    headerText: "Pagador",
    key: "pagador",
    CustomValue: (pagador) => {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>{pagador.nome}</Typography>
          <Typography>{pagador.documento}</Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Contato",
    key: "pagador",
    CustomValue: (pagador) => {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>{phoneMask(pagador?.celular)}</Typography>
          <Typography>{pagador.email}</Typography>
        </Box>
      );
    },
  },
];

const DetalhesLinkPagamento = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const linkPagamentoId = useSelector((state) => state.linkPagamentoId);
  const dispatch = useDispatch();
  const { subsectionId } = useParams();
  const token = useAuth();

  useEffect(() => {
    dispatch(loadLinkPagamentoId(token, subsectionId));
  }, [subsectionId]);

  const handleClickRow = (row) => {
    const path = generatePath(
      "/dashboard/adquirencia/acao/maquina-virtual-cartao/:id",
      {
        subsectionId: row.transaction_id,
      },
    );
    history.push(path);
  };

  console.log(linkPagamentoId);

  return (
    <Box display="flex" flexDirection="column">
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
          variant="h4"
          style={{ color: APP_CONFIG.mainCollors.primary }}
        >
          {" "}
          Pagamentos realizados
        </Typography>
        <Box
          display="flex"
          marginTop="12px"
          style={matches ? { flexDirection: "column" } : null}
        >
          <Box display="flex" flexDirection="column" style={{ width: "100%" }}>
            {linkPagamentoId.created_at === undefined ? (
              <LinearProgress />
            ) : (
              <CustomTable
                data={linkPagamentoId.pagamento}
                columns={columns}
                handleClickRow={handleClickRow}
              />
            )}
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
                color: "black",
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  style={{
                    fontSize: 14,
                    lineHeight: 1,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Status
                </Typography>
                <Typography
                  variant="h6"
                  style={
                    linkPagamentoId.status === "Ativo"
                      ? { fontWeight: 500, color: "green" }
                      : { fontWeight: 500, color: "#dfad06" }
                  }
                  color="initial"
                >
                  {linkPagamentoId.conta && linkPagamentoId.status
                    ? linkPagamentoId.status
                    : null}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  style={{
                    fontSize: 14,
                    lineHeight: 1,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Beneficiário
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: 500,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                  color="initial"
                >
                  {linkPagamentoId.conta &&
                  linkPagamentoId.conta.nome &&
                  !linkPagamentoId.conta.razao_social
                    ? linkPagamentoId.conta.nome
                    : null}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: 500,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                  color="initial"
                >
                  {linkPagamentoId.conta && linkPagamentoId.conta.razao_social
                    ? linkPagamentoId.conta.razao_social
                    : null}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  style={{
                    fontSize: 14,
                    lineHeight: 1,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  CPF/CNPJ
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: 500,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                  color="initial"
                >
                  {linkPagamentoId.conta &&
                  linkPagamentoId.conta.documento &&
                  !linkPagamentoId.conta.razao_social
                    ? linkPagamentoId.conta.documento
                    : null}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: 500,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                  color="initial"
                >
                  {linkPagamentoId.conta && linkPagamentoId.conta.cnpj
                    ? linkPagamentoId.conta.cnpj
                    : null}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  style={{
                    fontSize: 14,
                    lineHeight: 1,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Valor
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: 500,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                  color="initial"
                >
                  R${" "}
                  {linkPagamentoId.conta && linkPagamentoId.valor
                    ? linkPagamentoId.valor
                    : null}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  style={{
                    fontSize: 14,
                    lineHeight: 1,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Limite de parcelas
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: 500,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                  color="initial"
                >
                  {linkPagamentoId.conta && linkPagamentoId.limite_parcelas
                    ? linkPagamentoId.limite_parcelas
                    : null}
                </Typography>
              </Box>

              {linkPagamentoId.numero_pedido ? (
                <Box>
                  <Typography
                    variant="overline"
                    style={{
                      fontSize: 14,
                      lineHeight: 1,
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Número do pedido
                  </Typography>
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: 500,
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                    color="initial"
                  >
                    {linkPagamentoId.conta && linkPagamentoId.numero_pedido
                      ? linkPagamentoId.numero_pedido
                      : null}
                  </Typography>
                </Box>
              ) : null}
              {linkPagamentoId.descricao ? (
                <Box>
                  <Typography
                    variant="overline"
                    style={{
                      fontSize: 14,
                      lineHeight: 1,
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Descrição
                  </Typography>
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    {linkPagamentoId.descricao}
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DetalhesLinkPagamento;
