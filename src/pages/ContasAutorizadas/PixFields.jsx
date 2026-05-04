import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import SelectBanco from "../../components/SelectBanco";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";

export default function PixFields({
  conta = {},
  setConta = () => null,
  errors = {},
}) {
  const [mascara, setMascara] = useState("");

  const applyMask = (tipo) => {
    if (tipo === "0") setMascara("999.999.999-99");
    if (tipo === "1") setMascara("99.999.999/9999-99");
    if (tipo === "2")
      setMascara(
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      );
    if (tipo === "3") setMascara("(99) 99999-9999");
    if (tipo === "4") setMascara("********-****-****-****-************");
  };

  useEffect(() => {
    applyMask(conta?.tipo);
  }, [conta?.tipo]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
        <InputLabel id="tipo-transfer-select" shrink="true">
          Tipo da transferência*
        </InputLabel>
        <Select
          labelId="tipo-transfer-select"
          value={conta.tipo_transferencia}
          onChange={(e) => {
            setConta({
              ...conta,
              tipo_transferencia: e.target.value,
            });
          }}
          variant="outlined"
          fullWidth
          required
        >
          <MenuItem value={"Dict"}>Chave Pix</MenuItem>
          <MenuItem value={"Manual"}>Agência e Conta</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={12} sm={12}>
        <TextField
          label="Nome do cadastro"
          value={conta.nome}
          onChange={(e) => {
            setConta({
              ...conta,
              nome: e.target.value,
            });
          }}
          error={errors?.nome}
          helperText={errors?.nome ? errors?.nome?.join(" ") : null}
          variant="outlined"
          fullWidth
          required
        />
      </Grid>

      {conta.tipo_transferencia == "Manual" ? (
        <>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Nome da conta"
              value={conta.nome_conta}
              onChange={(e) => {
                setConta({
                  ...conta,
                  nome_conta: e.target.value,
                });
              }}
              error={errors?.nome_conta}
              helperText={
                errors?.nome_conta ? errors?.nome_conta?.join(" ") : null
              }
              variant="outlined"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextFieldCpfCnpj
              label={"CPF/CNPJ"}
              value={conta.documento_conta}
              onChange={(e) => {
                setConta({
                  ...conta,
                  documento_conta: e.target.value,
                });
              }}
              error={errors?.documento_conta}
              helperText={
                errors?.documento_conta
                  ? errors?.documento_conta?.join(" ")
                  : null
              }
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <InputLabel id="tipo-conta-select" shrink="true">
              Tipo da conta*
            </InputLabel>
            <Select
              labelId="tipo-conta-select"
              value={conta.tipo_conta}
              onChange={(e) => {
                setConta({
                  ...conta,
                  tipo_conta: e.target.value,
                });
              }}
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value={"conta_corrente"}>Conta Corrente</MenuItem>
              <MenuItem value={"conta_salario"}>Conta salário</MenuItem>
              <MenuItem value={"conta_poupanca"}>Conta poupança</MenuItem>
              <MenuItem value={"conta_pagamento"}>Conta pré-paga</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              error={errors?.agencia}
              helperText={errors?.agencia ? errors?.agencia?.join(" ") : null}
              label="Agência"
              type="number"
              value={conta.agencia}
              onChange={(e) => {
                setConta({
                  ...conta,
                  agencia: e.target.value.toString().slice(0, 5),
                });
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              error={errors?.numero_conta}
              helperText={
                errors?.numero_conta ? errors?.numero_conta?.join(" ") : null
              }
              label="Conta"
              type="number"
              value={conta.numero_conta}
              onChange={(e) => {
                setConta({
                  ...conta,
                  numero_conta: e.target.value.toString().slice(0, 10),
                });
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              label="Digito da conta"
              type="number"
              error={errors?.digito_conta}
              helperText={
                errors?.digito_conta ? errors?.digito_conta?.join(" ") : null
              }
              value={conta.digito_conta}
              onChange={(e) => {
                setConta({
                  ...conta,
                  digito_conta: e.target.value.toString().slice(0, 1),
                });
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <SelectBanco
              value={conta.banco}
              onChange={(e, value) =>
                setConta({
                  ...conta,
                  banco: value?.valor ?? "",
                })
              }
              error={errors?.banco}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} sm={12}>
            <TextFieldCpfCnpj
              label={"CPF/CNPJ"}
              value={conta.documento}
              onChange={(e) => {
                setConta({
                  ...conta,
                  documento: e.target.value,
                });
              }}
              error={errors?.documento}
              helperText={
                errors?.documento ? errors?.documento?.join(" ") : null
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <InputLabel id="tipo-chave-select" shrink="true">
              Tipo da chave*
            </InputLabel>
            <Select
              labelId="tipo-chave-select"
              value={conta.tipo}
              onChange={(e) => {
                setConta({
                  ...conta,
                  tipo: e.target.value,
                });
              }}
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value={"0"}>CPF</MenuItem>
              <MenuItem value={"1"}>CNPJ</MenuItem>
              <MenuItem value={"2"}>EMAIL</MenuItem>
              <MenuItem value={"3"}>TELEFONE</MenuItem>
              <MenuItem value={"4"}>EVP</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={12}>
            <ReactInputMask
              mask={mascara}
              maskChar={null}
              formatChars={{
                9: "[0-9]",
                a: "[A-Za-z]",
                "*": "[A-Za-z0-9]",
                x: "[a-zA-Z0-9._%+-@]",
              }}
              value={conta.chave_recebedor}
              onChange={(e) => {
                setConta({
                  ...conta,
                  chave_recebedor: e.target.value,
                });
              }}
            >
              {() => (
                <TextField
                  label="Chave Pix"
                  error={errors?.chave_recebedor}
                  helperText={
                    errors?.chave_recebedor
                      ? errors?.chave_recebedor?.join(" ")
                      : null
                  }
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            </ReactInputMask>
          </Grid>
        </>
      )}
    </Grid>
  );
}
