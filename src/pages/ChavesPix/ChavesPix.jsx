import {
  Box,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { getChavesPixAction } from "../../actions/actions";

import Pagination from "@material-ui/lab/Pagination";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
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
    headerText: "Chave",
    key: "chave",
  },
  {
    headerText: "Status",
    key: "status",
  },
  {
    headerText: "Atualizado em",
    key: "updated_at",
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
  },
];

const ChavesPix = () => {
  const token = useAuth();
  const [filters, setFilters] = useState({
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
  const id = useParams()?.id ?? "";
  useEffect(() => {
    return () => {
      setFilters({ ...filters });
    };
  }, []);

  useEffect(() => {
    dispatch(
      getChavesPixAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        id
      )
    );
  }, [page, debouncedLike, filters.order, filters.mostrar, id]);

  const chavesPix = useSelector((state) => state.chavesPix);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = (row) => {
    const path = generatePath("/dashboard/detalhes-link/:id/ver", {
      id: row.id,
    });
    history.push(path);
  };

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
          Chaves PIX
        </Typography>

        {/* {token && userData === '' ? null : (
					<Link to="novo-link-pagamento">
						<GradientButton buttonText="+Novo Link" />
					</Link>
				)} */}
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

      {chavesPix.data && chavesPix.per_page ? (
        <CustomTable columns={columns} data={chavesPix.data} />
      ) : (
        <LinearProgress />
      )}
      <Box alignSelf="flex-end" marginTop="8px">
        <Pagination
          variant="outlined"
          color="secondary"
          size="large"
          count={chavesPix.last_page}
          onChange={handleChangePage}
          page={page}
        />
      </Box>
    </Box>
  );
};

export default ChavesPix;
