import { Box, Typography, useTheme } from "@material-ui/core";
import DetailsItem from "./DetailsItem";

const DetailsList = ({ fields, control, errors, disabled }) => {
  const theme = useTheme();

  return (
    <Box>
      {fields.map((detail, index) => {
        return (
          <Box marginBottom={5}>
            <Typography
              variant="h6"
              style={{ color: theme.palette.background.default }}
            >
              DETALHE {index + 1}
            </Typography>
            <DetailsItem
              control={control}
              index={index}
              error={errors ? errors[index] : null}
              disabled={disabled}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default DetailsList;
