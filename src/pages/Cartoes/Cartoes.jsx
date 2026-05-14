import {
  Box,
  Button,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  getCartaoHistoricoTransacaoAction,
  loadUserData,
  postStatusCartaoPre,
} from "../../actions/actions";
import CartaoPre from "../../components/CartaoPre/CartaoPre";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import ModalAtivarCartao from "../../components/ModalAtivarCartao/ModalAtivarCartao";
import ModalBloquearDesbloquearCartao from "../../components/ModalBloquearDesbloquearCartao/ModalBloquearDesbloquearCartao";
import ModalCancelarCartao from "../../components/ModalCancelarCartao/ModalCancelarCartao";
import ModalEditarSenhaCartao from "../../components/ModalEditarSenhaCartao/ModalEditarSenhaCartao";
import ModalPrimeiraSenhaCartao from "../../components/ModalPrimeiraSenhaCartao/ModalPrimeiraSenhaCartao";
import OpcaoCartao from "../../components/OpcaoCartao/OpcaoCartao";
import StepperCartaoPre from "../../components/StepperCartaoPre/StepperCartaoPre";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import {
  getListaCartoes,
  postConfirmarCartao,
  postSolicitarCartao,
} from "../../services/services";

moment.locale();

const Cartoes = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigation = useHistory();
  const userData = useSelector((state) => state.userData);
  const updater = useSelector((state) => state.atualizarView);
  const cartaoHistoricoTransacao = useSelector(
    (state) => state.cartaoHistoricoTransacao,
  );
  const token = useAuth();
  const [box2status, setBox2status] = useState(null);
  const [cartaoAtual, setCartaoAtual] = useState(null);
  const [indexCartaoSelecionando, setIndexCartaoSelecionando] = useState(null);
  const [cartoes, setCartoes] = useState([]);
  //modais
  const [modalAtivarCartao, setModalAtivarCartao] = useState(false);
  const [modalPrimeiraSenha, setModalPrimeiraSenha] = useState(false);
  const [modalEditarSenha, setModalEditarSenha] = useState(false);
  const [modalBloquearDesbloquearCartao, setModalBloquearDesbloquearCartao] =
    useState(false);
  const [modalCancelarCartao, setModalCancelarCartao] = useState(false);
  const [page, setPage] = useState(1);
  const [tipoCard, setTipoCard] = useState(1);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const columns = [
    {
      headerText: "Data",
      key: "created_at",
      CustomValue: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <FontAwesomeIcon icon={faCalendarAlt} size="lg" /> */}
            <Typography style={{ marginLeft: "6px" }}>
              {moment.utc(data).format("DD MMMM")}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Tipo",
      key: "tipo",
      CustomValue: (tipo) => {
        return (
          <>
            {tipo === 1
              ? "Compra"
              : tipo === 2
                ? "Saque"
                : tipo === 3
                  ? "Estorno"
                  : null}
          </>
        );
      },
    },
    {
      headerText: "Nome",
      key: "response.Establishment.Name",
      CustomValue: (value) => {
        return <>{value}</>;
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
  ];

  useEffect(() => {
    (async () => {
      await carregarDadosIniciais();
      /* console.log('recarregou'); */
    })();
  }, [token, updater]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, []);

  useEffect(() => {
    dispatch(getCartaoHistoricoTransacaoAction(token, page));
  }, [token]);

  function handleModalCancelarCartao() {
    setModalCancelarCartao(!modalCancelarCartao);
  }
  function handleModalBloquearDesbloquearCartao() {
    setModalBloquearDesbloquearCartao(!modalBloquearDesbloquearCartao);
  }

  function handleModalEditarSenha() {
    setModalEditarSenha(!modalEditarSenha);
  }

  function handleModalPrimeiraSenha() {
    setModalPrimeiraSenha(!modalPrimeiraSenha);
  }

  function handleModalAtivarCartao() {
    setModalAtivarCartao(!modalAtivarCartao);
  }

  function editarPerfil() {
    navigation.push("/dashboard/conta-digital");
  }

  async function novoCartao() {
    //if (cartoes.length < 3) {
    setBox2status("enderecoEntrega");
    // } else {
    //   toast.error("Seu limite de cartões é 3");
    // }
  }

  async function carregarDadosIniciais() {
    await carregarListaCartoes();
  }

  async function carregarListaCartoes() {
    const resCartoes = await getListaCartoes(token);
    console.log(resCartoes);
    setCartoes(resCartoes.data);
  }

  async function solicitarCartao() {
    try {
      const idCartaoNovo = await postSolicitarCartao(token, tipoCard);
      /* console.log(idCartaoNovo); */
      await carregarListaCartoes();
      toast.success("Cartão solicitado com sucesso!");
      setBox2status(null);
    } catch (err) {
      toast.error("Erro ao solicitar o cartão");
    }
  }

  async function confirmarCartao(id) {
    try {
      const res = await postConfirmarCartao(token, id);
      /* console.log(res); */
      toast.success("Cartão confirmado, estamos lhe enviando seu cartão!");
      await carregarListaCartoes();
    } catch (err) {
      toast.error("Erro ao confirmar cartão, tente novamente");
    }
  }

  async function visualizarCartao(cartao, index) {
    setCartaoAtual(cartao);
    setIndexCartaoSelecionando(index);
    try {
      const data = await dispatch(postStatusCartaoPre(token, cartao.id));
      //console.log(cartao);
      if (data.status == "0") {
        console.log("status 0");
        setBox2status("statusCartao");
        return;
      }

      //const { data } = await postCartaoStatus(token, cartao.id);
      if (data != false) {
        if (cartao?.response?.card_type != "VIRTUAL") {
          setBox2status("statusCartao");
        } else {
          setBox2status("listaTransacoes");
        }
      } else {
        if (cartao?.response?.card_type == "VIRTUAL")
          toast.error("Erro ao coletar status.");
      }
    } catch (err) {
      console.log(err);
    }
  }
  const Editar = (row) => {
    return <></>;
  };

  console.log(cartaoAtual);

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="CARTÕES" />
        <Box className={classes.content}>
          <Box className={classes.box1}>
            <Typography className={classes.title}>Meus cartões</Typography>
            <Box className={classes.box1Content}>
              <Box className={classes.naoPossueCartoes}>
                <Button
                  variant="outlined"
                  className={classes.botaoNovoCartao}
                  onClick={novoCartao}
                >
                  <AddIcon
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  />
                </Button>
                {cartoes.length <= 0 ? (
                  <Box className={classes.sessaoNovoCartao}>
                    <Typography className={classes.naoPossueCartoesTitulo}>
                      Você ainda não possui nenhum cartão na sua conta.
                      <br />
                      Deseja solicitar ?
                    </Typography>
                    <Typography className={classes.naoPossueCartoesSubtitulo}>
                      Com este cartão, você pode pagar em lojas físicas
                      <br /> e sacar dinheiro.
                    </Typography>
                    <CustomButton color="purple" variant="contained">
                      <Typography
                        onClick={() => {
                          setBox2status("enderecoEntrega");
                        }}
                        className={classes.textobotaoNovoCartao}
                      >
                        QUERO O MEU CARTÃO
                      </Typography>
                    </CustomButton>
                  </Box>
                ) : (
                  <Box className={classes.sessaoCartoes}>
                    {cartoes.map((cartao, index) => (
                      <CartaoPre
                        key={index}
                        index={index}
                        dados={cartao}
                        desativado={indexCartaoSelecionando === index}
                        visualizarCartao={visualizarCartao}
                      />
                    ))}
                  </Box>
                )}
              </Box>
              <Box className={classes.opcoesCartao}>
                {cartaoAtual?.response?.card_type != "VIRTUAL" ? (
                  <OpcaoCartao
                    icone="ativar"
                    funcao={handleModalAtivarCartao}
                    cartao={cartaoAtual}
                    texto={`Ativar cartão`}
                  />
                ) : null}
                {cartaoAtual?.response?.status != "CREATED" ? (
                  <OpcaoCartao
                    icone="cancelar"
                    funcao={handleModalCancelarCartao}
                    cartao={cartaoAtual}
                    texto={`Solicitar o cancelamento`}
                  />
                ) : null}
                {cartaoAtual?.response?.card_type != "VIRTUAL" &&
                cartaoAtual?.response?.status != "CREATED" ? (
                  <OpcaoCartao
                    icone="senha"
                    funcao={handleModalEditarSenha}
                    cartao={cartaoAtual}
                    texto={`Alterar senha`}
                  />
                ) : null}
                {cartaoAtual?.response?.status != "CREATED" ? (
                  <OpcaoCartao
                    icone="bloquear"
                    funcao={handleModalBloquearDesbloquearCartao}
                    cartao={cartaoAtual}
                    texto={`Bloquear/ Desbloquear`}
                  />
                ) : null}
              </Box>
            </Box>
          </Box>
          {box2status == "enderecoEntrega" ? (
            <Box className={classes.box2}>
              <Box className={classes.enderecos}>
                <Typography className={classes.titleEnderecos}>
                  Escolha onde quer receber o cartão
                </Typography>
                <Typography className={classes.subtituloEnderecos}>
                  Com este cartão, você pode pagar em lojas físicas e sacar
                  dinheiro.
                </Typography>
                {userData.endereco && (
                  <Box className={classes.cartaoEndereco}>
                    <Box className={classes.cartaoHeader}>
                      <Typography className={classes.cartaoHeaderTitle}>
                        {userData.endereco.rua}
                      </Typography>
                      <Typography
                        onClick={() => {
                          editarPerfil();
                        }}
                        className={classes.cartaoHeaderEditar}
                      >
                        Editar
                      </Typography>
                    </Box>
                    <Typography className={classes.cartaoEnderecoDados}>
                      Rua: {userData.endereco.rua}, Bairro:{" "}
                      {userData.endereco.bairro}, Número:{" "}
                      {userData.endereco.numero}, Cidade:{" "}
                      {userData.endereco.cidade}
                    </Typography>
                  </Box>
                )}

                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={tipoCard}
                  onChange={(e) => {
                    setTipoCard(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="virtual"
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    control={<Radio color={"primary"} />}
                    label="Cartão virtual"
                  />
                  <FormControlLabel
                    value="fisico"
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                    control={<Radio color={"primary"} />}
                    label="Cartão físico"
                  />
                </RadioGroup>
                <Button variant="outlined" className={classes.botaoPedirCartao}>
                  <Typography
                    onClick={solicitarCartao}
                    className={classes.textoBotaoPedirCartao}
                  >
                    PEDIR O MEU CARTÃO
                  </Typography>
                </Button>
                <Box className={classes.separador}></Box>
                <Typography className={classes.termos}>
                  Ao pedir o cartão, você aceita os
                  <Typography className={classes.termosLink}>
                    {" "}
                    Termos e condições
                  </Typography>
                </Typography>
              </Box>
            </Box>
          ) : box2status == "statusCartao" ? (
            <Box className={classes.box2}>
              <Box className={classes.etapasCartaoInfo}>
                <Box>
                  <Typography className={classes.titleEnderecos}>
                    Cartão fisico a caminho!
                  </Typography>
                  <Typography className={classes.subtituloEnderecos}>
                    Seu cartão chegará em breve
                  </Typography>
                </Box>
                <Box>
                  <Typography className={classes.titleEnderecos}>
                    Endereço de entrega
                  </Typography>
                  {userData.endereco && (
                    <Typography className={classes.subtituloEnderecos}>
                      Rua: {userData.endereco.rua}, Bairro:{" "}
                      {userData.endereco.bairro},
                      <br />
                      Número: {userData.endereco.numero}, Cidade:{" "}
                      {userData.endereco.cidade}
                    </Typography>
                  )}
                </Box>
              </Box>
              <StepperCartaoPre
                cartao={cartaoAtual}
                confirmarCartao={confirmarCartao}
              />
            </Box>
          ) : box2status == "listaTransacoes" ? (
            <>
              <Box className={classes.box2}>
                <Box className={classes.etapasCartaoInfo}>
                  <Typography className={classes.titleEnderecos}>
                    Histórico de transações
                  </Typography>
                </Box>
                {cartaoHistoricoTransacao &&
                cartaoHistoricoTransacao.data.length > 0 ? (
                  <>
                    <Box style={{ marginTop: "10px" }}>
                      <CustomTable
                        columns={columns ? columns : null}
                        data={cartaoHistoricoTransacao.data}
                        Editar={Editar}
                      />
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
                        count={cartaoHistoricoTransacao.last_page}
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
                  <LinearProgress />
                )}
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <ModalCancelarCartao
        cartao={cartaoAtual}
        closeModal={handleModalCancelarCartao}
        isOpen={modalCancelarCartao}
      />
      <ModalBloquearDesbloquearCartao
        cartao={cartaoAtual}
        closeModal={handleModalBloquearDesbloquearCartao}
        isOpen={modalBloquearDesbloquearCartao}
      />
      <ModalEditarSenhaCartao
        cartao={cartaoAtual}
        closeModal={handleModalEditarSenha}
        isOpen={modalEditarSenha}
      />
      <ModalPrimeiraSenhaCartao
        cartao={cartaoAtual}
        closeModal={handleModalPrimeiraSenha}
        isOpen={modalPrimeiraSenha}
      />
      <ModalAtivarCartao
        cartao={cartaoAtual}
        closeModal={handleModalAtivarCartao}
        isOpen={modalAtivarCartao}
        abrirModalSenha={handleModalPrimeiraSenha}
      />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  separador: {
    width: "100%",
    height: 1,
    background: APP_CONFIG.mainCollors.disabledTextfields,
  },
  etapasCartaoInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  termos: {
    fontSize: 12,
    color: APP_CONFIG.mainCollors.primary,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    marginTop: 20,
  },
  termosLink: {
    fontSize: 12,
    color: "#0fc737",
    cursor: "pointer",
  },
  botaoPedirCartao: {
    fontSize: "14px",
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-Extralight",
    padding: 10,
    borderColor: APP_CONFIG.mainCollors.primary,
    marginBottom: 30,
    borderRadius: 27,
    marginTop: 30,
  },
  enderecos: {
    display: "flex",
    maxWidth: 400,
    flexDirection: "column",
    alignItems: "center",
  },
  textoBotaoPedirCartao: {
    fontSize: 12,
    fontWeight: 300,
    paddingInline: 10,
  },
  cartaoEndereco: {
    maxWidth: 400,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: APP_CONFIG.mainCollors.primary,
    padding: 10,
  },
  cartaoHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleEnderecos: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    marginBottom: 5,
  },
  cartaoHeaderTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  cartaoHeaderEditar: {
    color: "#0fc737",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    cursor: "pointer",
  },
  subtituloEnderecos: {
    color: APP_CONFIG.mainCollors.disabledTextfields,
    fontSize: 12,
    marginBottom: 30,
  },
  cartaoEnderecoDados: {
    color: APP_CONFIG.mainCollors.disabledTextfields,
    fontSize: 14,
    paddingBottom: 10,
    paddingTop: 10,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: 35,
  },
  box1: {
    width: "100%",
    height: 330,
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    marginBottom: 15,
    borderRadius: 17,
    padding: 30,
  },
  box1Content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  novoCartao: {},
  meusCartoes: {},
  opcoesCartao: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    alignItems: "center",
    borderLeft: 1,
    borderLeftStyle: "solid",
    borderLeftColor: APP_CONFIG.mainCollors.primary,
    paddingLeft: 50,
    paddingRight: 20,
  },
  naoPossueCartoes: {
    display: "flex",
    flexDirection: "row",
  },
  naoPossueCartoesTitulo: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    marginBottom: 5,
  },
  naoPossueCartoesSubtitulo: {
    color: APP_CONFIG.mainCollors.disabledTextfields,
    fontSize: 12,
    marginBottom: 70,
  },
  botaoNovoCartao: {
    width: 70,
    height: 70,
    borderColor: APP_CONFIG.mainCollors.primary,
    color: APP_CONFIG.mainCollors.primary,
    borderRadius: 15,
    marginRight: 50,
  },
  iconeBotaoNovoCartao: {
    width: 50,
    height: 50,
  },
  textobotaoNovoCartao: {
    fontSize: "14px",
    color: "white",
    fontFamily: "Montserrat-Regular",
  },
  sessaoNovoCartao: {
    display: "flex",
    flexDirection: "column",
  },
  sessaoCartoes: {
    display: "-webkit-box",
    gap: 20,
    overflow: "auto",
    maxWidth: "100%",
    minWidth: 200,
    height: 215,
  },
  box2: {
    width: "100%",

    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    borderRadius: 17,
    padding: 30,
  },
  title: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-Regular",
    fontSize: "18px",
  },
}));

export default Cartoes;
