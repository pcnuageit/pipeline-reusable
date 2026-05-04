import {
  Box,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { loadListarRecargas } from "../../actions/actions";

import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment";
import "moment/locale/pt-br";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      /* const date = new Date(data);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return (
				<Box display="flex" justifyContent="center">
					<FontAwesomeIcon icon={faCalendarAlt} size="lg" />
					<Typography style={{ marginLeft: '6px' }}>
						{formatted}
					</Typography>
				</Box>
			); */
      return (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
          {moment.utc(data).format("DD MMMM YYYY, HH:mm")}
        </Box>
      );
    },
  },
  /* {
		headerText: 'Produto',
		key: 'produto_celcoin',
		CustomValue: (produto) => {
			return <Typography>{produto}</Typography>;
		},
	}, */
  {
    headerText: "Situação",
    key: "status",
    CustomValue: (status) => {
      if (
        status === "SUCESSO" ||
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
    headerText: "Valor",
    key: "valor",
    CustomValue: (valor) => {
      return (
        <Typography>
          R$ <b>{valor}</b>
        </Typography>
      );
    },
  },
];

const GiftCardsList = () => {
  const token = useAuth();
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const id = useParams()?.id ?? "";
  const userData = useSelector((state) => state.userData);
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const recargas = useSelector((state) => state.recargas);

  moment.locale("pt-br");

  useEffect(() => {
    dispatch(
      loadListarRecargas(
        token,
        id,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar
      )
    );
  }, [page, filters.order, filters.mostrar, debouncedLike, id]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = async (row) => {
    if (row.id) {
      const path = generatePath(
        "/dashboard/gerenciar-contas/:id/detalhes-recarga/:recargaId",
        {
          id: id,
          recargaId: row.id,
        }
      );
      history.push(path);
    } else {
      return null;
    }
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
          Recargas
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
          {/* <TextField
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
					/> */}
        </Box>
      </Box>

      {recargas.data && recargas.per_page ? (
        <Box minWidth={!matches ? "800px" : null}>
          <CustomTable
            columns={columns}
            data={recargas.data}
            handleClickRow={handleClickRow}
          />
        </Box>
      ) : (
        <LinearProgress />
      )}
      <Box alignSelf="flex-end" marginTop="8px">
        <Pagination
          variant="outlined"
          color="secondary"
          size="large"
          count={recargas.last_page}
          onChange={handleChangePage}
          page={page}
        />
      </Box>
    </Box>
  );
};

export default GiftCardsList;
