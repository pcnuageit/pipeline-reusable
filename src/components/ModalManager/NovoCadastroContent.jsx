import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import ReactInputMask from "react-input-mask";

import { getCep } from "../../services/services";

import SelectConta from "../../components/SelectConta";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import CustomCurrencyInput from "../CustomCurrencyInput";
import SelectBeneficio from "../SelectBeneficio";
import SelectCurso from "../SelectCurso";

export function NovoCadastroContent({
  tipo, //beneficiario, cartao, voucher, beneficio
  errors,
  setErrors,
  conta,
  setConta,
  update,
}) {
  const handleCep = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({
      ...prev,
      "endereco.cep": null,
    }));

    try {
      const response = await getCep(e.target.value);
      setConta((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: response.data.cep,
          rua: response.data.logradouro ?? response.data.street,
          complemento: response.data.complemento,
          bairro: response.data.bairro ?? response.data.neighborhood,
          cidade: response.data.localidade ?? response.data.city,
          estado: response.data.uf ?? response.data.state,
        },
      }));
    } catch (err) {
      console.log(err);
      setErrors((prev) => ({
        ...prev,
        "endereco.cep": ["Erro ao buscar dados do CEP"],
      }));
    }
  };

  return (
    <Grid container spacing={4}>
      {tipo === "beneficiario" ? (
        <>
          <Grid item xs={6}>
            <TextField
              label={"Número de inscrição"}
              value={conta?.beneficiario?.numero_inscricao}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficiario: {
                    ...prev.beneficiario,
                    numero_inscricao: e.target.value,
                  },
                }))
              }
              error={errors["beneficiario.numero_inscricao "]}
              helperText={
                errors["beneficiario.numero_inscricao "]
                  ? errors["beneficiario.numero_inscricao "]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              type="number"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Nome completo"}
              value={conta?.beneficiario?.nome}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficiario: {
                    ...prev.beneficiario,
                    nome: e.target.value,
                  },
                }))
              }
              error={errors["beneficiario.nome"]}
              helperText={
                errors["beneficiario.nome"]
                  ? errors["beneficiario.nome"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Email"}
              value={conta?.beneficiario?.email}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficiario: {
                    ...prev.beneficiario,
                    email: e.target.value,
                  },
                }))
              }
              error={errors["beneficiario.email"]}
              helperText={
                errors["beneficiario.email"]
                  ? errors["beneficiario.email"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <ReactInputMask
              mask={"99/99/9999"}
              value={conta?.beneficiario?.data_nascimento}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficiario: {
                    ...prev.beneficiario,
                    data_nascimento: e.target.value,
                  },
                }))
              }
            >
              {() => (
                <TextField
                  label={"Data de nascimento"}
                  error={errors["beneficiario.data_nascimento"]}
                  helperText={
                    errors["beneficiario.data_nascimento"]
                      ? errors["beneficiario.data_nascimento"]?.join(" ")
                      : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </ReactInputMask>
          </Grid>

          <Grid item xs={12}>
            <ReactInputMask
              mask={"999.999.999-99"}
              value={conta?.beneficiario?.documento}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficiario: {
                    ...prev.beneficiario,
                    documento: e.target.value,
                  },
                }))
              }
              disabled={update}
            >
              {() => (
                <TextField
                  label={"Documento"}
                  error={errors["beneficiario.documento"]}
                  helperText={
                    errors["beneficiario.documento"]
                      ? errors["beneficiario.documento"]?.join(" ")
                      : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </ReactInputMask>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Celular"}
              value={conta?.beneficiario?.celular}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficiario: {
                    ...prev.beneficiario,
                    celular: e.target.value,
                  },
                }))
              }
              error={errors["beneficiario.celular"]}
              helperText={
                errors["beneficiario.celular"]
                  ? errors["beneficiario.celular"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <ReactInputMask
              mask={"99999-999"}
              value={conta?.endereco?.cep}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    cep: e.target.value,
                  },
                }))
              }
              onBlur={(e) => handleCep(e)}
            >
              {() => (
                <TextField
                  label={"CEP"}
                  error={errors["endereco.cep"]}
                  helperText={
                    errors["endereco.cep"]
                      ? errors["endereco.cep"]?.join(" ")
                      : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            </ReactInputMask>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Rua"}
              value={conta?.endereco?.rua}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    rua: e.target.value,
                  },
                }))
              }
              error={errors["endereco.rua"]}
              helperText={
                errors["endereco.rua"]
                  ? errors["endereco.rua"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={true}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={"Número"}
              value={conta?.endereco?.numero}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    numero: e.target.value,
                  },
                }))
              }
              error={errors["endereco.numero"]}
              helperText={
                errors["endereco.numero"]
                  ? errors["endereco.numero"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={"Complemento"}
              value={conta?.endereco?.complemento}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    complemento: e.target.value,
                  },
                }))
              }
              error={errors["endereco.complemento"]}
              helperText={
                errors["endereco.complemento"]
                  ? errors["endereco.complemento"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={"Bairro"}
              value={conta?.endereco?.bairro}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    bairro: e.target.value,
                  },
                }))
              }
              error={errors["endereco.bairro"]}
              helperText={
                errors["endereco.bairro"]
                  ? errors["endereco.bairro"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={"Cidade"}
              value={conta?.endereco?.cidade}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    cidade: e.target.value,
                  },
                }))
              }
              error={errors["endereco.cidade"]}
              helperText={
                errors["endereco.cidade"]
                  ? errors["endereco.cidade"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={"Estado"}
              value={conta?.endereco?.estado}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  endereco: {
                    ...prev.endereco,
                    estado: e.target.value,
                  },
                }))
              }
              error={errors["endereco.estado"]}
              helperText={
                errors["endereco.estado"]
                  ? errors["endereco.estado"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={true}
            />
          </Grid>
        </>
      ) : null}

      {tipo === "cartao" ? (
        <>
          <Grid item xs={12}>
            <ReactInputMask
              mask={"999.999.999-99"}
              value={conta?.cartao?.documento}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  cartao: {
                    ...prev.cartao,
                    documento: e.target.value,
                  },
                }))
              }
            >
              {() => (
                <TextField
                  label={"Documento"}
                  error={errors["documento"]}
                  helperText={
                    errors["documento"] ? errors["documento"]?.join(" ") : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </ReactInputMask>
          </Grid>

          <Grid item xs={12}>
            <ReactInputMask
              mask={"99/99/9999"}
              value={conta?.cartao?.data_solicitacao}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  cartao: {
                    ...prev.cartao,
                    data_solicitacao: e.target.value,
                  },
                }))
              }
            >
              {() => (
                <TextField
                  label={"Data da solicitação"}
                  error={errors["data_solicitacao"]}
                  helperText={
                    errors["data_solicitacao"]
                      ? errors["data_solicitacao"]?.join(" ")
                      : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </ReactInputMask>
            <Typography style={{ fontSize: 14 }}>
              A data de solicitação deve ser em no mínimo 10 dias e deve ser um
              dia útil
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Município"}
              value={conta?.cartao?.municipio}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  cartao: {
                    ...prev.cartao,
                    municipio: e.target.value,
                  },
                }))
              }
              error={errors["municipio"]}
              helperText={
                errors["municipio"] ? errors["municipio"]?.join(" ") : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <SelectCurso
              state={conta?.cartao?.curso}
              setState={(e) =>
                setConta((prev) => ({
                  ...prev,
                  cartao: {
                    ...prev.cartao,
                    curso: e.target.value,
                  },
                }))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Colégio"}
              value={conta?.cartao?.colegio}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  cartao: {
                    ...prev.cartao,
                    colegio: e.target.value,
                  },
                }))
              }
              error={errors["colegio"]}
              helperText={
                errors["colegio"] ? errors["colegio"]?.join(" ") : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label={"Série"}
              value={conta?.cartao?.serie}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  cartao: {
                    ...prev.cartao,
                    serie: e.target.value,
                  },
                }))
              }
              error={errors["serie"]}
              helperText={errors["serie"] ? errors["serie"]?.join(" ") : null}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label={"Turma"}
              value={conta?.cartao?.turma}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  cartao: {
                    ...prev.cartao,
                    turma: e.target.value,
                  },
                }))
              }
              error={errors["turma"]}
              helperText={errors["turma"] ? errors["turma"]?.join(" ") : null}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
        </>
      ) : null}

      {tipo === "voucher" ? (
        <>
          <Grid item xs={8}>
            <ReactInputMask
              mask={"999.999.999-99"}
              value={conta?.voucher?.documento}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  voucher: {
                    ...prev.voucher,
                    documento: e.target.value,
                  },
                }))
              }
            >
              {() => (
                <TextField
                  label={"Documento"}
                  error={errors["documento"]}
                  helperText={
                    errors["documento"] ? errors["documento"]?.join(" ") : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </ReactInputMask>
          </Grid>

          <Grid item xs={4}>
            <TextField
              label={"CVC"}
              value={conta?.voucher?.cvc}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  voucher: {
                    ...prev.voucher,
                    cvc: e.target.value,
                  },
                }))
              }
              error={errors["cvc"]}
              helperText={errors["cvc"] ? errors["cvc"]?.join(" ") : null}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel id="select-transfer-type" shrink="true">
              Tipo de transferência
            </InputLabel>
            <Select
              labelId="select-transfer-type"
              variant="outlined"
              fullWidth
              required
              value={conta?.voucher?.tipo_transferencia}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  voucher: {
                    ...prev.voucher,
                    tipo_transferencia: e.target.value,
                  },
                }))
              }
            >
              <MenuItem key={0} value={"Dict"}>
                Pix
              </MenuItem>
              <MenuItem key={1} value={"Manual"}>
                Manual
              </MenuItem>
            </Select>
          </Grid>

          {conta?.voucher?.tipo_transferencia === "Dict" ? (
            <Grid item xs={12}>
              <TextField
                label={"Chave Pix"}
                value={conta?.voucher?.chave_pix}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    voucher: {
                      ...prev.voucher,
                      chave_pix: e.target.value,
                    },
                  }))
                }
                error={errors["chave_pix"]}
                helperText={
                  errors["chave_pix"] ? errors["chave_pix"]?.join(" ") : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  label={"Nome do recebedor"}
                  value={conta?.voucher?.nome_conta}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      voucher: {
                        ...prev.voucher,
                        nome_conta: e.target.value,
                      },
                    }))
                  }
                  error={errors["nome_conta"]}
                  helperText={
                    errors["nome_conta"]
                      ? errors["nome_conta"]?.join(" ")
                      : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextFieldCpfCnpj
                  label={"Documento do recebedor"}
                  value={conta?.voucher?.documento_conta}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      voucher: {
                        ...prev.voucher,
                        documento_conta: e.target.value,
                      },
                    }))
                  }
                  error={errors["documento_conta"]}
                  helperText={
                    errors["documento_conta"]
                      ? errors["documento_conta"]?.join(" ")
                      : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={"Banco"}
                  value={conta?.voucher?.banco}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      voucher: {
                        ...prev.voucher,
                        banco: e.target.value,
                      },
                    }))
                  }
                  error={errors["banco"]}
                  helperText={
                    errors["banco"] ? errors["banco"]?.join(" ") : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel id="select-transfer-type" shrink="true">
                  Tipo de conta
                </InputLabel>
                <Select
                  labelId="select-transfer-type"
                  variant="outlined"
                  fullWidth
                  value={conta?.voucher?.tipo_conta}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      voucher: {
                        ...prev.voucher,
                        tipo_conta: e.target.value,
                      },
                    }))
                  }
                  error={errors["tipo_conta"]}
                  helperText={
                    errors["tipo_conta"]
                      ? errors["tipo_conta"]?.join(" ")
                      : null
                  }
                >
                  <MenuItem key={0} value={"conta_corrente"}>
                    Corrente
                  </MenuItem>
                  <MenuItem key={1} value={"conta_poupanca"}>
                    Poupança
                  </MenuItem>
                  <MenuItem key={0} value={"conta_salario"}>
                    Salário
                  </MenuItem>
                  <MenuItem key={1} value={"conta_pagamento"}>
                    Pagamento
                  </MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={"Agência"}
                  value={conta?.voucher?.agencia}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      voucher: {
                        ...prev.voucher,
                        agencia: e.target.value,
                      },
                    }))
                  }
                  error={errors["agencia"]}
                  helperText={
                    errors["agencia"] ? errors["agencia"]?.join(" ") : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={8}>
                <TextField
                  label={"Conta"}
                  value={conta?.voucher?.conta}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      voucher: {
                        ...prev.voucher,
                        conta: e.target.value,
                      },
                    }))
                  }
                  error={errors["conta"]}
                  helperText={
                    errors["conta"] ? errors["conta"]?.join(" ") : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label={"Dígito"}
                  value={conta?.voucher?.conta_digito}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      voucher: {
                        ...prev.voucher,
                        conta_digito: e.target.value,
                      },
                    }))
                  }
                  error={errors["conta_digito"]}
                  helperText={
                    errors["conta_digito"]
                      ? errors["conta_digito"]?.join(" ")
                      : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
            </>
          )}
        </>
      ) : null}

      {tipo === "cartao" || tipo === "voucher" ? (
        <Grid item xs={12}>
          <SelectBeneficio
            state={conta?.tipo_beneficio_id}
            setState={(e) =>
              setConta((prev) => ({
                ...prev,
                tipo_beneficio_id: e.target.value,
              }))
            }
          />
        </Grid>
      ) : null}

      {tipo === "beneficio" ? (
        <>
          <Grid item xs={12}>
            <TextField
              label={"Nome do benefício"}
              value={conta?.beneficio?.nome_beneficio}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    nome_beneficio: e.target.value,
                  },
                }))
              }
              error={errors["nome_beneficio"]}
              helperText={
                errors["nome_beneficio"]
                  ? errors["nome_beneficio"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"ID do benefício"}
              type="number"
              value={conta?.beneficio?.cdProduto}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    cdProduto: e.target.value,
                  },
                }))
              }
              error={errors["cdProduto"]}
              helperText={
                errors["cdProduto"] ? errors["cdProduto"]?.join(" ") : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Select
              variant="outlined"
              fullWidth
              required
              value={conta?.beneficio?.tipo}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    tipo: e.target.value,
                  },
                }))
              }
            >
              <MenuItem key={0} value={"beneficiario"}>
                Voucher
              </MenuItem>
              <MenuItem key={1} value={"cartao"}>
                Cartão
              </MenuItem>
            </Select>
          </Grid>

          <Grid item xs={10}>
            <Typography>É crédito social?</Typography>
          </Grid>
          <Grid item xs={2}>
            <Switch
              checked={conta?.beneficio?.is_credito_social}
              onClick={() =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    is_credito_social: !conta?.beneficio?.is_credito_social,
                  },
                }))
              }
            />
          </Grid>

          {conta?.beneficio?.tipo === "cartao" ? (
            <>
              <Grid item xs={10}>
                <Typography>É cartão virtual?</Typography>
              </Grid>
              <Grid item xs={2}>
                <Switch
                  checked={conta?.beneficio?.is_virtual}
                  onClick={() =>
                    setConta((prev) => ({
                      ...prev,
                      beneficio: {
                        ...prev.beneficio,
                        is_virtual: !conta?.beneficio?.is_virtual,
                      },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={10}>
                <Typography>Pode gerar CVC?</Typography>
              </Grid>
              <Grid item xs={2}>
                <Switch
                  checked={conta?.beneficio?.is_gerar_cvc}
                  onClick={() =>
                    setConta((prev) => ({
                      ...prev,
                      beneficio: {
                        ...prev.beneficio,
                        is_gerar_cvc: !conta?.beneficio?.is_gerar_cvc,
                      },
                    }))
                  }
                />
              </Grid>
            </>
          ) : null}

          {conta?.beneficio?.tipo === "beneficiario" ? (
            <>
              <Grid item xs={10}>
                <Typography>É contrato de aluguel?</Typography>
              </Grid>
              <Grid item xs={2}>
                <Switch
                  checked={conta?.beneficio?.is_contrato}
                  onClick={() =>
                    setConta((prev) => ({
                      ...prev,
                      beneficio: {
                        ...prev.beneficio,
                        is_contrato: !conta?.beneficio?.is_contrato,
                      },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={10}>
                <Typography>Pode alterar a chave Pix?</Typography>
              </Grid>
              <Grid item xs={2}>
                <Switch
                  checked={conta?.beneficio?.is_alterar_chave_pix}
                  onClick={() =>
                    setConta((prev) => ({
                      ...prev,
                      beneficio: {
                        ...prev.beneficio,
                        is_alterar_chave_pix:
                          !conta?.beneficio?.is_alterar_chave_pix,
                      },
                    }))
                  }
                />
              </Grid>
            </>
          ) : null}

          <Grid item xs={10}>
            <Typography>Validar competência?</Typography>
          </Grid>
          <Grid item xs={2}>
            <Switch
              checked={conta?.beneficio?.is_validar_competencia}
              onClick={() =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    is_validar_competencia:
                      !conta?.beneficio?.is_validar_competencia,
                  },
                }))
              }
            />
          </Grid>

          <Grid item xs={10}>
            <Typography>Validar limite de saldo?</Typography>
          </Grid>
          <Grid item xs={2}>
            <Switch
              checked={conta?.beneficio?.valida_limite_saldo}
              onClick={() =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    valida_limite_saldo: !conta?.beneficio?.valida_limite_saldo,
                  },
                }))
              }
            />
          </Grid>

          {conta?.beneficio?.valida_limite_saldo && (
            <CustomCurrencyInput
              label="Limite de saldo*"
              value={conta?.beneficio?.limite_saldo}
              onChangeEvent={(event, maskedvalue, floatvalue) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    limite_saldo: floatvalue,
                  },
                }))
              }
              error={errors["limite_saldo"]}
              gridSm={12}
            />
          )}

          <Grid item xs={12}>
            <SelectConta
              label={"Conta Transacional"}
              value={conta?.beneficio?.conta_id}
              onChange={(value) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    conta_id: value,
                  },
                }))
              }
              required
              error={errors["conta_id"]}
              helperText={
                errors["conta_id"] ? errors["conta_id"]?.join(" ") : null
              }
            />
          </Grid>

          <Grid item xs={12}>
            <SelectConta
              label={"Conta MDR"}
              value={conta?.beneficio?.conta_mdr_id}
              onChange={(value) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    conta_mdr_id: value,
                  },
                }))
              }
              required
              error={errors["conta_mdr_id"]}
              helperText={
                errors["conta_mdr_id"]
                  ? errors["conta_mdr_id"]?.join(" ")
                  : null
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Nome da prefeitura"}
              value={conta?.beneficio?.nome_prefeitura}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    nome_prefeitura: e.target.value,
                  },
                }))
              }
              error={errors["nome_prefeitura"]}
              helperText={
                errors["nome_prefeitura"]
                  ? errors["nome_prefeitura"]?.join(" ")
                  : null
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Sigla da prefeitura"}
              value={conta?.beneficio?.sigla}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    sigla: e.target.value,
                  },
                }))
              }
              error={errors["sigla"]}
              helperText={errors["sigla"] ? errors["sigla"]?.join(" ") : null}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <ReactInputMask
              mask={"99.999.999/9999-99"}
              value={conta?.beneficio?.documento}
              onChange={(e) =>
                setConta((prev) => ({
                  ...prev,
                  beneficio: {
                    ...prev.beneficio,
                    documento: e.target.value,
                  },
                }))
              }
            >
              {() => (
                <TextField
                  label={"CNPJ"}
                  error={errors["documento"]}
                  helperText={
                    errors["documento"] ? errors["documento"]?.join(" ") : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </ReactInputMask>
          </Grid>
        </>
      ) : null}
    </Grid>
  );
}
