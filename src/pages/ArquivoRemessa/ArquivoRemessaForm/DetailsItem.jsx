import { Box, Grid } from "@material-ui/core";
import CurrencyFieldController from "../../../components/FormFields/CurrencyFieldController";
import DateFieldController from "../../../components/FormFields/DateFieldController";
import StringFieldController from "../../../components/FormFields/StringFieldController";
import TextFieldController from "../../../components/FormFields/TextFieldController";

const DetailsItem = ({ control, index, error, disabled }) => {
  return (
    <Box marginTop={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.abatimento`}
            nameField="abatimento"
            label="Abatimento"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.aceite`}
            nameField="aceite"
            label="Aceite"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.agencia`}
            nameField="agencia"
            label="Agência"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.agencia_cobradora`}
            nameField="agencia_cobradora"
            label="Agência cobradora"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StringFieldController
            control={control}
            error={error}
            nameController={`details.${index}.bairro`}
            nameField="bairro"
            label="Bairro"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.carteira`}
            nameField="carteira"
            label="Carteira"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.cep`}
            nameField="cep"
            label="CEP"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.codigo_banco`}
            nameField="codigo_banco"
            label="Código do banco"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.codigo_inscricao_empresa`}
            nameField="codigo_inscricao_empresa"
            label="Código de inscrição da empresa"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.codigo_inscricao_pagador`}
            nameField="codigo_inscricao_pagador"
            label="Código de inscrição do pagador"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.codigo_ocorrencia`}
            nameField="codigo_ocorrencia"
            label="Código de ocorrência"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.conta`}
            nameField="conta"
            label="Conta"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.dac`}
            nameField="dac"
            label="DAC"
            required
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <DateFieldController
            control={control}
            error={error}
            nameController={`details.${index}.data_de_mora`}
            nameField="data_de_mora"
            label="Data de mora"
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DateFieldController
            control={control}
            error={error}
            nameController={`details.${index}.data_emissao`}
            nameField="data_emissao"
            label="Data de emissão"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DateFieldController
            control={control}
            error={error}
            nameController={`details.${index}.desconto_ate`}
            nameField="desconto_ate"
            label="Desconto até"
            disabled={disabled}
          />
        </Grid>
        {/* <Grid item xs={6} sm={6}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.detalhe_multa`}
            nameField="detalhe_multa"
            label="Detalhe da multa"
            disabled={true}
          />
        </Grid> */}
        <Grid item xs={12} sm={2}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.especie`}
            nameField="especie"
            label="Espécie"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <StringFieldController
            control={control}
            error={error}
            nameController={`details.${index}.estado`}
            nameField="estado"
            label="Estado"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.instrucao`}
            nameField="instrucao"
            label="Instrução"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.instrucao_1`}
            nameField="instrucao_1"
            label="Instrução 1"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.instrucao_2`}
            nameField="instrucao_2"
            label="Instrução 2"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CurrencyFieldController
            control={control}
            error={error}
            nameController={`details.${index}.juros_um_dia`}
            nameField="juros_um_dia"
            label="Juros em um dia"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <StringFieldController
            control={control}
            error={error}
            nameController={`details.${index}.logradouro`}
            nameField="logradouro"
            label="Logradouro"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StringFieldController
            control={control}
            error={error}
            nameController={`details.${index}.nome`}
            nameField="nome"
            label="Nome"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.nosso_numero`}
            nameField="nosso_numero"
            label="Nosso número"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.numero_carteira`}
            nameField="numero_carteira"
            label="Número da carteira"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.numero_documento`}
            nameField="numero_documento"
            label="Número do documento"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.numero_inscricao_empresa`}
            nameField="numero_inscricao_empresa"
            label="Número de inscrição da empresa"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.numero_inscricao_pagador`}
            nameField="numero_inscricao_pagador"
            label="Número de inscrição do pagador"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.numero_sequencial`}
            nameField="numero_sequencial"
            label="Número sequencial"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.prazo`}
            nameField="prazo"
            label="Prazo"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.qtd_moeda`}
            nameField="qtd_moeda"
            label="Quantidade de moeda"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.sacador_avalista`}
            nameField="sacador_avalista"
            label="Sacador avalista"
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.tipo_registro`}
            nameField="tipo_registro"
            label="Tipo de registro"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.uso_da_empresa`}
            nameField="uso_da_empresa"
            label="Uso da empresa"
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.uso_do_banco`}
            nameField="uso_do_banco"
            label="Uso do banco"
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CurrencyFieldController
            control={control}
            error={error}
            nameController={`details.${index}.valor_desconto`}
            nameField="valor_desconto"
            label="Valor do desconto"
            required
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController={`details.${index}.valor_iof`}
            nameField="valor_iof"
            label="Valor do IOF"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CurrencyFieldController
            control={control}
            error={error}
            nameController={`details.${index}.valor_titulo`}
            nameField="valor_titulo"
            label="Valor do título"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DateFieldController
            control={control}
            error={error}
            nameController={`details.${index}.vencimento`}
            nameField="vencimento"
            label="Data de vencimento"
            required
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetailsItem;
