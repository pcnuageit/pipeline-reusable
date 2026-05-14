import {
  Box,
  Button,
  IconButton,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArticleIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination, TableContainer } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadBoletoList, setDadosBoleto } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import CustomCollapseTablePix from "../CustomCollapseTablePix/CustomCollapseTablePix";

const useStyles = makeStyles((theme) => ({}));

const ListaDeBoletos = ({ title, changePath, ...rest }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const token = useAuth();
  const [page, setPage] = useState(1);
  const [like, setLike] = useState("");
  const [order, setOrder] = useState("");
  const [mostrar, setMostrar] = useState(10);

  const pagamentosList = useSelector((state) => state.pagamentosList);
  const listaBoletos = useSelector((state) => state.boletosList);
  moment.locale();
  let debouncedLike = useDebounce(like, 1000);

  function copyToClipBoard(text) {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  }
  useEffect(() => {
    dispatch(loadBoletoList(token, page, like, order, mostrar));
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
            <ArticleIcon style={{ color: "white", fontSize: "30px" }} />
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

                changePath("boletoGerado");
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
      key: "data_vencimento",
      CustomValue: (vencimento) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Vencimento: {moment.utc(vencimento).format("DD/MM/YYYY")}
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
    // {
    // 	headerText: 'Data',
    // 	key: 'numero_documento',
    // 	CustomValue: (numero) => {
    // 		return (
    // 			<>
    // 				<Typography
    // 					style={{
    // 						fontFamily: 'Montserrat-Regular',
    // 						fontSize: '15px',
    // 						color: APP_CONFIG.mainCollors.primary,
    // 					}}
    // 				>
    // 					Nº do documento: {numero}
    // 				</Typography>
    // 			</>
    // 		);
    // 	},
    // },
    {
      headerText: "Data",
      key: "linha_digitavel",
      CustomValue: (digitavel) => {
        return (
          <Box display={"flex"} alignItems="center">
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Linha digitável: {digitavel}
            </Typography>
            <IconButton
              type="button"
              onClick={() => {
                copyToClipBoard(digitavel);
              }}
            >
              <ContentCopyIcon
                style={{
                  color: APP_CONFIG.mainCollors.primary,
                  fontSize: "20px",
                }}
              />
            </IconButton>
          </Box>
        );
      },
    },
    {
      headerText: "Data",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Valor: R${" "}
              {parseFloat(valor).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </>
        );
      },
    },

    {
      headerText: "Data",
      key: "url",
      CustomValue: (url) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
                fontWeight: "bold",
              }}
              onClick={() => {
                window.open(url);
              }}
            >
              Visualizar documento
            </Typography>
          </>
        );
      },
    },
  ];

  const Editar = (row) => {
    return <Typography></Typography>;
    //return <CustomRoundedCard icon="transferir" />;
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
        Boletos
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
          {listaBoletos.data && listaBoletos.data.length > 0 ? (
            <>
              <Box minWidth={!matches ? "500px" : null}>
                <TableContainer
                  style={{ overflowX: "auto", overflowY: "hidden" }}
                >
                  <CustomCollapseTablePix
                    itemColumns={itemColumns}
                    data={listaBoletos.data}
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
                  count={listaBoletos.last_page}
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

export default ListaDeBoletos;
