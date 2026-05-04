import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Collapse, IconButton, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
import { APP_CONFIG } from "../../constants/config";

const StyledTableCell = withStyles((theme) => ({
  head: {
    boxSizing: "",
    fontSize: 17,
    fontFamily: "Montserrat-Regular",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
    [theme.breakpoints.down("sm")]: { fontSize: 14 },
  },
  body: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-Regular",
    fontSize: 15,

    [theme.breakpoints.down("sm")]: { fontSize: 12 },
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    "&:hover": {
      // cursor: "pointer",
      backgroundColor: APP_CONFIG.mainCollors.backgrounds,
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

const CustomRow = ({
  row,
  itemColumns,
  handleClickRow,
  itemDataKey,
  open,
  rowIndex,
  compacta,
  EditarCollapse,
}) => {
  return (
    <>
      <TableRow style={{ borderWidth: 0 }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={100}>
          <Collapse in={open === rowIndex} timeout="auto" unmountOnExit>
            <>
              <Table size="small" style={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow size={compacta ? "small" : null}>
                    {itemColumns.map((column) => (
                      <StyledTableCell
                        align="left"
                        key={column.headerText}
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        {column.headerText}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemDataKey
                    ? row[itemDataKey].map((row) => (
                        <StyledTableRow
                          size={compacta ? "small" : null}
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column) => (
                            <>
                              <StyledTableCell align="left">
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                                {column.key === "menuCollapse" ? (
                                  <EditarCollapse row={row} key={row.id} />
                                ) : null}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                      ))
                    : row.funcionarios
                    ? row.funcionarios.map((row) => (
                        <StyledTableRow
                          size={compacta ? "small" : null}
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column) => (
                            <>
                              <StyledTableCell align="left">
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                                {column.key === "menuCollapse" ? (
                                  <EditarCollapse row={row} key={row.id} />
                                ) : null}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                      ))
                    : row.items
                    ? row.items.map((row) => (
                        <StyledTableRow
                          size={compacta ? "small" : null}
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column) => (
                            <>
                              <StyledTableCell align="left">
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                                {column.key === "menuCollapse" ? (
                                  <EditarCollapse row={row} key={row.id} />
                                ) : null}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                      ))
                    : row.itens
                    ? row.itens.map((row) => (
                        <StyledTableRow
                          size={compacta ? "small" : null}
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column) => (
                            <>
                              <StyledTableCell align="left">
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                                {column.key === "menuCollapse" ? (
                                  <EditarCollapse row={row} key={row.id} />
                                ) : null}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                      ))
                    : row.beneficiarios
                    ? row.beneficiarios.map((row) => (
                        <StyledTableRow
                          size={compacta ? "small" : null}
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column) => (
                            <>
                              <StyledTableCell align="left">
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                                {column.key === "menuCollapse" ? (
                                  <EditarCollapse row={row} key={row.id} />
                                ) : null}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                      ))
                    : row.estabelecimentos
                    ? row.estabelecimentos.map((row) => (
                        <StyledTableRow
                          size={compacta ? "small" : null}
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column) => (
                            <>
                              <StyledTableCell align="left">
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                                {column.key === "menuCollapse" ? (
                                  <EditarCollapse row={row} key={row.id} />
                                ) : null}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                      ))
                    : row.aluguel
                    ? row.aluguel.map((row) => (
                        <StyledTableRow
                          size={compacta ? "small" : null}
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column) => (
                            <>
                              <StyledTableCell align="left">
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                                {column.key === "menuCollapse" ? (
                                  <EditarCollapse row={row} key={row.id} />
                                ) : null}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                      ))
                    : row.erros
                    ? row.erros.map((row) => (
                        <StyledTableRow
                          size={compacta ? "small" : null}
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column) => (
                            <>
                              <StyledTableCell align="left">
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CustomCollapseTable = ({
  data,
  columns,
  itemColumns,
  handleClickRow,
  conta,
  Editar,
  noCollapse,
  compacta,
  EditarCollapse,
  itemDataKey,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow size={compacta ? "small" : null}>
              {columns.map((column) => (
                <>
                  <StyledTableCell
                    align="center"
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                  >
                    {column.headerText}
                  </StyledTableCell>
                </>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <>
                  <TableRow key={row.name} size={compacta ? "small" : null}>
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
                    {noCollapse ? null : (
                      <Box
                        style={{
                          display: "flex",
                          alignSelf: "center",
                          alignItems: "center",
                          verticalAlign: "center",
                          marginTop: "10%",

                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => {
                            if (open === rowIndex) {
                              setOpen(null);
                            } else {
                              setOpen(rowIndex);
                            }
                          }}
                          style={{
                            verticalAlign: "center",
                            padding: "8px",
                            border: "1px solid gray",
                          }}
                        >
                          {open === rowIndex ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </Box>
                    )}
                  </TableRow>
                  <CustomRow
                    EditarCollapse={EditarCollapse}
                    noCollapse={noCollapse}
                    open={open}
                    row={row}
                    rowIndex={rowIndex}
                    itemDataKey={itemDataKey}
                    itemColumns={itemColumns}
                    handleClickRow={handleClickRow}
                    conta={conta}
                    compacta={compacta}
                  />
                </>
              ))
            ) : (
              <TableRow size={compacta ? "small" : null}>
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

export default CustomCollapseTable;
