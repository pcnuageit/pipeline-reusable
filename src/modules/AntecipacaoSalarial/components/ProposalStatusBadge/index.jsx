import { Box, Typography } from "@material-ui/core";
import React from "react";

function ProposalStatusBadge({ active }) {
  return (
    <Box
      padding={"4px 8px"}
      borderRadius={28}
      bgcolor={active ? "green" : "red"}
    >
      <Typography variant="body2" color="secondary">
        {active ? "Ativo" : "Inativo"}
      </Typography>
    </Box>
  );
}

export default ProposalStatusBadge;
