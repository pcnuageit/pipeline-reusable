import {
  Box,
  makeStyles,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

import { getCep, postNovoPagador, putPagador } from "../../services/services";
import CustomButton from "../CustomButton/CustomButton";

import moment from "moment";
import InputMask from "react-input-mask";
import { loadPagadorId } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const useStyles = makeStyles((theme) => ({
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "10%",
    left: "25%",
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: "20px",
    color: APP_CONFIG.mainCollors.primary,
    fontWeight: "bold",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    color: APP_CONFIG.mainCollors.primary,
    fontWeight: "normal",
  },
}));

const NovoPagador = ({
  title,
  changePath,
  rowPagador,
  ListaPagadoresRoute,

  ...rest
}) => {
  const classes = useStyles();
  const { section, subsectionId } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [errosPagador, setErrosPagador] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maskType, setMaskType] = useState("cpf");
  const [dataNascimento, setDataNascimento] = useState("");
  const pagadorId = useSelector((state) => state.pagador);

  const [dadosPessoais, setDadosPessoais] = useState({
    documento: "",
    nome: "",
    celular: "",
    email: "",
  });

  const [dadosEndereco, setDadosEndereco] = useState({
    cep: "",
    rua: "",
    bairro: "",
    numero: null,
    complemento: "",
    cidade: "",
    estado: "",
  });

  const [novoPagador, setNovoPagador] = useState({
    documento: "",
    nome: "",
    celular: "",
    email: "",
    data_nascimento: "",
    endereco: {
      cep: "",
      rua: "",
      bairro: "",
      numero: null,
      complemento: "",
      cidade: "",
      estado: "",
    },
  });

  useEffect(() => {
    if (subsectionId) {
      dispatch(loadPagadorId(subsectionId));
    }
  }, [subsectionId]);

  useEffect(() => {
    if (rowPagador) {
      setNovoPagador(rowPagador);
    }
    if (subsectionId) {
      setNovoPagador(pagadorId);
    }
  }, [rowPagador]);

  const handleCep = async () => {
    setLoading(true);
    try {
      const response = await getCep(dadosEndereco.cep);
      if (rowPagador) {
        setNovoPagador({
          ...novoPagador,
          cep: response.data.cep,
          rua: response.data.logradouro,
          complemento: response.data.complemento,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          estado: response.data.uf,
        });
      } else {
        setDadosEndereco({
          ...dadosEndereco,
          cep: response.data.cep,
          rua: response.data.logradouro,
          complemento: response.data.complemento,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          estado: response.data.uf,
        });
      }

      setLoading(false);
    } catch (error) {
      toast.error("Dados inválidos");
      setLoading(false);
    }
  };

  function verificarTipoDocumento(doc) {
    let formatado = doc.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gi,
      "",
    );

    if (formatado.length <= 11) {
      if (maskType !== "cpf") {
        setMaskType("cpf");
      }
    } else {
      if (maskType !== "cnpj") {
        setMaskType("cnpj");
      }
    }
    if (rowPagador) {
      setNovoPagador({ ...novoPagador, documento: doc });
    } else {
      setDadosPessoais({
        ...dadosPessoais,
        documento: doc,
      });
    }
  }

  const handleModal = () => {
    if (rowPagador) {
      if (
        novoPagador.cep === "" ||
        novoPagador.rua === "" ||
        novoPagador.bairro === "" ||
        novoPagador.cidade === "" ||
        novoPagador.estado === "" ||
        novoPagador.celular === "" ||
        novoPagador.email === "" ||
        novoPagador.documento === "" ||
        novoPagador.data_nascimento === "" ||
        novoPagador.nome === ""
      ) {
        toast.error("Preencha todos os campos obrigatorios*");
      } else {
        setOpenModal(true);
      }
    } else if (
      dadosEndereco.cep === "" ||
      dadosEndereco.rua === "" ||
      dadosEndereco.bairro === "" ||
      dadosEndereco.cidade === "" ||
      dadosEndereco.estado === "" ||
      dadosPessoais.celular === "" ||
      dadosPessoais.email === "" ||
      dadosPessoais.documento === "" ||
      dadosPessoais.nome === ""
    ) {
      toast.error("Preencha todos os campos obrigatorios*");
    } else {
      setOpenModal(true);
    }
  };

  async function handleCadastrarPagador() {
    const dataNascimentoFormatada = moment
      .utc(dataNascimento)
      .format("YYYY-MM-DD");
    if (rowPagador) {
      try {
        setOpenModal(false);
        setLoading(true);
        await putPagador(token, novoPagador, rowPagador.id);
        setLoading(false);
        toast.success("Pagador editado com sucesso!");
        changePath("listaPagadores");
      } catch (err) {
        console.log(err.response);
        /* setErrosPagador(
						err.response && err.response.data && err.response.data.errors
							? err.response.data.errors
							: null
					); */
        setOpenModal(false);
        setLoading(false);
        //console.log(err.response.data.errors);
        toast.error(
          "Não foi possivel editar um novo pagador, verifique os dados e tente novamente.",
        );
      }
    } else {
      try {
        setOpenModal(false);
        setLoading(true);

        await postNovoPagador(
          token,
          dadosPessoais.documento,
          dadosPessoais.nome,
          dadosPessoais.celular,
          dataNascimentoFormatada,
          dadosPessoais.email,
          dadosEndereco.cep,
          dadosEndereco.rua,
          dadosEndereco.numero,
          dadosEndereco.complemento,
          dadosEndereco.bairro,
          dadosEndereco.cidade,
          dadosEndereco.estado,
        );

        setLoading(false);
        toast.success("Pagador cadastrato com sucesso!");
        changePath("listaPagadores");
      } catch (err) {
        console.log(err.response);
        setErrosPagador(
          err.response && err.response.data && err.response.data.errors
            ? err.response.data.errors
            : null,
        );
        setOpenModal(false);
        setLoading(false);
        //console.log(err.response.data.errors);
        toast.error(
          "Não foi possivel cadastrar um novo pagador, verifique os dados e tente novamente.",
        );
      }
    }
  }

  useEffect(() => {
    console.log(novoPagador);
  }, [novoPagador]);

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        Dados do pagador
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
          }}
        />

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            width: "90%",
            marginTop: "10px",
          }}
        >
          <Box style={{ marginTop: "30px", display: "flex", gap: 5 }}>
            <InputMask
              disabled={subsectionId ? true : false}
              value={
                rowPagador || subsectionId
                  ? novoPagador.documento
                  : dadosPessoais.documento
              }
              maskChar=" "
              mask={
                maskType === "cpf" ? "999.999.999-999" : "99.999.999/9999-99"
              }
              onChange={(e) => verificarTipoDocumento(e.target.value)}
            >
              {() => (
                <TextField
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  name="documento"
                  fullWidth
                  required
                  error={errosPagador.documento}
                  helperText={
                    errosPagador.documento
                      ? errosPagador.documento.join(" ")
                      : null
                  }
                  label={"CPF/CNPJ"}
                />
              )}
            </InputMask>
            <TextField
              disabled={subsectionId ? true : false}
              value={
                rowPagador || subsectionId
                  ? novoPagador.nome
                  : dadosPessoais.nome
              }
              variant="outlined"
              fullWidth
              error={errosPagador.nome}
              helperText={
                errosPagador.nome ? errosPagador.nome.join(" ") : null
              }
              label="Primeiro e segundo nome*"
              type="text"
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      nome: e.target.value,
                    })
                  : setDadosPessoais({
                      ...dadosPessoais,
                      nome: e.target.value,
                    });
              }}
            />
          </Box>
          <Box style={{ marginTop: "30px", display: "flex", gap: 5 }}>
            {/* <MuiPickersUtilsProvider locale={'br'} utils={MomentUtils}>
							<DatePicker
								label="Data de nascimento"
								required
								inputVariant="outlined"
								format="DD/MM/YYYY"
								disableFuture
								value={dataNascimento}
								onChange={() => setDataNascimento()}
								error={errosPagador.data_nascimento}
								helperText={
									errosPagador.data_nascimento
										? errosPagador.nome.join(' ')
										: null
								}
							/>
						</MuiPickersUtilsProvider> */}
            <TextField
              disabled={subsectionId ? true : false}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
                pattern: "d {4}- d {2}- d {2} ",
              }}
              type="date"
              label="Data de nascimento"
              value={
                rowPagador || subsectionId
                  ? novoPagador.data_nascimento
                  : dadosPessoais.data_nascimento
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      data_nascimento: e.target.value,
                    })
                  : setDataNascimento(e.target.value);
              }}
              error={errosPagador.data_nascimento}
              helperText={
                errosPagador && errosPagador.data_nascimento
                  ? errosPagador.data_nascimento.join(" ")
                  : null
              }
            />
            {/* 	{errosPagador && errosPagador.data_nascimento ? (
								<FormHelperText
									style={{
										fontSize: 14,
										textAlign: 'center',
										fontFamily: 'Montserrat-ExtraBold',
										color: 'red',
									}}
								>
									{errosPagador.token.join(' ')}
								</FormHelperText>
							) : null} */}

            <InputMask
              disabled={subsectionId ? true : false}
              maskChar=" "
              mask={"99999-999"}
              value={
                rowPagador || subsectionId
                  ? novoPagador.endereco?.cep
                  : dadosEndereco.cep
              }
              onBlur={handleCep}
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      endereco: {
                        ...novoPagador.endereco,
                        cep: e.target.value,
                      },
                    })
                  : setDadosEndereco({
                      ...dadosEndereco,
                      cep: e.target.value,
                    });
              }}
            >
              {(props) => (
                <TextField
                  {...props}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  name="CEP*"
                  error={errosPagador["endereco.cep"]}
                  helperText={
                    errosPagador["endereco.cep"]
                      ? errosPagador["endereco.cep"].join(" ")
                      : null
                  }
                  label={"CEP"}
                />
              )}
            </InputMask>

            <TextField
              disabled={subsectionId ? true : false}
              variant="outlined"
              label="Rua*"
              type="text"
              error={errosPagador["endereco.rua"]}
              helperText={
                errosPagador["endereco.rua"]
                  ? errosPagador["endereco.rua"].join(" ")
                  : null
              }
              value={
                rowPagador || subsectionId
                  ? novoPagador.endereco?.rua
                  : dadosEndereco.rua
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      endereco: {
                        ...novoPagador.endereco,
                        rua: e.target.value,
                      },
                    })
                  : setDadosEndereco({
                      ...dadosEndereco,
                      rua: e.target.value,
                    });
              }}
            />
          </Box>
          <Box
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <TextField
              disabled={subsectionId ? true : false}
              variant="outlined"
              label="Número"
              type="number"
              error={errosPagador["endereco.numero"]}
              helperText={
                errosPagador["endereco.numero"]
                  ? errosPagador["endereco.numero"].join(" ")
                  : null
              }
              value={
                rowPagador || subsectionId
                  ? novoPagador.endereco?.numero
                  : dadosEndereco.numero
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      endereco: {
                        ...novoPagador.endereco,
                        numero: e.target.value,
                      },
                    })
                  : setDadosEndereco({
                      ...dadosEndereco,
                      numero: e.target.value,
                    });
              }}
            />
            <TextField
              disabled={subsectionId ? true : false}
              variant="outlined"
              label="Bairro*"
              type="text"
              error={errosPagador["endereco.bairro"]}
              helperText={
                errosPagador["endereco.bairro"]
                  ? errosPagador["endereco.bairro"].join(" ")
                  : null
              }
              value={
                rowPagador || subsectionId
                  ? novoPagador.endereco?.bairro
                  : dadosEndereco.bairro
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      endereco: {
                        ...novoPagador.endereco,
                        bairro: e.target.value,
                      },
                    })
                  : setDadosEndereco({
                      ...dadosEndereco,
                      bairro: e.target.value,
                    });
              }}
            />
            <TextField
              disabled={subsectionId ? true : false}
              variant="outlined"
              label="Complemento"
              type="text"
              value={
                rowPagador || subsectionId
                  ? novoPagador.endereco?.complemento
                  : dadosEndereco.complemento
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      endereco: {
                        ...novoPagador.endereco,
                        complemento: e.target.value,
                      },
                    })
                  : setDadosEndereco({
                      ...dadosEndereco,
                      complemento: e.target.value,
                    });
              }}
            />
          </Box>
          <Box
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <TextField
              disabled={subsectionId ? true : false}
              variant="outlined"
              label="Cidade*"
              type="text"
              value={
                rowPagador || subsectionId
                  ? novoPagador.endereco?.cidade
                  : dadosEndereco.cidade
              }
              error={errosPagador["endereco.cidade"]}
              helperText={
                errosPagador["endereco.cidade"]
                  ? errosPagador["endereco.cidade"].join(" ")
                  : null
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      endereco: {
                        ...novoPagador.endereco,
                        cidade: e.target.value,
                      },
                    })
                  : setDadosEndereco({
                      ...dadosEndereco,
                      cidade: e.target.value,
                    });
              }}
            />
            <TextField
              disabled={subsectionId ? true : false}
              variant="outlined"
              label="Estado*"
              type="text"
              value={
                rowPagador || subsectionId
                  ? novoPagador.endereco?.estado
                  : dadosEndereco.estado
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      endereco: {
                        ...novoPagador.endereco,
                        estado: e.target.value,
                      },
                    })
                  : setDadosEndereco({
                      ...dadosEndereco,
                      estado: e.target.value,
                    });
              }}
              error={errosPagador["endereco.estado"]}
              helperText={
                errosPagador["endereco.estado"]
                  ? errosPagador["endereco.estado"].join(" ")
                  : null
              }
            />
            <InputMask
              disabled={subsectionId ? true : false}
              maskChar=" "
              mask={"(99) 9 9999-9999"}
              value={
                rowPagador || subsectionId
                  ? novoPagador.celular
                  : dadosPessoais.celular
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      celular: e.target.value,
                    })
                  : setDadosPessoais({
                      ...dadosPessoais,
                      celular: e.target.value,
                    });
              }}
            >
              {(props) => (
                <TextField
                  {...props}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  name="Celular"
                  label={"Celular*"}
                  error={errosPagador.celular}
                  helperText={
                    errosPagador.celular ? errosPagador.celular.join(" ") : null
                  }
                />
              )}
            </InputMask>
          </Box>
          <Box
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <TextField
              disabled={subsectionId ? true : false}
              fullWidth
              variant="outlined"
              label="E-mail*"
              type="email"
              value={
                rowPagador || subsectionId
                  ? novoPagador.email
                  : dadosPessoais.email
              }
              helperText={
                errosPagador.email ? errosPagador.email.join(" ") : null
              }
              onChange={(e) => {
                rowPagador
                  ? setNovoPagador({
                      ...novoPagador,
                      email: e.target.value,
                    })
                  : setDadosPessoais({
                      ...dadosPessoais,
                      email: e.target.value,
                    });
              }}
            />
          </Box>
        </Box>
        {subsectionId ? null : (
          <Box
            style={{
              marginTop: "30px",
              marginBottom: "15px",
            }}
          >
            <CustomButton color="purple" onClick={() => handleModal()}>
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
        )}

        <Modal open={openModal} onBackdropClick={() => setOpenModal(false)}>
          <Box className={classes.modal}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              <Typography className={classes.title}>
                Confirme os dados.
              </Typography>
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
                  marginTop: 20,
                  justifyContent: "end",
                  width: "100%",
                }}
              >
                <Box width={"30%"}>
                  <Typography className={classes.title}>Nome:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador ? novoPagador.nome : dadosPessoais.nome}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>Documento:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador
                      ? novoPagador.documento
                      : dadosPessoais.documento}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>Celular:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador ? novoPagador.celular : dadosPessoais.celular}
                  </Typography>
                </Box>
              </Box>
              <Box
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "end",
                  width: "100%",
                }}
              >
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Data de nascimento:
                  </Typography>
                  <Typography className={classes.text}>
                    {rowPagador
                      ? novoPagador.data_nascimento
                      : moment.utc(dataNascimento).format("DD/MM/YYYY")}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>CEP:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador ? novoPagador.endereco?.cep : dadosEndereco.cep}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>Rua:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador ? novoPagador.endereco?.rua : dadosEndereco.rua}
                  </Typography>
                </Box>
              </Box>
              <Box
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "end",
                  width: "100%",
                }}
              >
                <Box width={"30%"}>
                  <Typography className={classes.title}>Número:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador
                      ? novoPagador.endereco?.numero
                      : dadosEndereco.numero}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>Bairro:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador
                      ? novoPagador.endereco?.bairro
                      : dadosEndereco.bairro}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Complemento:
                  </Typography>
                  <Typography className={classes.text}>
                    {rowPagador
                      ? novoPagador.endereco?.complemento
                      : dadosEndereco.complemento}
                  </Typography>
                </Box>
              </Box>
              <Box
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "end",
                  width: "100%",
                }}
              >
                <Box width={"30%"}>
                  <Typography className={classes.title}>Cidade:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador
                      ? novoPagador.endereco?.cidade
                      : dadosEndereco.cidade}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>Estado:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador
                      ? novoPagador.endereco?.estado
                      : dadosEndereco.estado}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>E-mail:</Typography>
                  <Typography className={classes.text}>
                    {rowPagador ? novoPagador.email : dadosPessoais.email}
                  </Typography>
                </Box>
              </Box>

              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "100px",
                }}
              >
                <Box style={{ marginTop: "10px" }}>
                  <CustomButton
                    variant="contained"
                    color="purple"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleCadastrarPagador()}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Confirmar
                    </Typography>
                  </CustomButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default NovoPagador;
