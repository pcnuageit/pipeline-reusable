import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination, TableContainer } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadHistoricoTransferencia,
  setDadosBoleto,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import CustomCollapseTablePix from "../CustomCollapseTablePix/CustomCollapseTablePix";
import CustomRoundedCard from "../CustomRoundedCard/CustomRoundedCard";

const useStyles = makeStyles((theme) => ({}));

const ExtratoP2PContainer = ({ title, changePath, ...rest }) => {
  moment.locale();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const transferenciasP2P = useSelector(
    (state) => state.historicoTransferencia,
  );
  const dispatch = useDispatch();
  const token = useAuth();
  const [page, setPage] = useState(1);
  const [like, setLike] = useState("");
  const [mostrar, setMostrar] = useState(10);
  const [order, setOrder] = useState("");

  let debouncedLike = useDebounce(like, 1000);

  useEffect(() => {
    dispatch(loadHistoricoTransferencia(token, page, like, order, mostrar));
  }, [token, mostrar, page, debouncedLike]);

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
            <CompareArrowsIcon style={{ color: "white", fontSize: "30px" }} />
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
              {status}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Origem",
      key: "origem.nome",
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
            <Button
              onClick={() => {
                dispatch(setDadosBoleto(data));

                changePath("comprovanteAprovacao");
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
          </>
        );
      },
    },
  ];

  const itemColumns = [
    {
      headerText: "Data",
      key: "origem",
      CustomValue: (origem) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              <strong>Origem</strong> <br />
              Agência: {origem?.qi_tech_account?.account_branch} <br />
              Conta: {origem?.qi_tech_account?.account_number}
              {origem?.qi_tech_account?.account_digit} <br />
              Nome: {origem.nome} <br />
              Tipo: {origem.tipo}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Data",
      key: "destino",
      CustomValue: (destino) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              <strong>Destino</strong> <br />
              Agência: {destino?.qi_tech_account?.account_branch} <br />
              Conta: {destino?.qi_tech_account?.account_number}
              {destino?.qi_tech_account?.account_digit} <br />
              Nome: {destino.nome} <br />
              Tipo: {destino.tipo}
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
        Extrato transferências/P2P
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
          {transferenciasP2P.data && transferenciasP2P.data.length > 0 ? (
            <>
              <Box minWidth={!matches ? "500px" : null}>
                <TableContainer
                  style={{ overflowX: "auto", overflowY: "hidden" }}
                >
                  <CustomCollapseTablePix
                    itemColumns={itemColumns}
                    data={transferenciasP2P.data}
                    columns={columns}
                    Editar={Editar}
                  />
                </TableContainer>
              </Box>

              <Box
                alignSelf="flex-end"
                marginTop="8px"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Pagination
                  variant="outlined"
                  color="secondary"
                  size="large"
                  count={transferenciasP2P.last_page}
                  onChange={handleChangePage}
                  page={page}
                />
                <Button
                  style={{
                    minWidth: "5px",
                    height: "40px",
                    borderRadius: "27px",
                    border: "solid",
                    borderWidth: "1px",
                    borderColor: "grey",
                  }}
                  onClick={() => window.location.reload()}
                >
                  <RefreshIcon style={{ fontSize: 25, color: "grey" }} />
                </Button>
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

export default ExtratoP2PContainer;
