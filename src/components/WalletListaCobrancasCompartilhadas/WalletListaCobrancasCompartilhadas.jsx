import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Payments } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination, TableContainer } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadListaCobrancasCompartilhadas,
  setCobrancaQrCode,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import CustomCollapseTablePix from "../CustomCollapseTablePix/CustomCollapseTablePix";
import CustomRoundedCard from "../CustomRoundedCard/CustomRoundedCard";

const useStyles = makeStyles((theme) => ({}));

const statusCobranca = {
  1: "Aberto",
  2: "Pago",
};

const WalletListaCobrancasCompartilhadas = ({ title, changePath, ...rest }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const token = useAuth();
  const [page, setPage] = useState(1);
  const [like, setLike] = useState("");
  const [order, setOrder] = useState("");
  const [mostrar, setMostrar] = useState(10);

  //const lista = useSelector((state) => state.listaMinhasCobrancasWallet);
  const lista = useSelector((state) => state.listaCobrancasCompartilhadas);
  moment.locale();
  let debouncedLike = useDebounce(like, 1000);

  useEffect(() => {
    dispatch(
      loadListaCobrancasCompartilhadas(token, page, like, order, mostrar),
    );
  }, [token, page, debouncedLike]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const columns = [
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM")}</>;
      },
    },
    {
      headerText: "",
      key: "",
      CustomValue: (created_at) => {
        return (
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              height: "50px",
              width: "50px",

              borderRadius: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Payments style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (status) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "13px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {statusCobranca[status]}
            </Typography>
          </>
        );
      },
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
      headerText: "",
      key: "",
      FullObject: (data) => {
        return (
          <>
            {data.status == 1 && (
              <Button
                onClick={() => {
                  dispatch(setCobrancaQrCode(data));
                  changePath("cobrancaGerada");
                }}
                variant="outlined"
                color="primary"
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "10px",
                  color: APP_CONFIG.mainCollors.primary,
                  borderRadius: 20,
                }}
              >
                Visualizar
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const itemColumns = [
    {
      headerText: "Data",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Id: {id}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "descricao",
      CustomValue: (descricao) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Descrição: {descricao}
            </Typography>
          </>
        );
      },
    },
  ];

  const Editar = (row) => {
    return <CustomRoundedCard icon="transferir" />;
  };

  return (
    <>
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        Cobranças compartilhadas
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Box
          style={{
            width: "90%",
            height: "1px",
            backgroundColor: APP_CONFIG.mainCollors.primary,
          }}
        />

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          {/* <CustomFilterButton title="Lorem ipsum" />
					<CustomFilterButton title="Lorem ipsum" />
					<CustomFilterButton title="Lorem ipsum" />
					<CustomFilterButton title="Lorem ipsum" /> */}
          <TextField
            onChange={(e) => {
              setLike(e.target.value);
            }}
            variant="outlined"
            label=""
            InputProps={{
              endAdornment: (
                <SearchIcon
                  style={{
                    fontSize: "25px",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                />
              ),
            }}
          />
        </Box>
        <Box
          style={{
            marginTop: "30px",
            marginBottom: "30px",
            width: "100%",
            maxWidth: 900,
            padding: "10px",
          }}
        >
          {lista.data && lista.data.length > 0 ? (
            <>
              <Box minWidth={!matches ? "500px" : null}>
                <TableContainer
                  style={{ overflowX: "auto", overflowY: "hidden" }}
                >
                  <CustomCollapseTablePix
                    itemColumns={itemColumns}
                    data={lista.data}
                    columns={columns}
                    Editar={Editar}
                  />
                </TableContainer>
              </Box>
              <Box alignSelf="flex-end" marginTop="8px">
                <Pagination
                  variant="outlined"
                  color="secondary"
                  size="large"
                  count={lista.last_page}
                  onChange={handleChangePage}
                  page={page}
                />
              </Box>
            </>
          ) : (
            <Box minWidth={!matches ? "500px" : null}>
              <Typography
                style={{
                  textAlign: "center",
                }}
              >
                Não há dados para serem exibidos
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default WalletListaCobrancasCompartilhadas;
