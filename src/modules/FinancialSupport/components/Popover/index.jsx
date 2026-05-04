import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PopoverMUI from "@material-ui/core/Popover";
import React from "react";

export default function Popover({ children, buttonContent }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button
        style={{
          padding: 0,
          width: 24,
        }}
        aria-describedby={id}
        variant="text"
        onClick={handleClick}
      >
        {buttonContent}
      </Button>
      <PopoverMUI
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box padding={1}>{children}</Box>
      </PopoverMUI>
    </div>
  );
}
