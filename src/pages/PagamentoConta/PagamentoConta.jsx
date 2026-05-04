import {
  Box,
  LinearProgress,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import { isEqual } from "lodash";
import moment from "moment";
import "moment/locale/pt-br";
import { getPagamentoContaAction } from "../../actions/actions";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import { filters_historico_ted } from "../../constants/localStorageStrings";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import px2vw from "../../utils/px2vw";

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
      return (
        <>
          <Typography align="center"> {formatted}</Typography>
          <Typography align="center">
            {moment.utc(data).format("HH:mm:ss")}
          </Typography>
        </>
      );
    },
  },

  {
    headerText: "Status",
    key: "status",
    CustomValue: (value) => {
      if (value === "Registered") {
        return (
          <Typography
            style={{
              color: "orange",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pendente
          </Typography>
        );
      }
      if (value === "Paid") {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pago
          </Typography>
        );
      }
      if (value === "Cancel") {
        return (
          <Typography
            style={{
              color: "blue",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Estornado
          </Typography>
        );
      }
      if (value === "Error") {
        return (
          <Typography
            style={{
              color: "red",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Erro
          </Typography>
        );
      }
    },
  },

  {
    headerText: "Código de barras",
    key: "codigo_barras",
    CustomValue: (value) => <p>{value}</p>,
  },
  {
    headerText: "Valor",
    key: "valor",
    CustomValue: (valor) => {
      return (
        <>
          R${" "}
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
  {
    headerText: "Juros",
    key: "juros",
    CustomValue: (valor) => {
      return (
        <>
          R${" "}
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
  {
    headerText: "Desconto",
    key: "desconto",
    CustomValue: (valor) => {
      return (
        <>
          R${" "}
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
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

const PagamentoConta = () => {
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
  const useStyles = makeStyles(() => ({
    tableContainer: {
      marginTop: "1px",
      width: px2vw("100%"),
      "@media (max-width: 1440px)": {
        width: "950px",
      },
      "@media (max-width: 1280px)": {
        width: "850px",
      },
    },
  }));

  const classes = useStyles();

  const id = useParams()?.id ?? "";
  useEffect(() => {
    return () => {
      setFilters({ ...filters });
    };
  }, []);

  useEffect(() => {
    dispatch(
      getPagamentoContaAction(
        token,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        id
      )
    );
  }, [page, debouncedLike, filters.order, filters.mostrar, id]);

  const pagamentoConta = useSelector((state) => state.pagamentoConta);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = (row) => {
    const path = generatePath(
      "/dashboard/gerenciar-contas/:id/detalhes-ted/:tedId",
      {
        id: id,
        tedId: row.id,
      }
    );

    history.push(path);
  };

  useEffect(() => {
    if (!isEqual(filters, filtersComparation)) {
      localStorage.setItem(
        filters_historico_ted,
        JSON.stringify({ ...filters })
      );
    }
  }, [filters]);

  useEffect(() => {
    const getLocalFilters = JSON.parse(
      localStorage.getItem(filters_historico_ted)
    );
    if (getLocalFilters) {
      setFilters(getLocalFilters);
    }
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={matches ? "column" : null}
      >
        <Typography
          style={{
            marginTop: "8px",
            color: APP_CONFIG.mainCollors.primary,
            marginBottom: 30,
          }}
          variant="h4"
        >
          Pagamento Conta
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
      <Box className={classes.tableContainer}>
        {pagamentoConta.data && pagamentoConta.per_page ? (
          <CustomTable
            columns={columns}
            data={pagamentoConta.data}
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
            count={pagamentoConta.last_page}
            onChange={handleChangePage}
            page={page}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PagamentoConta;
