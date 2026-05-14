import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  makeStyles,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

import CustomButton from "../CustomButton/CustomButton";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { postGerarBoleto } from "../../services/services";

import moment from "moment";
import "moment/locale/pt-br";
import CurrencyInput from "react-currency-input";
import { setDadosBoleto } from "../../actions/actions";
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
    /* transform: 'translate(-50%, -50%)', */
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    /* bgcolor: 'background.paper', */
    border: "0px solid #000",
    boxShadow: 24,
    /* p: 5, */
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
  currencyInput: {
    marginBottom: "6px",

    alignSelf: "center",
    textAlign: "center",
    height: 45,
    fontSize: 17,
    borderWidth: "1px !important",
    borderRadius: 27,
    border: "solid",
    color: APP_CONFIG.mainCollors.primary,
    backgroundColor: "transparent",
    fontFamily: "Montserrat-Regular",
  },
}));
const options = {
  displayType: "input",
  allowNegative: false,
  isNumericString: true,
  style: { width: "200px" },
  customInput: (props) => <TextField {...props} variant="outlined" />,
};

const tipoMulta = {
  1: "Fixo",
  2: "Percentual",
};
const tipoJuros = {
  1: "Valor diário",
  2: "Pecentual diário",
  3: "Pecentual mensal",
};
const tipoDesconto = {
  1: "Fixo",
  2: "Percentual",
};

const GerarBoleto = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [openModal, setOpenModal] = useState(false);

  const [errosBoleto, setErrosBoleto] = useState({});

  const pagadorId = useSelector((state) => state.pagadorId);
  const [valorDocumento, setValorDocumento] = useState(0.0);
  const [dataVencimento, setDataVencimento] = useState("");
  const [multa, setMulta] = useState("0");
  const [valorMulta, setValorMulta] = useState(0);
  const [juros, setJuros] = useState("0");
  const [valorJuros, setValorJuros] = useState(0);
  const [desconto, setDesconto] = useState("0");
  const [valorDesconto, setValorDesconto] = useState(0);
  const [dataDesconto, setDataDesconto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [instrucaoLinha, setInstrucaoLinha] = useState({
    linha1: "",
    linha2: "",
    linha3: "",
  });

  function handleClick(event) {
    if (event.target.value === multa) {
      setMulta("0");
      setValorMulta(0);
    } else {
      setMulta(event.target.value);
      setValorMulta(0);
    }
  }

  function handleToggleJuros(event) {
    if (event.target.value === juros) {
      setJuros("0");
      setValorJuros(0);
    } else {
      setJuros(event.target.value);
      setValorJuros(0);
    }
  }

  function handleToggleDesconto(event) {
    if (event.target.value === desconto) {
      setDesconto("0");
      setValorDesconto(0);
      setDataDesconto(null);
    } else {
      setDesconto(event.target.value);
      setValorDesconto(0);
    }
  }

  function handleOpenModal(e) {
    e.preventDefault();
    if (valorDocumento <= 0) {
      return toast.error("O valor do documento deve ser maior que 0");
    }
    if (multa !== "0" && valorMulta <= 0) {
      return toast.error("O valor da multa deve ser maior que 0");
    }
    if (juros !== "0" && valorJuros <= 0) {
      return toast.error("O valor de juros deve ser maior que 0");
    }
    if (desconto !== "0" && valorDesconto <= 0) {
      return toast.error("O valor de desconto deve ser maior que 0");
    }
    if (descricao === "") {
      return toast.error("A descrição é obrigatória");
    }
    setOpenModal(true);
  }

  async function handleGerarBoleto() {
    try {
      setOpenModal(false);
      setLoading(true);
      const tipoMultaFormatado = parseInt(multa === "0" ? "2" : multa);
      const tipoJurosFormatado = parseInt(juros === "0" ? "2" : juros);
      const tipoDescontoFormatado = parseInt(desconto === "0" ? "2" : desconto);

      const { data } = await postGerarBoleto(
        token,
        pagadorId,
        valorDocumento,
        descricao,
        instrucaoLinha.linha1,
        instrucaoLinha.linha2,
        instrucaoLinha.linha3,
        dataVencimento,
        tipoMultaFormatado,
        valorMulta,
        tipoJurosFormatado,
        valorJuros,
        tipoDescontoFormatado,
        valorDesconto,
        dataDesconto,
      );
      console.log(data);
      toast.success("Pagamento efetuado com sucesso!");
      dispatch(setDadosBoleto(data));
      setLoading(false);
      changePath("boletoGerado");
    } catch (err) {
      setErrosBoleto(err.response.data.errors);
      setLoading(false);
      console.log(err.response.data.errors);
      toast.error("Erro ao gerar boleto, tente novamente.");
    }
  }

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
        Gerar boleto
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <form
          onSubmit={(e) => {
            handleOpenModal(e);
          }}
          style={{ width: "100%", padding: "25px" }}
        >
          <Box
            width="100%"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box width="100%">
              <FormControl error={errosBoleto.valor}>
                <CurrencyInput
                  label="Valor Mensal"
                  placeHolder="R$0,00"
                  className={classes.currencyInput}
                  decimalSeparator=","
                  thousandSeparator="."
                  prefix="R$ "
                  value={valorDocumento}
                  onChangeEvent={(event, maskedvalue, floatvalue) => {
                    setValorDocumento(floatvalue);
                  }}
                  error={errosBoleto.valor}
                  helperText={
                    errosBoleto.valor ? errosBoleto.valor.join(" ") : null
                  }
                />
                {errosBoleto.valor ? (
                  <FormHelperText>{errosBoleto.valor.join(" ")}</FormHelperText>
                ) : null}
              </FormControl>
              {/* <FormControl fullWidth error={errosBoleto.valor}>
								<CurrencyFormat
									{...options}
									style={{
										width: '100%',
									}}
									value={valorDocumento}
									prefix={'R$ '}
									thousandSeparator={'.'}
									decimalSeparator={','}
									decimalScale={2}
									onValueChange={({ value }) => {
										setValorDocumento(value);
									}}
								/>
								{errosBoleto.valor ? (
									<FormHelperText>
										{errosBoleto.valor.join(' ')}
									</FormHelperText>
								) : null}
							</FormControl> */}
            </Box>

            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "30px",
                gap: 10,
              }}
            >
              <TextField
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "d{4}- d {2}- d {2} ",
                }}
                type="date"
                label="Data de vencimento"
                value={dataVencimento}
                onChange={(e) => {
                  setDataVencimento(e.target.value);
                }}
                error={errosBoleto.data_vencimento}
                helperText={
                  errosBoleto.data_vencimento
                    ? errosBoleto.data_vencimento.join(" ")
                    : null
                }
                style={{
                  width: "43%",
                }}
              />

              {/* <MuiPickersUtilsProvider locale={'br'} utils={MomentUtils}>
								<DatePicker
									label="Data de vencimento"
									required
									inputVariant="outlined"
									format="DD/MM/yyyy"
									disablePast
									value={dataVencimento}
									onChange={(e) => setDataVencimento(e.target.value)}
									error={errosBoleto.data_vencimento}
									helperText={
										errosBoleto.data_vencimento
											? errosBoleto.data_vencimento.join(' ')
											: null
									}
									style={{
										width: '43%',
									}}
								/>
							</MuiPickersUtilsProvider> */}
              <TextField
                style={{
                  width: "55%",
                }}
                variant="outlined"
                label="Instruções linha 1"
                error={errosBoleto.instrucao1}
                helperText={
                  errosBoleto.instrucao1
                    ? errosBoleto.instrucao1.join(" ")
                    : null
                }
                onChange={(e) => {
                  setInstrucaoLinha({
                    ...instrucaoLinha,
                    linha1: e.target.value,
                  });
                }}
              />
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "30px",
                gap: 20,
              }}
            >
              <TextField
                style={{
                  width: "100%",
                }}
                variant="outlined"
                label="Instruções linha 2"
                error={errosBoleto.instrucao2}
                helperText={
                  errosBoleto.instrucao2
                    ? errosBoleto.instrucao2.join(" ")
                    : null
                }
                onChange={(e) => {
                  setInstrucaoLinha({
                    ...instrucaoLinha,
                    linha2: e.target.value,
                  });
                }}
              />
              <TextField
                style={{
                  width: "100%",
                }}
                variant="outlined"
                label="Instruções linha 3"
                error={errosBoleto.instrucao3}
                helperText={
                  errosBoleto.instrucao3
                    ? errosBoleto.instrucao3.join(" ")
                    : null
                }
                onChange={(e) => {
                  setInstrucaoLinha({
                    ...instrucaoLinha,
                    linha3: e.target.value,
                  });
                }}
              />
              <TextField
                style={{
                  width: "100%",
                }}
                variant="outlined"
                label="Descrição do boleto"
                error={errosBoleto.descricao}
                helperText={
                  errosBoleto.descricao ? errosBoleto.descricao.join(" ") : null
                }
                onChange={(e) => {
                  setDescricao(e.target.value);
                }}
              />
            </Box>
            <Box>
              <Accordion
                style={{
                  background: "transparent",
                  marginTop: "20px",
                  borderColor: APP_CONFIG.mainCollors.primary,
                  borderRadius: "25px",
                }}
                variant="outlined"
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Deseja aplicar multa após o vencimento do boleto?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl component="fieldset">
                    <FormLabel style={{ opacity: 1, color: "black" }}>
                      Forma de cobrança
                    </FormLabel>
                    <RadioGroup
                      aria-label="Forma de cobrança"
                      name="multas"
                      value={multa}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      {/* <FormControlLabel
												value="1"
												control={
													<Radio
														onClick={handleClick}
														color={'primary'}
													/>
												}
												label="Fixo"
												style={{
													color: 'black',
													fontFamily: 'Montserrat-Regular',
												}}
											/> */}
                      <FormControlLabel
                        value="2"
                        control={
                          <Radio onClick={handleClick} color={"primary"} />
                        }
                        label="Percentual"
                        style={{
                          color: "black",
                          fontFamily: "Montserrat-Regular",
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                  <Box>
                    <FormControl error={errosBoleto.valor_multa}>
                      <CurrencyInput
                        disabled={multa == "0"}
                        placeHolder="R$0,00"
                        className={classes.currencyInput}
                        thousandSeparator={multa == "1" ? "." : ","}
                        decimalSeparator={multa !== "1" ? "." : ","}
                        prefix={multa == "1" ? "R$ " : "% "}
                        decimalScale={valorMulta == 100 ? 0 : 2}
                        value={valorMulta}
                        onChangeEvent={(event, maskedvalue, floatvalue) => {
                          setValorMulta(
                            multa === "2" && floatvalue > 100 ? 0 : floatvalue,
                          );
                        }}
                      />
                      {errosBoleto.valor_multa ? (
                        <FormHelperText>
                          {errosBoleto.valor_multa.join(" ")}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box>
              <Accordion
                style={{
                  background: "transparent",
                  marginTop: "20px",
                  borderColor: APP_CONFIG.mainCollors.primary,
                  borderRadius: "25px",
                }}
                variant="outlined"
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Deseja aplicar juros após o vencimento do boleto?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl component="fieldset">
                    <FormLabel style={{ opacity: 1, color: "black" }}>
                      Forma de cobrança
                    </FormLabel>
                    <RadioGroup
                      aria-label="Forma de cobrança"
                      name="juros"
                      value={juros}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      {/* <FormControlLabel
												value="1"
												control={
													<Radio
														onClick={handleToggleJuros}
														color={'primary'}
													/>
												}
												label="Valor diário"
												style={{
													color: 'black',
													fontFamily: 'Montserrat-Regular',
												}}
											/> */}
                      <FormControlLabel
                        value="2"
                        control={
                          <Radio
                            onClick={handleToggleJuros}
                            color={"primary"}
                          />
                        }
                        label="Percentual diário"
                        style={{
                          color: "black",
                          fontFamily: "Montserrat-Regular",
                        }}
                      />
                      {/* <FormControlLabel
												value="3"
												control={
													<Radio
														onClick={handleToggleJuros}
														color={'primary'}
													/>
												}
												label="Percentual mensal"
												style={{
													color: 'black',
													fontFamily: 'Montserrat-Regular',
												}}
											/> */}
                    </RadioGroup>
                  </FormControl>
                  <Box>
                    <FormControl error={errosBoleto.valor_juros}>
                      <CurrencyInput
                        disabled={juros == "0"}
                        placeHolder="R$0,00"
                        className={classes.currencyInput}
                        value={valorJuros}
                        prefix={juros == "1" ? "R$ " : "% "}
                        thousandSeparator={juros == "1" ? "." : ","}
                        decimalSeparator={juros !== "1" ? "." : ","}
                        decimalScale={valorJuros == 100 ? 0 : 2}
                        onChangeEvent={(event, maskedvalue, floatvalue) => {
                          setValorJuros(
                            (juros === "2" || juros === "3") && floatvalue > 100
                              ? 0
                              : floatvalue,
                          );
                        }}
                      />
                      {errosBoleto.valor_juros ? (
                        <FormHelperText>
                          {errosBoleto.valor_juros.join(" ")}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box>
              <Accordion
                style={{
                  background: "transparent",
                  marginTop: "20px",
                  borderColor: APP_CONFIG.mainCollors.primary,
                  borderRadius: "25px",
                }}
                variant="outlined"
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Deseja aplicar desconto?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl component="fieldset">
                    <FormLabel style={{ opacity: 1, color: "black" }}>
                      Forma de desconto
                    </FormLabel>
                    <RadioGroup
                      aria-label="Forma de desconto"
                      name="desconto"
                      value={desconto}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      {/* <FormControlLabel
												value="1"
												control={
													<Radio
														onClick={handleToggleDesconto}
														color={'primary'}
													/>
												}
												label="Fixo"
												style={{
													color: 'black',
													fontFamily: 'Montserrat-Regular',
												}}
											/> */}
                      <FormControlLabel
                        value="2"
                        control={
                          <Radio
                            onClick={handleToggleDesconto}
                            color={"primary"}
                          />
                        }
                        label="Percentual"
                        style={{
                          color: "black",
                          fontFamily: "Montserrat-Regular",
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                  <Box>
                    <FormControl error={errosBoleto.valor_desconto}>
                      <CurrencyInput
                        disabled={desconto == "0"}
                        placeHolder="R$0,00"
                        className={classes.currencyInput}
                        prefix={desconto == "1" ? "R$ " : "% "}
                        thousandSeparator={desconto == "1" ? "." : ","}
                        decimalSeparator={desconto !== "1" ? "." : ","}
                        decimalScale={valorMulta == 100 ? 0 : 2}
                        value={valorDesconto}
                        onChangeEvent={(event, maskedvalue, floatvalue) => {
                          setValorDesconto(
                            desconto === "2" && floatvalue > 100
                              ? 0
                              : floatvalue,
                          );
                        }}
                      />
                      {errosBoleto.valor_desconto ? (
                        <FormHelperText>
                          {errosBoleto.valor_desconto.join(" ")}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl error={errosBoleto.data_limite_valor_desconto}>
                      <TextField
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                          pattern: "d {4}- d {2}- d {2} ",
                        }}
                        type="date"
                        label="Data limite"
                        value={dataDesconto}
                        onChange={(e) => setDataDesconto(e.target.value)}
                        style={{
                          marginTop: 25,
                          width: "200px",
                        }}
                      />
                      {errosBoleto.data_limite_valor_desconto ? (
                        <FormHelperText>
                          {errosBoleto.data_limite_valor_desconto.join(" ")}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                    {/* <FormControl error={errosBoleto.data_vencimento}>
											<MuiPickersUtilsProvider
												locale={'br'}
												utils={MomentUtils}
											>
												<DatePicker
													disabled={desconto == '0'}
													label="Data limite"
													inputVariant="outlined"
													format="DD/MM/yyyy"
													disablePast
													value={dataDesconto}
													onChange={setDataDesconto}
													style={{
														marginTop: 25,
													}}
													inputProps={{
														style: { textAlign: 'end' },
													}}
												/>
											</MuiPickersUtilsProvider>
											{errosBoleto.data_vencimento ? (
												<FormHelperText>
													{errosBoleto.data_vencimento.join(' ')}
												</FormHelperText>
											) : null}
										</FormControl> */}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box
              style={{
                marginTop: "30px",
                marginBottom: "15px",
              }}
            >
              <CustomButton color="purple" type="submit">
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                    //opacity: !docValido ? 0.3 : 1
                  }}
                >
                  Continuar
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </form>

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
                  <Typography className={classes.title}>Valor:</Typography>
                  <Typography className={classes.text}>
                    R$ {parseFloat(valorDocumento).toFixed(2)}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Data do Vencimento:
                  </Typography>
                  <Typography className={classes.text}>
                    {moment.utc(dataVencimento).format("DD/MM/YYYY")}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Instrução linha 1:
                  </Typography>
                  <Typography className={classes.text}>
                    {instrucaoLinha.linha1 == ""
                      ? "não possui"
                      : instrucaoLinha.linha1}
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
                    Instrução linha 2:
                  </Typography>
                  <Typography className={classes.text}>
                    {instrucaoLinha.linha2 == ""
                      ? "não possui"
                      : instrucaoLinha.linha2}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Instrução linha 3:
                  </Typography>
                  <Typography className={classes.text}>
                    {instrucaoLinha.linha3 == ""
                      ? "não possui"
                      : instrucaoLinha.linha3}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Multa após vencimento:
                  </Typography>
                  <Typography className={classes.text}>
                    {multa == "0" ? "não possui" : tipoMulta[multa]}
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
                    Valor multa:
                  </Typography>
                  <Typography className={classes.text}>
                    {multa !== "1" ? "(%) " : "(R$) "}
                    {valorMulta}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Juros após vencimento:
                  </Typography>
                  <Typography className={classes.text}>
                    {juros == "0" ? "não possui" : tipoJuros[juros]}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Valor juros:
                  </Typography>
                  <Typography className={classes.text}>
                    {juros !== "1" ? "(%) " : "(R$) "}
                    {valorJuros}
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
                  <Typography className={classes.title}>Desconto:</Typography>
                  <Typography className={classes.text}>
                    {desconto == "0" ? "não possui" : tipoDesconto[desconto]}
                  </Typography>
                </Box>
                <Box width={"30%"}>
                  <Typography className={classes.title}>
                    Valor desconto:
                  </Typography>
                  <Typography className={classes.text}>
                    {desconto !== "1" ? "(%) " : "(R$) "}
                    {valorDesconto}
                  </Typography>
                </Box>
                <Box width={"30%"}></Box>
              </Box>

              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "80px",
                }}
              >
                <Box style={{ marginTop: "10px" }}>
                  <CustomButton
                    variant="contained"
                    color="purple"
                    style={{ marginTop: "10px" }}
                    onClick={handleGerarBoleto}
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

export default GerarBoleto;
