import { Box, Tooltip, Typography } from "@material-ui/core";
import InfoIcon from "@mui/icons-material/Info";

const mappedStatus = {
  1: "ATIVO",
  2: "CANCELADO",
  3: "PENDENTE",
  4: "INADIMPLENTE 30 DIAS",
  5: "NEGADO",
  6: "INADIMPLENTE PENDENTE VISTORIA",
  7: "INADIMPLENTE",
};
const statusColors = {
  1: "green",
  2: "red",
  3: "yellow",
  4: "orange",
  5: "red",
  6: "orange",
  7: "orange",
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
