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
import CustomTable from "../../components/CustomTable/CustomTable";
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

const PaymentLinkDetails = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const history = useHistory();
  const linkPagamentoId = useSelector((state) => state.linkPagamentoId);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(loadLinkPagamentoId(token, id));
  }, [id]);

  const handleClickRow = (row) => {
    const path = generatePath("/dashboard/detalhes-transacao/:id/ver", {
      id: row.transaction_id,
    });
    history.push(path);
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
        <Typography variant="h4"> Pagamentos realizados</Typography>
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
                  style={{ fontSize: 14, lineHeight: 1 }}
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
                  style={{ fontSize: 14, lineHeight: 1 }}
                >
                  Beneficiário
                </Typography>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 500 }}
                  color="initial"
                >
                  {linkPagamentoId.conta && linkPagamentoId.conta.nome
                    ? linkPagamentoId.conta.nome
                    : null}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 500 }}
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
                  style={{ fontSize: 14, lineHeight: 1 }}
                >
                  CPF/CNPJ
                </Typography>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 500 }}
                  color="initial"
                >
                  {linkPagamentoId.conta && linkPagamentoId.conta.documento
                    ? linkPagamentoId.conta.documento
                    : null}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 500 }}
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
                  style={{ fontSize: 14, lineHeight: 1 }}
                >
                  Valor
                </Typography>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 500 }}
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
                  style={{ fontSize: 14, lineHeight: 1 }}
                >
                  Limite de parcelas
                </Typography>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 500 }}
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
                    style={{ fontSize: 14, lineHeight: 1 }}
                  >
                    Número do pedido
                  </Typography>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 500 }}
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
                    style={{ fontSize: 14, lineHeight: 1 }}
                  >
                    Descrição
                  </Typography>
                  <Typography>{linkPagamentoId.descricao}</Typography>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentLinkDetails;
