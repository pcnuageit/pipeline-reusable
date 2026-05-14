import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  LinearProgress,
  makeStyles,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { loadPagadorId, postLinkPagamentos } from "../../actions/actions";

import CurrencyInput from "react-currency-input";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { loadPagadoresFilter } from "../../actions/actions";

import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    borderRadius: "27px",
    padding: "24px",
    margin: "18px 8px 8px 8px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  assignBuyer: {
    padding: "8px",
    margin: "8px",
  },
  paymentLinkData: {
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    margin: "8px",
  },
}));

const NovoLinkPagamento = () => {
  const classes = useStyles();
  const token = useAuth();
  const [linkPagamento, setLinkPagamento] = useState({
    valor: "",
    limite_parcelas: "",
    vencimento: "",
    quantidade_utilizacoes: "",
    senha: "",
    numero_pedido: "",
    descricao: "",
    pagador_id: "",
  });
  const [errosLink, setErrosLink] = useState({});
  const [atribuirComprador, setAtribuirComprador] = useState(false);
  const [linkPrivado, setLinkPrivado] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleCancelar = () => {
    history.push("/dashboard/adquirencia/acao/link-de-pagamento");
  };

  const [pagadorFilter, setPagadorFilter] = useState({
    like: "",
    order: "",
    mostrar: 5,
  });

  const debouncedLike = useDebounce(pagadorFilter.like, 800);

  useEffect(() => {
    dispatch(loadPagadorId(token, linkPagamento.pagador_id));
  }, [linkPagamento.pagador_id]);

  const pagadorId = useSelector((state) => state.pagador);

  useEffect(() => {
    if (!atribuirComprador) {
      setLinkPagamento({ ...linkPagamento, pagador_id: "" });
    }
  }, [atribuirComprador]);

  useEffect(() => {
    dispatch(
      loadPagadoresFilter(
        token,
        undefined,
        debouncedLike,
        pagadorFilter.order,
        pagadorFilter.mostrar,
        undefined,
      ),
    );
  }, [pagadorFilter.order, pagadorFilter.mostrar, debouncedLike]);
  const pagadoresList = useSelector((state) => state.pagadores);

  const handlePublicar = async () => {
    setLoading(true);
    let newLinkPagamento = linkPagamento;
    const resLinkPagamento = await dispatch(
      postLinkPagamentos(token, newLinkPagamento),
    );
    if (resLinkPagamento) {
      toast.error("Erro ao cadastrar o link");
      setErrosLink(resLinkPagamento);
      setLoading(false);
    } else {
      toast.success("Link cadastrado com sucesso");
      history.push("/dashboard/adquirencia/acao/link-de-pagamento");
      setLoading(false);
    }
  };
  const columns = [
    { headerText: "Nome", key: "nome" },
    {
      headerText: "Documento",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "E-mail", key: "email" },
    {
      headerText: "Contato",
      key: "celular",
      CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
    },
    {
      headerText: "Atribuir",
      key: "id",
      CustomValue: (id) => {
        const handleAtribuir = () => {
          console.log(id);
          setLinkPagamento({ ...linkPagamento, pagador_id: id });
        };
        return (
          <CustomButton
            color="purple"
            style={{ width: "", height: "25px" }}
            onClick={() => handleAtribuir()}
          >
            Atribuir
          </CustomButton>
        );
      },
    },
  ];

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />
      <CustomHeader pageTitle="Novo Link de Pagamento" />

      <Paper className={classes.paper}>
        <Box className={classes.assignBuyer}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <FormGroup row>
                <Box style={{ display: "flex" }}>
                  <FormControlLabel
                    control={
                      <Switch
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        value={atribuirComprador}
                        onChange={() =>
                          setAtribuirComprador(!atribuirComprador)
                        }
                      />
                    }
                  />
                  <Typography
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Atribuir a um comprador?
                  </Typography>
                </Box>
              </FormGroup>
            </Grid>
            {atribuirComprador ? (
              <>
                <Grid item xs={12} sm={10}>
                  <TextField
                    variant="outlined"
                    value={pagadorFilter.like}
                    onChange={(e) =>
                      setPagadorFilter({
                        ...pagadorFilter,
                        like: e.target.value,
                      })
                    }
                    fullWidth
                    label="Pesquisar por Nome, CPF ou CNPJ ..."
                  />
                </Grid>
                <Grid xs={12}>
                  {pagadoresList.data ? (
                    <Box display="flex" flexDirection="column">
                      <CustomTable
                        columns={columns}
                        data={pagadoresList.data}
                        compacta="true"
                      />
                      <Grid style={{ marginTop: "12px" }} container spacing={3}>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            label="Nome"
                            value={pagadorId.nome}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            label="Documento"
                            value={pagadorId.documento}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            label="E-mail"
                            value={pagadorId.email}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            label="Contato"
                            value={pagadorId.celular}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <LinearProgress />
                  )}
                </Grid>
              </>
            ) : null}
          </Grid>
        </Box>
      </Paper>
      <Paper className={classes.paper}>
        <Box className={classes.paymentLinkData}>
          <Typography
            variant="h6"
            style={{
              color: APP_CONFIG.mainCollors.primary,
              marginBottom: "12px",
            }}
          >
            Dados do link de pagamento
          </Typography>
          <Typography
            variant="overline"
            style={{
              color: APP_CONFIG.mainCollors.primary,
              marginBottom: "12px",
            }}
          >
            <b>Todos os campos são obrigatórios</b>
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontSize: "12px",
            }}
          >
            Valor do Link
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <FormControl error={errosLink.valor}>
                <CurrencyInput
                  style={{
                    marginBottom: "6px",

                    alignSelf: "center",
                    textAlign: "center",
                    height: 45,
                    fontSize: 17,

                    borderRadius: 27,
                    border: "0.01em solid",
                    color: APP_CONFIG.mainCollors.primary,
                    backgroundColor: "transparent",
                    fontFamily: "Montserrat-Regular",

                    "&::placeholder": {
                      color: APP_CONFIG.mainCollors.primary,
                    },
                  }}
                  decimalSeparator=","
                  thousandSeparator="."
                  prefix="R$ "
                  label="Valor Mensal"
                  placeHolder="R$0,00"
                  value={linkPagamento.valor}
                  onChangeEvent={(event, maskedvalue, floatvalue) =>
                    setLinkPagamento({
                      ...linkPagamento,
                      valor: floatvalue,
                    })
                  }
                />
                {errosLink.valor ? (
                  <FormHelperText>{errosLink.valor.join(" ")}</FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                variant="outlined"
                error={errosLink.limite_parcelas}
                helperText={
                  errosLink.limite_parcelas
                    ? errosLink.limite_parcelas.join(" ")
                    : null
                }
                value={linkPagamento.limite_parcelas}
                onChange={(e) => {
                  setLinkPagamento({
                    ...linkPagamento,
                    limite_parcelas: e.target.value,
                  });
                }}
                fullWidth
                required
                label="Limite de Parcelas"
                type="number"
                inputProps={{
                  min: "0",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                variant="outlined"
                error={errosLink.vencimento}
                helperText={
                  errosLink.vencimento ? errosLink.vencimento.join(" ") : null
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
                }}
                type="date"
                label="Data de Vencimento"
                value={linkPagamento.vencimento}
                onChange={(e) =>
                  setLinkPagamento({
                    ...linkPagamento,
                    vencimento: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                variant="outlined"
                error={errosLink.quantidade_utilizacoes}
                helperText={
                  errosLink.quantidade_utilizacoes
                    ? errosLink.quantidade_utilizacoes.join(" ")
                    : null
                }
                value={linkPagamento.quantidade_utilizacoes}
                onChange={(e) => {
                  setLinkPagamento({
                    ...linkPagamento,
                    quantidade_utilizacoes: e.target.value,
                  });
                }}
                fullWidth
                required
                label="Qtde de utilizações"
                type="number"
                inputProps={{
                  min: "0",
                }}
              />
            </Grid>
          </Grid>
          <FormGroup row style={{ marginTop: "12px" }}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Switch
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    value={linkPrivado}
                    onChange={() => setLinkPrivado(!linkPrivado)}
                  />
                }
              />
              <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                Link Privado
              </Typography>
            </Box>
          </FormGroup>
          {linkPrivado ? (
            <TextField
              variant="outlined"
              value={linkPagamento.senha}
              onChange={(e) =>
                setLinkPagamento({
                  ...linkPagamento,
                  senha: e.target.value,
                })
              }
              label="Código de acesso"
            />
          ) : null}
        </Box>

        <Box className={classes.paymentLinkData}>
          <Typography
            variant="h6"
            style={{ color: APP_CONFIG.mainCollors.primary }}
          >
            Dados do produto/Serviço
          </Typography>
          <Grid container spacing={3} style={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                value={linkPagamento.numero_pedido}
                onChange={(e) => {
                  setLinkPagamento({
                    ...linkPagamento,
                    numero_pedido: e.target.value,
                  });
                }}
                fullWidth
                label="N° do pedido"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                error={errosLink.descricao}
                helperText={
                  errosLink.descricao ? errosLink.descricao.join(" ") : null
                }
                value={linkPagamento.descricao}
                onChange={(e) => {
                  setLinkPagamento({
                    ...linkPagamento,
                    descricao: e.target.value,
                  });
                }}
                fullWidth
                label="Descrição"
              />
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" justifyContent="flex-end" marginTop="12px">
          <Box marginRight="16px">
            <Button
              color="purple"
              variant="outlined"
              style={{ borderRadius: "27px" }}
              onClick={handleCancelar}
            >
              Cancelar
            </Button>
          </Box>
          <Box>
            <CustomButton color="purple" onClick={handlePublicar}>
              <Typography>Publicar Link</Typography>
            </CustomButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NovoLinkPagamento;
