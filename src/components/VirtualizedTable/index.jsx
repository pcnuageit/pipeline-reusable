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
import { Close } from "@material-ui/icons";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { get } from "lodash";
import React, { useMemo, useState } from "react";
import { AutoSizer, List } from "react-virtualized";
import { APP_CONFIG } from "../../constants/config";

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 17,
    fontFamily: "Montserrat-Regular",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
    [theme.breakpoints.down("sm")]: { fontSize: 14 },
  },
  body: {
    fontSize: 15,
    fontFamily: "Montserrat-Regular",
    color: APP_CONFIG.mainCollors.primary,
    [theme.breakpoints.down("sm")]: { fontSize: 12 },
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  tableContainer: {
    borderRadius: "0px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    height: "100%",
    width: "100%",
  },
  table: {
    minWidth: 300,
  },
  headerRow: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
});

const rowHeight = 76;

const DetailsRow = ({
  row,
  itemColumns,
  handleClickRow,
  open,
  rowIndex,
  EditarCollapse,
}) => {
  // Memoize the row items to avoid unnecessary rerenders
  const rowItems = useMemo(() => {
    const getItems = () => {
      if (row.funcionarios) return row.funcionarios;
      if (row.items) return row.items;
      if (row.itens) return row.itens;
      if (row.beneficiarios) return row.beneficiarios;
      if (row.estabelecimentos) return row.estabelecimentos;
      if (row.aluguel) return row.aluguel;
      if (row.erros) return row.erros;
      return [];
    };

    return getItems();
  }, [row]);

  // If not open or no items, return null inside the component
  if (!open || !rowItems || rowItems.length === 0) {
    return null;
  }

  return (
    <TableCell
      style={{
        padding: "0px",
        backgroundColor: APP_CONFIG.mainCollors.backgrounds,
      }}
    >
      <Collapse in={open === rowIndex} timeout="auto" unmountOnExit>
        <div
          style={{
            boxShadow: "0px 4px 8px rgba(0,0,0,0.35)",
            marginBottom: "0px",
            position: "relative",
            zIndex: 20,
          }}
        >
          <Table style={{ minWidth: "100%" }}>
            <TableHead>
              <TableRow>
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
              {rowItems.map((item) => (
                <StyledTableRow
                  key={item.id || Math.random()}
                  onClick={handleClickRow ? () => handleClickRow(item) : null}
                >
                  {itemColumns.map((column) => (
                    <StyledTableCell key={column.key} align="left">
                      {column.CustomValue
                        ? column.CustomValue(get(item, column.key))
                        : get(item, column.key)}
                      {column.key === "menuCollapse" && EditarCollapse ? (
                        <EditarCollapse row={item} key={item.id} />
                      ) : null}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Collapse>
    </TableCell>
  );
};

const DetailsRowMemo = React.memo(DetailsRow);

// Row renderer for virtualized list
const RowRenderer = ({
  index,
  length,
  columnWidth,
  style,
  key,
  data: {
    rowData,
    columns,
    Editar,
    noCollapse,
    open,
    setOpen,
    itemColumns,
    handleClickRow,
    conta,
    EditarCollapse,
  },
}) => {
  const row = rowData[index];
  const isOpen = open === index;

  if (!row) return null;

  return (
    <div
      key={key}
      style={{
        ...style,
        overflow: "visible",
        display: "block", // This is important
      }}
    >
      <Table
        style={{
          tableLayout: "fixed",
          width: "100%",
        }}
      >
        <TableBody>
          <TableRow key={row.name}>
            {columns.map((column) => (
              <StyledTableCell
                key={column.key}
                align="center"
                style={{
                  width: columnWidth,
                }}
              >
                {column.CustomValue
                  ? column.CustomValue(get(row, column.key))
                  : get(row, column.key)}
                {column.FullObject ? column.FullObject(row) : null}
                {column.key === "menu" && Editar ? (
                  <Editar row={row} key={row.id} />
                ) : null}
              </StyledTableCell>
            ))}

            {!noCollapse && (
              <StyledTableCell style={{ width: "60px" }}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => {
                      if (open === index) {
                        setOpen(null);
                      } else {
                        setOpen(index);
                      }
                    }}
                    style={{
                      padding: "6px",
                      border: "1px solid gray",
                    }}
                  >
                    {isOpen ? <Close /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </Box>
              </StyledTableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>

      {isOpen && (
        <div
          style={{
            position: "relative",
            backgroundColor: "transparent",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            bottom: index < length - 5 ? 0 : "400%",
          }}
        >
          <Box style={{ marginRight: columnWidth, zIndex: 10 }}>
            <DetailsRowMemo
              EditarCollapse={EditarCollapse}
              noCollapse={noCollapse}
              open={open}
              row={row}
              rowIndex={index}
              itemColumns={itemColumns}
              handleClickRow={handleClickRow}
              conta={conta}
            />
          </Box>
        </div>
      )}
    </div>
  );
};

const VirtualizedTable = ({
  data,
  columns,
  itemColumns,
  handleClickRow,
  conta,
  Editar,
  noCollapse,
  EditarCollapse,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(null);
  const columnWidth = `${100 / (columns.length + (noCollapse ? 0 : 1))}%`;

  const rowRendererData = useMemo(
    () => ({
      rowData: data || [],
      columns,
      Editar,
      noCollapse,
      open,
      setOpen,
      itemColumns,
      handleClickRow,
      conta,
      EditarCollapse,
    }),
    [
      data,
      columns,
      Editar,
      noCollapse,
      open,
      itemColumns,
      handleClickRow,
      conta,
      EditarCollapse,
    ]
  );

  if (!data || data.length === 0) {
    return (
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table style={{ width: "100%" }} aria-label="Tabela">
          <TableHead>
            <TableRow className={classes.headerRow}>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.headerText}
                  align="center"
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                    width: columnWidth,
                  }}
                >
                  {column.headerText}
                </StyledTableCell>
              ))}

              {!noCollapse && (
                <StyledTableCell style={{ width: 95 }}></StyledTableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + (!noCollapse ? 1 : 0)}>
                <Box display="flex" flexDirection="column" alignItems="center">
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
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table aria-label="Tabela">
        <TableHead>
          <TableRow className={classes.headerRow}>
            {columns.map((column) => (
              <StyledTableCell
                key={column.headerText}
                align="center"
                style={{
                  color: APP_CONFIG.mainCollors.primary,
                  width: columnWidth,
                }}
              >
                {column.headerText}
              </StyledTableCell>
            ))}

            {!noCollapse && (
              <StyledTableCell style={{ width: columnWidth }}></StyledTableCell>
            )}
          </TableRow>
        </TableHead>
      </Table>

      <div style={{ height: "54vh" }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowCount={data?.length ?? 0}
              rowHeight={rowHeight}
              rowRenderer={(props) =>
                RowRenderer({
                  ...props,
                  length: data?.length ?? 0,
                  columnWidth: columnWidth,
                  data: rowRendererData,
                })
              }
              overscanRowCount={5}
            />
          )}
        </AutoSizer>
      </div>
    </TableContainer>
  );
};

export default React.memo(VirtualizedTable);
