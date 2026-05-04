import {
  Box,
  Collapse,
  IconButton,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { get } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getFolhaPagamentoFuncionarioAction } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import CustomTable from "../CustomTable/CustomTable";

const StyledTableCell = withStyles((theme) => ({
  head: {
    boxSizing: "",
    fontSize: 17,
    fontFamily: "Montserrat-SemiBold",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
    [theme.breakpoints.down("sm")]: { fontSize: 14 },
  },
  body: {
    fontSize: 15,
    color: APP_CONFIG.mainCollors.primary,
    [theme.breakpoints.down("sm")]: { fontSize: 12 },
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: APP_CONFIG.mainCollors.primary,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  tableContainer: {
    borderRadius: "0px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
  },
  table: {
    minWidth: 300,
  },
});

const CustomRow = ({ row, itemColumns, handleClickRow, conta }) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const token = useAuth();
  const folhaPagamentoFuncionario = useSelector(
    (state) => state.folhaPagamentoFuncionario
  );

  const handleExpandirRequest = async () => {
    const reshandleExpandirRequest = await dispatch(
      getFolhaPagamentoFuncionarioAction(
        token,
        row.conta_id,
        row.conta_funcionario_id
      )
    );
    if (reshandleExpandirRequest) {
      toast.error("erro");
    } else {
      return null;
    }
  };

  return (
    <>
      <TableRow
        style={{
          padding: "0px 10px",
          margin: "0px",
        }}
      >
        {/* <TableCell
					style={{
						padding: '0px 10px',
						margin: '0px',
						display: 'flex',
						alignItems: 'center',
					}}
				> */}
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => {
            setOpen(!open);
            handleExpandirRequest(row);
          }}
          style={{
            padding: "8px",
            border: "1px solid gray",
          }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        {/* </TableCell> */}
        {/* <TableCell />
				<TableCell /> */}
      </TableRow>

      <TableRow style={{ borderWidth: 0 }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 10 }} colSpan={100}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <>
              {folhaPagamentoFuncionario &&
              folhaPagamentoFuncionario.data &&
              folhaPagamentoFuncionario.data.length > 0 ? (
                <CustomTable
                  data={folhaPagamentoFuncionario.data}
                  columns={itemColumns}
                />
              ) : (
                <LinearProgress />
              )}
            </>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        {/* <TableCell /> */}
        {/* 	<TableCell /> */}
        {/* <TableCell /> */}
      </TableRow>
    </>
  );
};

const CustomCollapseTableEmpresa = ({
  data,
  columns,
  itemColumns,
  handleClickRow,
  conta,
  Editar,
}) => {
  const classes = useStyles();
  return (
    <>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <>
                  <StyledTableCell align="center">
                    {column.headerText}
                  </StyledTableCell>
                </>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <>
                  <TableRow key={row.name}>
                    {columns.map((column) => (
                      <>
                        <StyledTableCell align="center">
                          {column.CustomValue
                            ? column.CustomValue(get(row, column.key))
                            : get(row, column.key)}
                          {column.FullObject ? column.FullObject(row) : null}

                          {column.key === "menu" ? (
                            <Editar row={row} key={row.id} />
                          ) : null}
                        </StyledTableCell>
                      </>
                    ))}
                  </TableRow>
                  <CustomRow
                    row={row}
                    itemColumns={itemColumns}
                    handleClickRow={handleClickRow}
                    conta={conta}
                  />
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      size="5x"
                      style={{ marginBottom: "12px", color: "#ccc" }}
                    />
                    <Typography variant="h6" style={{ color: "#ccc" }}>
                      Não há dados para serem exibidos
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomCollapseTableEmpresa;
