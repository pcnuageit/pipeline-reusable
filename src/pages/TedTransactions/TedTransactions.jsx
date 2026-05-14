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
import { generatePath, useHistory, useParams } from "react-router-dom";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import { isEqual } from "lodash";
import { getTransacaoTedAction } from "../../actions/actions";
import CustomBreadcrumbs from "../../components/CustomBreadcrumbs/CustomBreadcrumbs";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import { filters_historico_ted } from "../../constants/localStorageStrings";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";

const columns = [
  {
    headerText: "Banco",
    key: "banco",
  },
  {
    headerText: "Agência",
    key: "agencia",
  },

  {
    headerText: "Conta",
    key: "conta",
  },

  {
    headerText: "Documento Destino",
    key: "documento",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
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

const TedTransactions = () => {
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
      getTransacaoTedAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        id,
      ),
    );
  }, [page, debouncedLike, filters.order, filters.mostrar, id]);

  const transacaoTed = useSelector((state) => state.ted);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = (row) => {
    const path = generatePath(
      "/dashboard/gerenciar-contas/:id/detalhes-ted/:tedId",
      {
        id: id,
        tedId: row.id,
      },
    );

    history.push(path);
  };

  useEffect(() => {
    if (!isEqual(filters, filtersComparation)) {
      localStorage.setItem(
        filters_historico_ted,
        JSON.stringify({ ...filters }),
      );
    }
  }, [filters]);

  useEffect(() => {
    const getLocalFilters = JSON.parse(
      localStorage.getItem(filters_historico_ted),
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
          path2="Transferência TED"
        />
      ) : (
        <CustomBreadcrumbs path1="Transferência TED" />
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
          Transferência TED
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

      {transacaoTed.data && transacaoTed.per_page ? (
        <CustomTable
          columns={columns}
          data={transacaoTed.data}
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
          count={transacaoTed.last_page}
          onChange={handleChangePage}
          page={page}
        />
      </Box>
    </Box>
  );
};

export default TedTransactions;
