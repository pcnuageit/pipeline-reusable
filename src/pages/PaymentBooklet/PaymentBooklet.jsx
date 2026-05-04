import {
  Box,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { loadCarneFilters } from "../../actions/actions";

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
        hour: "numeric",
        minute: "numeric",
      };
      const [dia] = date.toLocaleDateString("pt-br", option).split(" ");
      return <Typography align="center">{dia}</Typography>;
    },
  },

  {
    headerText: "Comprador",
    key: "pagador",
    CustomValue: (pagador) => {
      return (
        <>
          <Typography>{pagador.nome ? pagador.nome : null}</Typography>
          <Typography>
            {pagador.documento ? pagador.documento : null}
          </Typography>
        </>
      );
    },
  },
  {
    headerText: "Parcelas",
    key: "boleto",
    CustomValue: (boleto) => {
      const totalParcelas = boleto.length;
      return <Typography>{totalParcelas}</Typography>;
    },
  },

  {
    headerText: "Total",
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
];

const PaymentBooklet = () => {
  const token = useAuth();
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const carneList = useSelector((state) => state.carneList);
  const userData = useSelector((state) => state.userData);
  const id = useParams()?.id ?? "";
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
  });

  const debouncedLike = useDebounce(filters.like, 800);

  useEffect(() => {
    dispatch(
      loadCarneFilters(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        id
      )
    );
  }, [page, filters.order, filters.mostrar, debouncedLike, id]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  /* const handleClickRow = (row) => {
		const path = generatePath('/dashboard/detalhes-carne/:id/ver', {
			id: row.id,
		});
		history.push(path);
	}; */
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
          Lista de Carnês
        </Typography>

        {/* {token && userData === '' ? null : (
					<Link to="novo-carne">
						<GradientButton buttonText="+ Nova Cobrança" />
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
            placeholder="Pesquisar por nome, documento..."
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
      {carneList.data && carneList.per_page ? (
        <CustomTable
          columns={columns}
          data={carneList.data}
          /* handleClickRow={handleClickRow} */
        />
      ) : (
        <LinearProgress />
      )}

      <Box alignSelf="flex-end" marginTop="8px">
        <Pagination
          variant="outlined"
          color="secondary"
          size="large"
          count={carneList.last_page}
          onChange={handleChangePage}
          page={page}
        />
      </Box>
    </Box>
  );
};

export default PaymentBooklet;
