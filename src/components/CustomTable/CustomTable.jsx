import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { get } from "lodash";

import { APP_CONFIG } from "../../constants/config";

const StyledTableCell = withStyles((theme) => ({
  head: {
    boxSizing: "",
    fontSize: 17,
    fontFamily: "Montserrat-Regular",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: APP_CONFIG.mainCollors.primary,
    [theme.breakpoints.down("sm")]: {},
  },
  body: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-Regular",
    fontSize: 15,

    [theme.breakpoints.down("sm")]: { fontSize: 12 },
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    },
    [theme.breakpoints.down("sm")]: {},
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    borderRadius: "0px",
    [theme.breakpoints.down("sm")]: { minWidth: "400px" },
  },
  table: {
    [theme.breakpoints.down("sm")]: {},
  },
}));

const CustomTable = ({
  columns,
  data,
  Editar,
  compacta,
  handleClickRow,
  boxShadowTop,
}) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table
          className={classes.table}
          aria-label="customized table"
          size={compacta ? "small" : null}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.headerText}
                  align="center"
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                >
                  {column.headerText}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <StyledTableRow
                  size={compacta ? "small" : null}
                  key={row.name}
                  onClick={handleClickRow ? () => handleClickRow(row) : null}
                  style={handleClickRow ? { cursor: "pointer" } : {}}
                >
                  {columns.map((column) => (
                    <StyledTableCell align="center">
                      {column.key === "menu" && Editar ? (
                        <Editar row={row} key={row.id} />
                      ) : null}
                      {column.Teste ? column.Teste(row) : null}
                      {column.CustomValue
                        ? column.CustomValue(get(row, column.key))
                        : get(row, column.key)}
                      {column.FullObject ? column.FullObject(row) : null}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
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

export default CustomTable;
