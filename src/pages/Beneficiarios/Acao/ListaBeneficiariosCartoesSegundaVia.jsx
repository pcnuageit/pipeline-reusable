import {
  Box,
  Checkbox,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check, Close, Delete } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import SelectBeneficio from "../../../components/SelectBeneficio";
import SelectCidade from "../../../components/SelectCidade";
import { TableHeaderButton } from "../../../components/TableHeaderButtons/";
import TextFieldCpfCnpj from "../../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  getSegundaViaList,
  postSegundaViaSolicitar,
} from "../../../services/beneficiarios";
import { documentMask } from "../../../utils/documentMask";
import { translateStatus } from "../../../utils/translateStatus";

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

export default function ListaBeneficiariosCartoesSegundaVia() {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const id = useParams()?.id ?? "";
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaCartoes, setListaCartoes] = useState([]);
  const [showAlterarSelecionadosModal, setShowAlterarSelecionadosModal] =
    useState(false);
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    status: " ",
    cartao_privado_id: "",
    documento: "",
    tipo_beneficio_id: "",
    cidade: "",
    cidade_cartao: "",
  });
  const debouncedFilter = useDebounce(filter, 800);

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      status: " ",
      cartao_privado_id: "",
      documento: "",
      tipo_beneficio_id: "",
      cidade: "",
      cidade_cartao: "",
    });
  };

  const filters = `status=${filter.status}&cartao_privado_id=${filter.cartao_privado_id}&documento=${filter.documento}&tipo_beneficio_id=${filter.tipo_beneficio_id}&cidade=${filter.cidade}&cidade_cartao=${filter.cidade_cartao}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getSegundaViaList(token, id, page, filters);
      setListaCartoes(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  const handleSelectAll = () => {
    const selected = listaCartoes?.data?.map((obj) => obj?.id);
    setRegistros(selected);
  };

  const columns = [
    {
      headerText: "",
      key: "",
      FullObject: (obj) => {
        const checked = registros.some((item) => item === obj?.id);

        return (
          <>
            <Box>
              <Checkbox
                color="primary"
                checked={checked}
                onChange={() => {
                  if (checked) {
                    setRegistros(registros.filter((item) => item !== obj?.id));
                  } else {
                    console.log(obj.id);
                    setRegistros((prev) => [...prev, obj?.id]);
                  }
                }}
              />
            </Box>
          </>
        );
      },
    },
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (value) => (
        <Typography>{moment.utc(value).format("DD/MM/YYYY")}</Typography>
      ),
    },
    {
      headerText: "ID",
      key: "cartao_privado.external_id",
      CustomValue: (valor) => <Typography>{valor || "Processando"}</Typography>,
    },
    {
      headerText: "FINAL",
      key: "cartao_privado.external_msk",
      CustomValue: (valor) => {
        return (
          <>
            <Typography>
              {valor ? valor?.replace(/\*/g, "") : "Processando"}
            </Typography>
          </>
        );
      },
    },
    // {
    //   headerText: "SALDO",
    //   key: "concorrencia_saldo.valor",
    //   CustomValue: (valor) => {
    //     return (
    //       <>
    //         <Typography>
    //           R${" "}
    //           {parseFloat(valor).toLocaleString("pt-br", {
    //             minimumFractionDigits: 2,
    //             maximumFractionDigits: 2,
    //           })}
    //         </Typography>
    //       </>
    //     );
    //   },
    // },
    { headerText: "motivo", key: "motivo" },
    {
      headerText: "STATUS",
      key: "status",
      CustomValue: (v) => <Typography>{translateStatus(v)}</Typography>,
    },
    { headerText: "NOME", key: "cartao_privado.user.nome" },
    {
      headerText: "CPF",
      key: "cartao_privado.user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "BENEFÍCIO",
      key: "cartao_privado.tipo_beneficio.nome_beneficio",
    },
    {
      headerText: "Cidade do Beneficiário",
      key: "cartao_privado.user.concorrencia_endereco.cidade",
    },
    {
      headerText: "Cidade do Cartão",
      key: "cartao_privado.municipio",
    },
    // { headerText: "", key: "menu" },
  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Cartões - Segunda via" customButtons={[]} />

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
                <Grid
                  container
                  spacing={3}
                  style={{
                    alignItems: "center",
                    margin: "30px",
                    marginBottom: "8px",
                  }}
                >
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      placeholder="Pesquisar por ID"
                      size="small"
                      variant="outlined"
                      value={filter.cartao_privado_id}
                      onChange={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          cartao_privado_id: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
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

                  <Grid item xs={12} sm={4}>
                    <InputLabel id="status-label" shrink="true">
                      Status
                    </InputLabel>
                    <Select
                      labelId="status-label"
                      variant="outlined"
                      fullWidth
                      required
                      value={filter.status}
                      onChange={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }));
                      }}
                    >
                      <MenuItem value={" "}>Todos</MenuItem>
                      <MenuItem value={"pending"}>
                        {translateStatus("pending")}
                      </MenuItem>
                      <MenuItem value={"created"}>
                        {translateStatus("created")}
                      </MenuItem>
                      <MenuItem value={"success"}>
                        {translateStatus("success")}
                      </MenuItem>
                      <MenuItem value={"failed"}>
                        {translateStatus("failed")}
                      </MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <SelectBeneficio
                      state={filter.tipo_beneficio_id}
                      setState={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          tipo_beneficio_id: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <SelectCidade
                      label="Cidade do Beneficiário"
                      state={filter.cidade}
                      setState={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          cidade: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <SelectCidade
                      label="Cidade do Cartão"
                      state={filter.cidade_cartao}
                      setState={(e) => {
                        setPage(1);
                        setFilter((prev) => ({
                          ...prev,
                          cidade_cartao: e.target.value,
                        }));
                      }}
                    />
                  </Grid>

                  <TableHeaderButton
                    Icon={Delete}
                    text="Limpar"
                    color="red"
                    onClick={resetFilters}
                  />

                  <TableHeaderButton
                    text="Solicitar segunda via"
                    onClick={() => {
                      if (registros.length === 0) {
                        toast.warning("Selecione algum cartão para continuar");
                        return;
                      }
                      setShowAlterarSelecionadosModal("solicitar");
                    }}
                  />

                  <TableHeaderButton
                    text="Selecionar todos"
                    onClick={handleSelectAll}
                    Icon={Check}
                  />
                </Grid>
              </Box>

              <Box
                display="flex"
                style={{
                  marginTop: "10px",
                  marginBottom: "16px",
                  margin: 30,
                  marginTop: "0px",
                }}
              >
                <Box
                  style={{
                    width: "100%",
                    borderTopRightRadius: 27,
                    borderTopLeftRadius: 27,
                  }}
                >
                  {!loading && listaCartoes.data && listaCartoes.per_page ? (
                    <>
                      <Box minWidth={!matches ? "800px" : null}>
                        <CustomTable
                          columns={columns}
                          data={listaCartoes?.data}
                        />
                      </Box>

                      <Box alignSelf="flex-end" marginTop="8px">
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={listaCartoes.last_page}
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

      <AlterarSelecionadosModal
        show={showAlterarSelecionadosModal}
        setShow={setShowAlterarSelecionadosModal}
        getData={getData}
        registros={registros}
        setRegistros={setRegistros}
      />
    </Box>
  );
}

function AlterarSelecionadosModal({
  show = false, // false, solicitar
  setShow = () => null,
  getData = () => null,
  registros = [],
  setRegistros = () => null,
}) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const classes = useStyles();

  function handleClose() {
    setShow(false);
    setPassword("");
  }

  const message = () => {
    switch (show) {
      case "solicitar":
        return "solicitar segunda via";
      default:
        return "erro";
    }
  };

  async function handleSubmit() {
    setLoading(true);
    try {
      if (show === "solicitar") {
        await postSegundaViaSolicitar(token, password, registros);
      }
      toast.success(`Sucesso ao ${message()}!`);
      getData(token);
      setRegistros([]);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error(
        `Ocorreu um erro ao ${message()}. Tente novamente mais tarde`,
      );
    }
    setLoading(false);
  }

  function chooseText() {
    if (!registros?.length || registros?.length < 1)
      return `Você gostaria de ${message()} de todos os cartões filtrados?`;
    if (registros?.length === 1)
      return `Você gostaria de ${message()} de 1 cartão selecionado?`;
    if (registros?.length > 1)
      return `Você gostaria de ${message()} de ${
        registros?.length
      } cartões selecionados?`;
  }

  return (
    <Modal open={!!show} onClose={handleClose}>
      <Box className={classes.modal}>
        <Box className={classes.closeModalButton} onClick={handleClose}>
          <Close />
        </Box>

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
              textTransform: "initial",
            }}
          >
            {message().charAt(0).toLocaleUpperCase() + message().substring(1)}
          </Typography>

          <Typography style={{ marginBottom: "30px" }}>
            {chooseText()}
          </Typography>

          {show === "solicitar" && (
            <>
              <Typography>Digite sua senha para confirmar.</Typography>
              <TextField
                fullWidth
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                required
                type="password"
              />
            </>
          )}

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Continuar
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
