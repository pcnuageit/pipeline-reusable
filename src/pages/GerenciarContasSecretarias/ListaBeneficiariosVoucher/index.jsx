import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Delete, NotificationsActive } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { postAuthMeAction } from "../../../actions/actions";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import { ModalManager } from "../../../components/ModalManager";
import TableHeaderButton from "../../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import usePermission from "../../../hooks/usePermission";
import { deleteVoucher, getVouchers } from "../../../services/beneficiarios";
import { postSendPushNotification } from "../../../services/services";
import { documentMask } from "../../../utils/documentMask";
import px2vw from "../../../utils/px2vw";

moment.locale("pt-br");

export default function ListaBeneficiariosVoucher() {
  const token = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    chave_pix: "",
    cvc: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [showModalNovoCadastro, setShowModalNovoCadastro] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    headerContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: "25px",
      width: px2vw("100%"),
      "@media (max-width: 1440px)": {
        width: "950px",
      },
      "@media (max-width: 1280px)": {
        width: "850px",
      },
    },
    tableContainer: { marginTop: "1px" },
    pageTitle: {
      color: APP_CONFIG.mainCollors.primary,
      fontFamily: "Montserrat-SemiBold",
    },
  }))();

  const resetFilters = () => {
    setPage(1);
    setFilter({
      nome: "",
      documento: "",
      chave_pix: "",
      cvc: "",
    });
  };

  const filters = `conta_id=${id}&nome=${filter.nome}&documento=${filter.documento}&chave_pix=${filter.chave_pix}&cvc=${filter.cvc}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getVouchers(token, id, page, "", filters);
      console.log(data);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

  const handleSendPushNotification = async (row) => {
    if (!row.cvc) return;

    try {
      await postSendPushNotification(
        token,
        "Seu CVC",
        "Seu CVC para acesso ao benefício é: " + row?.cvc,
        false,
        false,
        [row?.user?.id],
      );
      toast.success("Notificação push com o CVC enviada!");
    } catch (err) {
      console.log(err);
      toast.error(
        "Nao foi possível enviar a notificação push. Tente novamente mais tarde.",
      );
    }
  };

  const columns = [
    { headerText: "Nome", key: "user.nome" },
    {
      headerText: "CPF",
      key: "user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "Chave Pix", key: "chave_pix" },
    {
      headerText: "Banco",
      key: "",
      FullObject: (obj) => (
        <Typography>
          {obj?.agencia}
          <br />
          {obj?.conta}
        </Typography>
      ),
    },
    {
      headerText: "CVC",
      key: "",
      FullObject: (obj) => (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: obj.cvc ? "pointer" : "auto",
          }}
          onClick={() => handleSendPushNotification(obj)}
        >
          <Box
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>{obj?.cvc}</Typography>
            <NotificationsActive />
          </Box>
          <Typography>Enviar CVC</Typography>
        </Box>
      ),
    },
    { headerText: "", key: "menu" },
  ];

  return (
    <Box className={useStyles.root}>
      <Box className={useStyles.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={useStyles.pageTitle}>
            Contas Voucher
          </Typography>

          {hasPermission(PERMISSIONS.secretarias.vouchers.update_extract) && (
            <Box style={{ alignSelf: "flex-end" }}>
              <IconButton
                style={{
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  color: APP_CONFIG.mainCollors.primary,
                }}
                onClick={() => window.location.reload(false)}
              >
                <RefreshIcon></RefreshIcon>
              </IconButton>
            </Box>
          )}
        </Box>

        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            {hasPermission(PERMISSIONS.secretarias.vouchers.search) && (
              <Grid
                container
                spacing={3}
                style={{ alignItems: "center", marginBottom: "8px" }}
              >
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por nome"
                    variant="outlined"
                    value={filter.nome}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({ ...prev, nome: e.target.value }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextFieldCpfCnpj
                    placeholder="Pesquisar por documento"
                    value={filter.documento}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        documento: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por chave Pix"
                    variant="outlined"
                    value={filter.chave_pix}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        chave_pix: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por CVC"
                    variant="outlined"
                    value={filter.cvc}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        cvc: e.target.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(PERMISSIONS.secretarias.vouchers.search) && (
                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilters}
                />
              )}

              {hasPermission(
                PERMISSIONS.secretarias.vouchers.view_batch_files,
              ) && (
                <>
                  <TableHeaderButton
                    text="Arquivos em lote"
                    onClick={() => {
                      const path = generatePath(
                        "lista-arquivos-de-lote?type=voucher",
                      );
                      history.push(path);
                    }}
                    Icon={Add}
                  />

                  <TableHeaderButton
                    text="Arquivos embossing"
                    onClick={() => {
                      const path = generatePath(
                        "lista-arquivos-de-lote?type=voucher_embossing",
                      );
                      history.push(path);
                    }}
                    Icon={Add}
                  />
                </>
              )}

              {hasPermission(PERMISSIONS.secretarias.vouchers.create) && (
                <TableHeaderButton
                  text="Novo cadastro"
                  onClick={() => setShowModalNovoCadastro(true)}
                  Icon={Add}
                />
              )}

              <ExportTableButtons
                token={token}
                path={"beneficiario/contas"}
                page={page}
                filters={filters}
                hasPermission={hasPermission(
                  PERMISSIONS.secretarias.vouchers.export,
                )}
              />
            </Grid>
          </Box>

          <Typography
            className={useStyles.pageTitle}
            style={{
              marginLeft: "30px",
              paddingBottom: "16px",
              marginBottom: "1px",
            }}
          >
            CONTAS RECENTES
          </Typography>
        </Box>

        {hasPermission(PERMISSIONS.secretarias.vouchers.view) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaContas?.data && listaContas?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={listaContas?.data}
                    Editar={({ row }) => (
                      <MenuOptionsTable
                        row={row}
                        getData={getData}
                        deleteCallback={
                          hasPermission(
                            PERMISSIONS.secretarias.vouchers.delete_recent,
                          )
                            ? deleteVoucher
                            : null
                        }
                      />
                    )}
                  />
                </TableContainer>
              </Box>
            ) : (
              <Box>
                <LinearProgress color="secondary" />
              </Box>
            )}

            <Box
              display="flex"
              alignSelf="flex-end"
              marginTop="8px"
              justifyContent="space-between"
            >
              <Pagination
                variant="outlined"
                color="secondary"
                size="large"
                count={listaContas?.last_page}
                onChange={(e, value) => setPage(value)}
                page={page}
              />
            </Box>
          </Box>
        )}
      </Box>

      <ModalManager.NovoCadastro
        tipo="voucher"
        show={showModalNovoCadastro}
        setShow={setShowModalNovoCadastro}
        getData={getData}
      />
    </Box>
  );
}
