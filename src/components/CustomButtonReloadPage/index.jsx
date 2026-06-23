import { Box, IconButton } from "@material-ui/core";
import { Refresh } from "@mui/icons-material";
import { APP_CONFIG } from "../../constants/config";

export default function CustomButtonReloadPage() {
  return (
    <Box style={{ alignSelf: "flex-end" }}>
      <IconButton
        style={{
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          color: APP_CONFIG.mainCollors.primary,
        }}
        onClick={() => window.location.reload(false)}
      >
        <Refresh />
      </IconButton>
    </Box>
  );
}
