import { Box, Grid } from "@material-ui/core";
import DateFieldController from "../../../components/FormFields/DateFieldController";
import StringFieldController from "../../../components/FormFields/StringFieldController";
import TextFieldController from "../../../components/FormFields/TextFieldController";

const Header = ({ error, control, disabled }) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop={2}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.agencia"
            nameField="agencia"
            label="Agencia"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.codigo_banco"
            nameField="codigo_banco"
            label="Código do banco"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.codigo_servico"
            nameField="codigo_servico"
            label="Código de serviço"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.conta"
            nameField="conta"
            label="Conta"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DateFieldController
            control={control}
            error={error}
            nameController="header.data_geracao"
            nameField="data_geracao"
            label="Data de geração"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.literal_remessa"
            nameField="literal_remessa"
            label="Literal de remessa"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.literal_servico"
            nameField="literal_servico"
            label="Literal de serviço"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StringFieldController
            control={control}
            error={error}
            nameController="header.nome_banco"
            nameField="nome_banco"
            label="Nome do banco"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StringFieldController
            control={control}
            error={error}
            nameController="header.nome_empresa"
            nameField="nome_empresa"
            label="Nome da empresa"
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.dac"
            nameField="dac"
            label="DAC"
            required
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.numero_sequencial"
            nameField="numero_sequencial"
            label="Número sequencial"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.operacao"
            nameField="operacao"
            label="Operação"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextFieldController
            control={control}
            error={error}
            nameController="header.tipo_registro"
            nameField="tipo_registro"
            label="Tipo de registro"
            required
            disabled={true}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
