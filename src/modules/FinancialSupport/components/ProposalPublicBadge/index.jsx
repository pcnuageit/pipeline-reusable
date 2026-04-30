import { Box, Typography } from "@material-ui/core";
import React from "react";

function ProposalPublicBadge({ isPublic }) {
  return (
    <Box
      padding={"4px 8px"}
      borderRadius={28}
      bgcolor={isPublic ? "green" : "gray"}
    >
      <Typography variant="body2" color="secondary">
        {isPublic ? "ABERTA" : "PRIVADA"}
      </Typography>
    </Box>
  );
}

export default ProposalPublicBadge;
