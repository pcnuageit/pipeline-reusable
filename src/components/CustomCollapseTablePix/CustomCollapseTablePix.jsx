import { Box, Collapse, IconButton, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { get } from "lodash";
import React, { useState } from "react";
import { APP_CONFIG } from "../../constants/config";

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 17,
    fontFamily: "Montserrat-SemiBold",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
    [theme.breakpoints.down("sm")]: {},
  },
  body: {
    /* borderRadius: '27px', */
    display: "flex",

    fontSize: 16,
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    /* '&:hover': {
			cursor: 'pointer',
			backgroundColor: APP_CONFIG.mainCollors.primary,
		}, */
  },
}))(TableRow);

const useStyles = makeStyles({
  tableContainer: {
    /* borderRadius: '27px', */
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
  },

  table: {
    /* minWidth: 700, */
  },
});

const CustomRow = ({
  row,
  itemColumns,
  handleClickRow,
  conta,
  open,
  rowIndex,
}) => {
  return (
    <>
      {/* <TableRow
				style={{
					padding: '0px 10px',
					margin: '0px',
				}}
			></TableRow> */}

      <TableRow style={{ borderWidth: 0 }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={100}>
          <Box style={{ height: "10px" }}></Box>
          <Collapse in={open === rowIndex} timeout="auto" unmountOnExit>
            <>
              <Table size="small" style={{ minWidth: "100%" }}>
                {/* <TableHead>
									<TableRow>
										{itemColumns.map((column) => (
											<StyledTableCell
												align="left"
												key={column.headerText}
												style={{ color: APP_CONFIG.mainCollors.primary }}
											>
												{column.headerText}
											</StyledTableCell>
										))}
									</TableRow>
								</TableHead> */}
                <TableBody
                /* style={{ display: 'flex', flexDirection: 'row' }} */
                >
                  {row.items ? (
                    row.items.map((row, index) => (
                      <>
                        <StyledTableRow
                          onClick={
                            handleClickRow ? () => handleClickRow(row) : null
                          }
                        >
                          {itemColumns.map((column, index) => (
                            <>
                              <StyledTableCell
                                align="left"
                                style={{ border: "0px" }}
                              >
                                {column.CustomValue
                                  ? column.CustomValue(get(row, column.key))
                                  : get(row, column.key)}
                              </StyledTableCell>
                            </>
                          ))}
                        </StyledTableRow>
                        <Box
                          style={{
                            backgroundColor: "#cccc",
                            height: "1px",
                            width: "100%",
                          }}
                        />
                      </>
                    ))
                  ) : (
                    <StyledTableRow>
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
                  )}
                </TableBody>
              </Table>
            </>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CustomCollapseTablePix = ({
  data,
  columns,
  itemColumns,
  handleClickRow,
  conta,
  Editar,
  noCollapse,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [checkBox, setCheckBox] = useState(false);
  console.log(data);
  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead></TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <>
                  <TableRow
                    key={row.name}
                    style={{
                      maxHeight: "70px",
                      backgroundColor: "white",
                      borderRadius: "40px",
                      display: "flex",
                      alignItems: "center",
                      /* width: '100%', */
                      /* justifyContent: 'space-evenly', */
                    }}
                    /* style={{
											display: 'flex',
											justifyContent: 'space-between',
										}} */
                  >
                    {columns.map((column, index) => (
                      <>
                        {index === 0 ? (
                          <StyledTableCell
                            align="center"
                            style={{
                              borderWidth: "0px",
                              backgroundColor:
                                APP_CONFIG.mainCollors.backgrounds,
                              height: "70px",
                              width: "110px",
                            }}
                            /* style={{
															borderRadius: '27px',
															backgroundColor: 'red',
														}} */
                          >
                            {column.CustomValue
                              ? column.CustomValue(get(row, column.key))
                              : get(row, column.key)}
                            {column.FullObject ? column.FullObject(row) : null}
                            {column.key === "menu" ? (
                              <Editar row={row} key={row.id} />
                            ) : null}
                          </StyledTableCell>
                        ) : index === 1 ? (
                          <Box
                            style={{
                              backgroundColor:
                                APP_CONFIG.mainCollors.backgrounds,
                            }}
                          >
                            <StyledTableCell
                              align="center"
                              style={{
                                borderWidth: "0px",
                                backgroundColor: "white",
                                borderTopLeftRadius: "32px",
                                borderBottomLeftRadius: "32px",
                                height: "70px",
                                display: "flex",
                                alignItems: "center",
                              }}
                              /* style={{
														borderRadius: '27px',
														backgroundColor: 'red',
													}} */
                            >
                              {column.CustomValue
                                ? column.CustomValue(get(row, column.key))
                                : get(row, column.key)}
                              {column.FullObject
                                ? column.FullObject(row)
                                : null}
                              {column.key === "menu" ? (
                                <Editar row={row} key={row.id} />
                              ) : null}
                            </StyledTableCell>
                          </Box>
                        ) : (
                          <StyledTableCell
                            align="center"
                            style={{
                              borderWidth: "0px",
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                            /* style={{
															borderRadius: '27px',
															backgroundColor: 'red',
														}} */
                          >
                            {column.CustomValue
                              ? column.CustomValue(get(row, column.key))
                              : get(row, column.key)}
                            {column.FullObject ? column.FullObject(row) : null}
                            {column.key === "menu" ? (
                              <Editar row={row} key={row.id} />
                            ) : null}
                          </StyledTableCell>
                        )}
                      </>
                    ))}
                    {noCollapse ? null : (
                      <Box
                        style={{
                          display: "flex",
                          alignSelf: "center",
                          marginRight: "20px",
                          justifyContent: "flex-end",
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
                    noCollapse={noCollapse}
                    open={open}
                    row={row}
                    rowIndex={rowIndex}
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

export default CustomCollapseTablePix;
