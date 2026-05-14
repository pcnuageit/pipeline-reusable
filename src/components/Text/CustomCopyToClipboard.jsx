import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextField, Tooltip } from "@material-ui/core";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";

const CustomCopyToClipboard = ({
  title = "Copiar",
  value,
  message = "Copiado para area de transferência",
}) => {
  return (
    <Box width="100%" maxWidth={330} display="flex">
      <TextField fullWidth value={value} onClick={(e) => e.stopPropagation()} />
      <Tooltip title={title}>
        <CopyToClipboard text={value}>
          <Button
            aria="Copiar"
            style={{
              marginLeft: "8px",
              padding: 0,
              minWidth: 0,
              width: "20px",
              height: "20px",
              alignSelf: "center",
              color: "green",
            }}
            onClick={(e) => {
              e.stopPropagation();
              toast.success(message, {
                autoClose: 2000,
              });
            }}
          >
            <FontAwesomeIcon
              style={{
                width: "20px",
                height: "20px",
              }}
              icon={faCopy}
            />
          </Button>
        </CopyToClipboard>
      </Tooltip>
    </Box>
  );
};

export default CustomCopyToClipboard;
