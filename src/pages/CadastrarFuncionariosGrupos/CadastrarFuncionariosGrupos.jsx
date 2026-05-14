import {
  Box,
  FormHelperText,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import moment from "moment";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getFuncionarioAction,
  loadUserData,
  postBuscarContaFuncionarioCPFAction,
  postFuncionarioAction,
  postFuncionarioGrupoAction,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomEmployeeCard from "../../components/CustomEmployeeCard/CustomEmployeeCard";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

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
    marginTop: "30px",
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
  disabled: {
    padding: 3,
    backgroundColor: APP_CONFIG.mainCollors.disabledTextfields,
    color: "black",
  },
}));
export default function CadastrarFuncionariosGrupos() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
    day: " ",
    order: "",
    mostrar: "",
    tipo: "",
  });
  const debouncedId = useDebounce(filters.id, 800);
  const userData = useSelector((state) => state.userData);
  const verificarCPF = useSelector((state) => state.verificarCPF);
  const listaFuncionarios = useSelector((state) => state.funcionarios);
  const [page, setPage] = useState(1);
  const [hoveredCards, setHoveredCards] = useState(null);
  const [selectedCard, setSelectedCard] = useState(0);
  const [dadosFuncionario, setDadosFuncionario] = useState({
    documento: "",
    nome: "",
    conta: "",
    agencia: "",
    conta_sem_digito: "",
    digito_conta: "",
    email: "",
    celular: "",
    id: "",
  });

  const [dadosGrupo, setDadosGrupo] = useState({
    nome: "",
    descricao: "",
  });
  const [errors, setErrors] = useState({});

  const cards = [
    { icon: "personAdd", title: "Novo funcionário" },
    { icon: "groupAdd", title: "Novo grupo de funcionários" },
  ];
  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleBuscarContaCPF = async (e) => {
    const resBuscarCPF = await dispatch(
      postBuscarContaFuncionarioCPFAction(dadosFuncionario.documento),
    );
    if (resBuscarCPF === false) {
      console.log(resBuscarCPF);
      toast.error("Conta não identificada");
      setErrors(resBuscarCPF);
      setDadosFuncionario({
        ...dadosFuncionario,
        /* documento: resBuscarCPF.documento, */
        nome: "",
        conta: "",
        email: "",
        celular: "",
        id: "",
      });
    } else {
      console.log(resBuscarCPF);
      setDadosFuncionario({
        ...dadosFuncionario,
        /* documento: resBuscarCPF.documento, */
        nome: resBuscarCPF.nome,
        conta: `${resBuscarCPF.agencia}, ${resBuscarCPF.conta}-${resBuscarCPF.digito_conta}`,
        email: resBuscarCPF.email,
        celular: resBuscarCPF.celular,
        id: resBuscarCPF.id,
      });
    }
  };

  const handleCreateEmployee = async () => {
    if (selectedCard === 0) {
      const resCreateFuncionario = await dispatch(
        postFuncionarioAction(token, dadosFuncionario.id, ""),
      );
      if (resCreateFuncionario) {
        toast.error("Falha ao criar funcionário");
        setErrors(resCreateFuncionario);
      } else {
        toast.success("Funcionário criado com sucesso");
        setDadosFuncionario({
          ...dadosFuncionario,
          documento: "",
          nome: "",
          conta: "",
          email: "",
          celular: "",
          id: "",
        });
      }
    }
    if (selectedCard === 1) {
      const resCreateGrupo = await dispatch(
        postFuncionarioGrupoAction(
          token,
          dadosGrupo.nome,
          dadosGrupo.descricao,
        ),
      );
      if (resCreateGrupo) {
        toast.error("Falha ao criar grupo");
        setErrors(resCreateGrupo);
      } else {
        toast.success("Grupo criado com sucesso");
        setDadosGrupo({ ...dadosGrupo, nome: "", descricao: "" });
      }
    }
  };

  useEffect(() => {
    dispatch(getFuncionarioAction(token));
  }, [token]);

  /* 
	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []); */

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "50px",
            marginLeft: "50px",
          }}
          component={Link}
          onClick={() => history.goBack()}
        >
          <ArrowBackIosIcon
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontSize: "30px",
            }}
          />
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,

              marginLeft: "15px",
            }}
          >
            Cadastrar novos funcionários
          </Typography>
        </Box>
        {/* {token && userData === '' ? (
					<CustomBreadcrumbs
						path1="Cadastrar novos funcionários"
						to1="goBack"
						path2="Cadastrar novos funcionários"
					/>
				) : (
					<CustomBreadcrumbs path1="Cadastrar novos funcionários" />
				)} */}
        {/* <CustomHeader
					pageTitle="Folha de Pagamento"					
					isSearchVisible={true}
				/> */}

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
                width: "90%",
              }}
            >
              <Box
                display="flex"
                style={{
                  marginTop: "10px",
                  marginBottom: "16px",
                  margin: 30,
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "16px",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "10px",
                    marginLeft: "40px",
                  }}
                >
                  O que você deseja cadastrar?
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  marginLeft: "40px",
                  marginBottom: "50px",
                }}
              >
                {cards.map((item, index) => (
                  <Box
                    onMouseOver={() => setHoveredCards(index)}
                    onMouseLeave={() => setHoveredCards(null)}
                    onClick={() => {
                      setSelectedCard(index === selectedCard ? null : index);
                    }}
                  >
                    <CustomEmployeeCard
                      cardStyle={
                        index === selectedCard
                          ? true
                          : index === hoveredCards
                            ? true
                            : false
                      }
                      icon={item.icon}
                      title={item.title}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                marginTop: "10px",
                borderRadius: "17px",
                flexDirection: "column",
                width: "90%",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "10px",
                  marginBottom: "16px",
                  margin: 30,
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "16px",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "10px",
                    marginLeft: "40px",
                  }}
                >
                  Digitar dados dos funcionários para cadastro
                </Typography>
                <Box
                  style={{
                    alignSelf: "center",
                    marginTop: "10px",
                    width: "99%",
                    height: "1px",
                    backgroundColor: APP_CONFIG.mainCollors.primary,
                  }}
                />
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "10px",
                    marginLeft: "40px",
                  }}
                >
                  Digite os dados dos funcionários que você deseja cadastrar.
                  Você pode incluir até 80 funcionários por vez.
                </Typography>
              </Box>
              {selectedCard === 0 ? (
                <Box
                  style={{
                    marginTop: "40px",
                    display: "flex",
                    marginLeft: "40px",
                    marginBottom: "50px",
                    justifyContent: "space-around",
                  }}
                >
                  <InputMask
                    onBlur={() => handleBuscarContaCPF()}
                    maskChar=" "
                    mask={"999.999.999-99"}
                    value={dadosFuncionario.documento}
                    onChange={(e) => {
                      setDadosFuncionario({
                        ...dadosFuncionario,
                        documento: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        label="CPF"
                        error={errors.documento}
                        helperText={
                          errors.documento ? errors.documento.join(" ") : null
                        }
                      />
                    )}
                  </InputMask>

                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    InputProps={{
                      classes: {
                        disabled: classes.disabled,
                      },
                    }}
                    variant="outlined"
                    label="Agência, conta e dígito"
                    value={dadosFuncionario.conta}
                    /*
									error={errorsEtapa2.documento}
									helperText={
										errorsEtapa2.documento
											? errorsEtapa2.documento.join(' ')
											: null
									}
									onChange={(e) =>
										setDadosEtapa2({
											...dadosEtapa2,
											documento: e.target.value,
										})
									} */
                  />
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    InputProps={{
                      classes: {
                        disabled: classes.disabled,
                      },
                    }}
                    variant="outlined"
                    label="Nome do funcionário"
                    value={dadosFuncionario.nome}
                    /*
									error={errorsEtapa2.documento}
									helperText={
										errorsEtapa2.documento
											? errorsEtapa2.documento.join(' ')
											: null
									}
									onChange={(e) =>
										setDadosEtapa2({
											...dadosEtapa2,
											documento: e.target.value,
										})
									} */
                  />
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    InputProps={{
                      classes: {
                        disabled: classes.disabled,
                      },
                    }}
                    variant="outlined"
                    label="E-mail (opcional)"
                    value={dadosFuncionario.email}
                    /*error={errorsEtapa2.documento}
									helperText={
										errorsEtapa2.documento
											? errorsEtapa2.documento.join(' ')
											: null
									}
									onChange={(e) =>
										setDadosEtapa2({
											...dadosEtapa2,
											documento: e.target.value,
										})
									} */
                  />
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    InputProps={{
                      classes: {
                        disabled: classes.disabled,
                      },
                    }}
                    variant="outlined"
                    label="Celular (opcional)"
                    value={dadosFuncionario.celular}
                    /*error={errorsEtapa2.documento}
									helperText={
										errorsEtapa2.documento
											? errorsEtapa2.documento.join(' ')
											: null
									}
									onChange={(e) =>
										setDadosEtapa2({
											...dadosEtapa2,
											documento: e.target.value,
										})
									} */
                  />
                </Box>
              ) : selectedCard === 1 ? (
                <Box
                  style={{
                    marginTop: "40px",
                    display: "flex",
                    marginLeft: "70px",
                    marginBottom: "50px",
                  }}
                >
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    label="Nome"
                    value={dadosGrupo.nome}
                    onChange={(e) =>
                      setDadosGrupo({
                        ...dadosGrupo,
                        nome: e.target.value,
                      })
                    }
                    error={errors.nome}
                    helperText={errors.nome ? errors.nome.join(" ") : null}
                  />
                  <TextField
                    style={{ marginLeft: "50px" }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    label="Descrição"
                    value={dadosGrupo.descricao}
                    onChange={(e) =>
                      setDadosGrupo({
                        ...dadosGrupo,
                        descricao: e.target.value,
                      })
                    }
                    /*
									error={errorsEtapa2.documento}
									helperText={
										errorsEtapa2.documento
											? errorsEtapa2.documento.join(' ')
											: null
									}*/
                  />
                </Box>
              ) : null}

              <Box style={{ display: "flex", alignSelf: "center" }}>
                {errors.conta_funcionario_id ? (
                  <FormHelperText
                    style={{
                      fontSize: 14,
                      textAlign: "center",
                      fontFamily: "Montserrat-Regular",
                      color: "red",
                    }}
                  >
                    {errors.conta_funcionario_id.join(" ")}
                  </FormHelperText>
                ) : null}
              </Box>
              <Box
                style={{
                  marginTop: "40px",
                  display: "flex",
                  marginLeft: "40px",
                  marginBottom: "50px",
                  justifyContent: "space-between",
                  marginRight: "25px",
                }}
              >
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      fontSize: "14px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "10px",
                      marginLeft: "40px",
                    }}
                  >
                    Quantidade
                  </Typography>

                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "10px",
                      marginLeft: "40px",
                    }}
                  >
                    {listaFuncionarios && listaFuncionarios.data ? (
                      <>{listaFuncionarios.to} / 80</>
                    ) : (
                      "0/80"
                    )}
                  </Typography>
                </Box>
                {selectedCard != null ? (
                  <CustomButton
                    color="purple"
                    onClick={() => handleCreateEmployee()}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      {selectedCard === 0
                        ? "+ OUTRO FUNCIONÁRIO"
                        : selectedCard === 1
                          ? "+ OUTRO GRUPO"
                          : null}
                    </Typography>
                  </CustomButton>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
