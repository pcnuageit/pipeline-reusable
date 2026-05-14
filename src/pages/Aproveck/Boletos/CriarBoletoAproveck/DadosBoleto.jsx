import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CustomCurrencyInput from "../../../../components/Text/CustomCurrencyInput";
import CustomFormHelperText from "../../../../components/Text/CustomFormHelperText";
import { APP_CONFIG } from "../../../../constants/config";
import {
  codigosBoleto,
  descricaoCodigosBoleto,
  tiposBoleto,
} from "./codigosDeBoleto";

const DadosBoleto = ({ boleto, setBoleto, errosBoleto }) => {
  return (
    <Box>
      <Typography
        variant="h5"
        style={{
          color: APP_CONFIG.mainCollors.primary,
          fontFamily: "Montserrat-SemiBold",
          marginBottom: "20px",
        }}
      >
        Dados do Boleto
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" flexDirection="column">
              <TextField
                select
                fullWidth
                label="Tipo Boleto"
                error={errosBoleto.tipo}
                // helperText={
                //   errosBoleto.tipo ? errosBoleto.tipo.join(" ") : null
                // }
                SelectProps={{
                  value: boleto.tipo,
                  onChange: (e) =>
                    setBoleto({
                      ...boleto,
                      tipo: e.target.value,
                    }),
                }}
              >
                {tiposBoleto.map((item) => (
                  <MenuItem value={item.tipo}>{item.descricao}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" flexDirection="column">
              <TextField
                select
                fullWidth
                label="Código Boleto"
                error={errosBoleto["sga.codigo_tipo_boleto"]}
                // helperText={
                //   errosBoleto["sga.codigo_tipo_boleto"]
                //     ? errosBoleto["sga.codigo_tipo_boleto"].join(" ")
                //     : null
                // }
                SelectProps={{
                  value: boleto.sga.codigo_tipo_boleto,
                  onChange: (e) =>
                    setBoleto({
                      ...boleto,
                      sga: {
                        ...boleto.sga,
                        codigo_tipo_boleto: e.target.value,
                        descricao: descricaoCodigosBoleto[e.target.value],
                      },
                    }),
                }}
              >
                {codigosBoleto.map((item) => (
                  <MenuItem value={item.codigo_tipo_boleto}>
                    {item.descricao}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Box display="flex" flexDirection="column">
              <TextField
                select
                fullWidth
                label="Parcelas"
                error={errosBoleto.parcelas}
                // helperText={
                //   errosBoleto.parcelas ? errosBoleto.parcelas.join(" ") : null
                // }
                SelectProps={{
                  value: boleto.parcelas,
                  onChange: (e) =>
                    setBoleto({
                      ...boleto,
                      parcelas: e.target.value,
                    }),
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((parcela) => (
                  <MenuItem value={parcela}>{parcela}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Box display="flex" flexDirection="column">
              <CustomCurrencyInput
                prefix="R$ "
                value={boleto.valor}
                label="Valor"
                onChangeEvent={(event, maskedvalue, floatvalue) =>
                  setBoleto({ ...boleto, valor: floatvalue })
                }
                error={errosBoleto.valor}
                errorMessage={
                  errosBoleto.valor ? errosBoleto.valor.join(" ") : null
                }
              />
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <TextField
              fullWidth
              error={errosBoleto.data_vencimento}
              helperText={
                errosBoleto.data_vencimento
                  ? errosBoleto.data_vencimento.join(" ")
                  : null
              }
              InputLabelProps={{
                shrink: true,
                pattern: "d {4}- d {2}- d {2} ",
              }}
              type="date"
              label="Data de Vencimento"
              value={boleto.data_vencimento}
              onChange={(e) =>
                setBoleto({
                  ...boleto,
                  data_vencimento: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errosBoleto.instrucao1}
              helperText={
                errosBoleto.instrucao1 ? errosBoleto.instrucao1.join(" ") : null
              }
              label="Instruções linha 1"
              value={boleto.instrucao1}
              onChange={(e) =>
                setBoleto({
                  ...boleto,
                  instrucao1: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errosBoleto.instrucao2}
              helperText={
                errosBoleto.instrucao2 ? errosBoleto.instrucao2.join(" ") : null
              }
              label="Instruções linha 2"
              value={boleto.instrucao2}
              onChange={(e) =>
                setBoleto({
                  ...boleto,
                  instrucao2: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errosBoleto.instrucao3}
              helperText={
                errosBoleto.instrucao3 ? errosBoleto.instrucao3.join(" ") : null
              }
              label="Instruções linha 3"
              value={boleto.instrucao3}
              onChange={(e) =>
                setBoleto({
                  ...boleto,
                  instrucao3: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={errosBoleto.descricao}
              helperText={
                errosBoleto.descricao ? errosBoleto.descricao.join(" ") : null
              }
              required
              label="Descrição do boleto"
              value={boleto.descricao}
              onChange={(e) =>
                setBoleto({
                  ...boleto,
                  descricao: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  Deseja aplicar multa após o vencimento do boleto?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexDirection="column" width="100%">
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Forma de cobrança</FormLabel>
                    <RadioGroup
                      row
                      value={boleto.tipo_multa}
                      onChange={(e) =>
                        setBoleto({
                          ...boleto,
                          tipo_multa: e.target.value,
                        })
                      }
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Fixo"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Percentual"
                      />
                    </RadioGroup>
                    <CustomFormHelperText
                      errorMessage={
                        errosBoleto.tipo_multa
                          ? errosBoleto.tipo_multa.join(" ")
                          : null
                      }
                    />
                    {boleto.tipo_multa === "1" ? (
                      <CustomCurrencyInput
                        value={boleto.valor_multa}
                        label="Valor da multa"
                        prefix="R$ "
                        onChangeEvent={(event, maskedvalue, floatvalue) =>
                          setBoleto({
                            ...boleto,
                            valor_multa: floatvalue,
                          })
                        }
                        errorMessage={
                          errosBoleto.valor_multa
                            ? errosBoleto.valor_multa.join(" ")
                            : null
                        }
                      />
                    ) : (
                      <CustomCurrencyInput
                        value={boleto.valor_multa}
                        label="Valor da multa"
                        suffix=" %"
                        onChangeEvent={(event, maskedvalue, floatvalue) =>
                          setBoleto({
                            ...boleto,
                            valor_multa: floatvalue,
                          })
                        }
                        errorMessage={
                          errosBoleto.valor_multa
                            ? errosBoleto.valor_multa.join(" ")
                            : null
                        }
                      />
                    )}
                  </FormControl>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  Deseja aplicar juros após o vencimento do boleto?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexDirection="column" width="100%">
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Forma de cobrança</FormLabel>
                    <RadioGroup
                      row
                      value={boleto.tipo_juros}
                      onChange={(e) =>
                        setBoleto({
                          ...boleto,
                          tipo_juros: e.target.value,
                        })
                      }
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Valor diário"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Percentual diário"
                      />
                      <FormControlLabel
                        value="3"
                        control={<Radio />}
                        label="Percentual mensal"
                      />
                    </RadioGroup>
                    <CustomFormHelperText
                      errorMessage={
                        errosBoleto.tipo_juros
                          ? errosBoleto.tipo_juros.join(" ")
                          : null
                      }
                    />
                    {boleto.tipo_juros === "2" || boleto.tipo_juros === "3" ? (
                      <CustomCurrencyInput
                        suffix=" %"
                        value={boleto.valor_juros}
                        label="Valor do juros"
                        onChangeEvent={(event, maskedvalue, floatvalue) =>
                          setBoleto({
                            ...boleto,
                            valor_juros: floatvalue,
                          })
                        }
                        errorMessage={
                          errosBoleto.valor_juros
                            ? errosBoleto.valor_juros.join(" ")
                            : null
                        }
                      />
                    ) : (
                      <CustomCurrencyInput
                        prefix="R$ "
                        value={boleto.valor_juros}
                        label="Valor do juros"
                        onChangeEvent={(event, maskedvalue, floatvalue) =>
                          setBoleto({
                            ...boleto,
                            valor_juros: floatvalue,
                          })
                        }
                        errorMessage={
                          errosBoleto.valor_juros
                            ? errosBoleto.valor_juros.join(" ")
                            : null
                        }
                      />
                    )}
                  </FormControl>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Deseja aplicar desconto?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexDirection="column" width="100%">
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Forma de desconto</FormLabel>
                    <RadioGroup
                      row
                      value={boleto.tipo_desconto}
                      onChange={(e) =>
                        setBoleto({
                          ...boleto,
                          tipo_desconto: e.target.value,
                        })
                      }
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Fixo"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Percentual"
                      />
                    </RadioGroup>
                    <CustomFormHelperText
                      errorMessage={
                        errosBoleto.tipo_desconto
                          ? errosBoleto.tipo_desconto.join(" ")
                          : null
                      }
                    />
                    {boleto.tipo_desconto === "1" ? (
                      <CustomCurrencyInput
                        prefix="R$ "
                        value={boleto.valor_desconto}
                        label="Valor do desconto"
                        onChangeEvent={(event, maskedvalue, floatvalue) =>
                          setBoleto({
                            ...boleto,
                            valor_desconto: floatvalue,
                          })
                        }
                        errorMessage={
                          errosBoleto.valor_desconto
                            ? errosBoleto.valor_desconto.join(" ")
                            : null
                        }
                      />
                    ) : (
                      <CustomCurrencyInput
                        suffix=" %"
                        value={boleto.valor_desconto}
                        label="Valor do desconto"
                        onChangeEvent={(event, maskedvalue, floatvalue) =>
                          setBoleto({
                            ...boleto,
                            valor_desconto: floatvalue,
                          })
                        }
                        errorMessage={
                          errosBoleto.valor_desconto
                            ? errosBoleto.valor_desconto.join(" ")
                            : null
                        }
                      />
                    )}
                  </FormControl>

                  <Box marginTop="12px">
                    <TextField
                      type="date"
                      fullWidth
                      label="Data Limite"
                      error={errosBoleto.data_limite_valor_desconto}
                      helperText={
                        errosBoleto.data_limite_valor_desconto
                          ? errosBoleto.data_limite_valor_desconto.join(" ")
                          : null
                      }
                      value={boleto.data_limite_valor_desconto}
                      onChange={(e) =>
                        setBoleto({
                          ...boleto,
                          data_limite_valor_desconto: e.target.value,
                        })
                      }
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DadosBoleto;
