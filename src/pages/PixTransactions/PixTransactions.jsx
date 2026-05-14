import {
  Box,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import { isEqual } from "lodash";
import { getTransacaoPixAction } from "../../actions/actions";
import CustomBreadcrumbs from "../../components/CustomBreadcrumbs/CustomBreadcrumbs";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import { filters_historico_pix } from "../../constants/localStorageStrings";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const date = new Date(data);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const formatted = date.toLocaleDateString("pt-br", option);
      return <Typography align="center"> {formatted}</Typography>;
    },
  },
  {
    headerText: "Tipo",
    key: "tipo",
    CustomValue: (tipo) => {
      if (tipo === "national_registration") {
        return <Typography>CPF ou CNPJ</Typography>;
      }
      if (tipo === "email") {
        return <Typography>Email</Typography>;
      }
      if (tipo === "evp") {
        return <Typography>Chave Aleatória</Typography>;
      }
      if (tipo === "document") {
        return <Typography>CPF ou CNPJ</Typography>;
      }
      if (tipo === "phone") {
        return <Typography>Telefone</Typography>;
      }
      if (tipo === "random") {
        return <Typography>Chave Aleatória</Typography>;
      }
    },
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
    CustomValue: (valor) => (
      <p>
        R${" "}
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    ),
  },

  {
    headerText: "Chave Pix",
    key: "chave_recebedor",
    CustomValue: (value) => <p>{value}</p>,
  },
  {
    headerText: "Descrição",
    key: "descricao",
    CustomValue: (descricao) => {
      return (
        <Tooltip title={descricao ? descricao : "Sem descrição"}>
          <Box>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Box>
        </Tooltip>
      );
    },
  },
];

const PixTransactions = () => {
  const token = useAuth();
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
  });
  const [filtersComparation] = useState({
    like: "",
    order: "",
    mostrar: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const userData = useSelector((state) => state.userData);
  const { id } = useParams();

  useEffect(() => {
    return () => {
      setFilters({ ...filters });
    };
  }, []);

  useEffect(() => {
    dispatch(
      getTransacaoPixAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        id,
      ),
    );
  }, [page, debouncedLike, filters.order, filters.mostrar, id]);

  const transacaoPix = useSelector((state) => state.pix);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = (row) => {
    const path = generatePath(
      "/dashboard/gerenciar-contas/:id/detalhes-pix/:pixId",
      {
        id: id,
        pixId: row.zoop_transaction_id,
      },
    );
    history.push(path);
  };

  useEffect(() => {
    if (!isEqual(filters, filtersComparation)) {
      localStorage.setItem(
        filters_historico_pix,
        JSON.stringify({ ...filters }),
      );
    }
  }, [filters]);

  useEffect(() => {
    const getLocalFilters = JSON.parse(
      localStorage.getItem(filters_historico_pix),
    );
    if (getLocalFilters) {
      setFilters(getLocalFilters);
    }
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      {token && userData === "" ? (
        <CustomBreadcrumbs
          path1="Gerenciar Listas"
          to1="goBack"
          path2="Transação PIX"
        />
      ) : (
        <CustomBreadcrumbs path1="Transação PIX" />
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={matches ? "column" : null}
      >
        <Typography
          style={{ marginTop: "8px", color: "#9D9CC6", marginBottom: 30 }}
          variant="h4"
        >
          Transação PIX
        </Typography>
      </Box>
      <Box
        style={{
          width: "100%",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
        }}
      >
        <Box marginTop="16px" marginBottom="16px" style={{ margin: 30 }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Pesquisar por valor, descrição, número do pedido..."
            value={filters.like}
            onChange={(e) =>
              setFilters({
                ...filters,
                like: e.target.value,
              })
            }
          />
        </Box>
      </Box>

      {transacaoPix.data && transacaoPix.per_page ? (
        <CustomTable
          columns={columns}
          data={transacaoPix.data}
          handleClickRow={handleClickRow}
        />
      ) : (
        <LinearProgress />
      )}
      <Box alignSelf="flex-end" marginTop="8px">
        <Pagination
          variant="outlined"
          color="secondary"
          size="large"
          count={transacaoPix.last_page}
          onChange={handleChangePage}
          page={page}
        />
      </Box>
    </Box>
  );
};

export default PixTransactions;
