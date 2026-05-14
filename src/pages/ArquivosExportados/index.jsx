import {
  Box,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { loadUserData } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

import { Download } from "@mui/icons-material";
import { toast } from "react-toastify";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { TableHeaderButton } from "../../components/TableHeaderButtons";
import {
  getArquivosExportados,
  getDownloadArquivoExportado,
} from "../../services/services";
import { translateStatus } from "../../utils/translateStatus";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dadosBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: "24px",
    marginLeft: "0px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    boxShadow: "none",
    borderRadius: "0px",
    alignSelf: "center",
  },
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",

    top: "10%",
    left: "35%",
    width: "30%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },

  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
  dropzoneAreaBaseClasses: {
    width: "70%",
    height: "250px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
  },
  dropzoneContainer: {
    margin: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px",
    minHeight: "422px",
    fontSize: "12px",
  },
  textoDropzone: {
    fontSize: "1.2rem",
    color: APP_CONFIG.mainCollors.primary,
  },
}));

const columns = [
  {
    headerText: "DATA",
    key: "created_at",
    CustomValue: (value) => moment.utc(value).format("DD/MM/YYYY HH:mm"),
  },
  { headerText: "TIPO", key: "filters.export_type" },
  {
    headerText: "STATUS",
    key: "status",
    CustomValue: (v) => <Typography>{translateStatus(v)}</Typography>,
  },
  { headerText: "DOWNLOAD", key: "menu" },
];

export default function ArquivosExportados() {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaArquivos, setListaArquivos] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    nome_beneficio: "",
    tipo: " ",
    external_id: "",
  });
  const debouncedFilter = useDebounce(filter, 800);

  // const resetFilters = () => {
  //   setFilter({
  //     nome_beneficio: "",
  //     tipo: " ",
  //     external_id: "",
  //   });
  // };

  // const filters = `nome_beneficio=${filter.nome_beneficio}&tipo=${filter.tipo}&external_id=${filter.external_id}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getArquivosExportados(
        token,
        userData?.id,
        page,
        "",
        "",
      );
      setListaArquivos(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (row) => {
    try {
      toast.warning("Carregando arquivo...");
      const { data } = await getDownloadArquivoExportado(
        token,
        row?.id,
        userData?.id,
      );
      const newWindow = window.open(data, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [dispatch, token]);

  useEffect(() => {
    getData(page);
  }, [token, page, debouncedFilter]);

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Arquivos exportados" customButtons={[]} />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                borderRadius: "17px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  borderRadius: 27,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box style={{ margin: 30, flex: 1 }}>
                  <TableHeaderButton
                    text="Atualizar"
                    onClick={() => {
                      getData();
                      setPage(1);
                    }}
                  />

                  {/* <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Pesquisar por nome"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        variant="outlined"
                        value={filter.nome_beneficio}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            nome_beneficio: e.target.value,
                          }));
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Pesquisar por ID"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        variant="outlined"
                        value={filter.external_id}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            external_id: e.target.value,
                          }));
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Select
                        variant="outlined"
                        fullWidth
                        required
                        value={filter.tipo}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            tipo: e.target.value,
                          }));
                        }}
                      >
                        <MenuItem value={" "}>Tipo</MenuItem>
                        <MenuItem value={"beneficiario"}>Voucher</MenuItem>
                        <MenuItem value={"cartao"}>Cartão</MenuItem>
                      </Select>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <CustomButton color="red" onClick={resetFilters}>
                          <Box display="flex" alignItems="center">
                            <Delete />
                            Limpar
                          </Box>
                        </CustomButton>
                      </Box>
                    </Grid>
                  </Grid> */}
                </Box>

                <Box
                  display="flex"
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Box
                    style={{
                      width: "100%",
                      borderTopRightRadius: 27,
                      borderTopLeftRadius: 27,
                    }}
                  >
                    {!loading &&
                    listaArquivos.data &&
                    listaArquivos.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns ? columns : null}
                            data={listaArquivos.data}
                            Editar={({ row }) => (
                              <Download onClick={() => handleDownload(row)} />
                            )}
                          />
                        </Box>

                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={listaArquivos.last_page}
                            onChange={(e, v) => setPage(v)}
                            page={page}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <LinearProgress color="primary" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
