import { Box, Button, LinearProgress, Menu, MenuItem } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { delContaBancaria, loadContaBancaria } from "../../../actions/actions";
import useAuth from "../../../hooks/useAuth";
import CustomTable from "../../CustomTable/CustomTable";

const columns = [
  { headerText: "Banco", key: "banco" },
  { headerText: "Agência", key: "agencia" },
  { headerText: "Tipo", key: "tipo" },
  { headerText: "Número da conta", key: "conta" },
  { headerText: "Excluir", key: "menu" },
];

const ListBankAccounts = () => {
  const contasBancariasUser = useSelector((state) => state.contasBancarias);
  const id = useParams()?.id ?? "";
  const token = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadContaBancaria(token, id));
  }, []);

  const Editar = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleExcluir = async (row) => {
      dispatch(delContaBancaria(token, row.id, id));
      setAnchorEl(null);
    };

    return (
      <Box>
        <Button
          style={{ height: "15px", width: "10px" }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          ...
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleExcluir(row)}>Excluir</MenuItem>
        </Menu>
      </Box>
    );
  };

  return (
    <>
      {contasBancariasUser ? (
        <CustomTable
          columns={columns}
          data={contasBancariasUser}
          Editar={Editar}
          compacta="true"
        />
      ) : (
        <LinearProgress />
      )}
    </>
  );
};

export default ListBankAccounts;
