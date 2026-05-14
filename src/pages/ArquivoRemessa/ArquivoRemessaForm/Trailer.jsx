import { Box, Grid } from "@material-ui/core";
import TextFieldController from "../../../components/FormFields/TextFieldController";

const Trailer = ({ error, control }) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop={2}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextFieldController
            control={control}
            error={error}
            nameController="trailer.numero_sequencial"
            nameField="numero_sequencial"
            label="Número sequencial"
            required
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldController
            control={control}
            error={error}
            nameController="trailer.tipo_registro"
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

export default Trailer;
