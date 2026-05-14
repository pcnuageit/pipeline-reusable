import { Box, Tooltip, Typography } from "@material-ui/core";
import InfoIcon from "@mui/icons-material/Info";

const mappedStatus = {
  1: "BAIXADO",
  2: "ABERTO",
  3: "CANCELADO",
  4: "BAIXA DEPENDENCIA",
  999: "EXCLUÍDO",
};
const statusColors = {
  1: "green",
  2: "#dfad06",
  3: "red",
  4: "red",
  999: "red",
};
const mappedStatusDetails = {};

const IndexStatusColumn = ({ status }) => {
  return (
    <Box
      style={{
        display: "flex",
        padding: "6px",
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
      }}
      bgcolor={statusColors[status] || "gray"}
    >
      <Typography variant="body2" style={{ color: "white" }}>
        {mappedStatus[status] ? mappedStatus[status] : status}
      </Typography>
      {mappedStatusDetails[status] && (
        <Tooltip title={mappedStatusDetails[status]}>
          <InfoIcon style={{ color: "white" }} value={status} />
        </Tooltip>
      )}
    </Box>
  );
};

export default IndexStatusColumn;
