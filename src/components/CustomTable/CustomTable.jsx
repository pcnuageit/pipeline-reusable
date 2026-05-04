import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
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
    [theme.breakpoints.down("sm")]: { fontSize: 14 },
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
    "&:hover": {
      // cursor: "pointer",
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
  tableHead: {
    backgroundColor: "#000",
    [theme.breakpoints.down("sm")]: {},
  },
}));

const CustomTable = ({ columns, data, Editar, compacta, handleClickRow }) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Grid item sm={12}>
          <Table
            className={classes.table}
            aria-label="customized table"
            stickyHeader
            size={compacta ? "small" : null}
          >
            <TableHead>
              <TableRow className={classes.tableHead}>
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
                    style={handleClickRow ? { cursor: "pointer" } : {}}
                    onClick={handleClickRow ? () => handleClickRow(row) : null}
                  >
                    {columns.map((column) => (
                      <StyledTableCell
                        align="center"
                        onClick={
                          handleClickRow ? () => handleClickRow(row) : null
                        }
                      >
                        {column.key === "menu" ? (
                          <Editar row={row} key={row.id} />
                        ) : null}
                        {column.Teste ? column.Teste(row) : null}
                        {column.CustomValue
                          ? column.CustomValue(get(row, column.key))
                          : get(row, column.key)}
                        {column.FullObject ? column.FullObject(row) : null}
                        {column.value ? column.value : null}
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
                      <Typography
                        variant="h6"
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Não há dados para serem exibidos
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Grid>
      </TableContainer>
    </>
  );
};

export default CustomTable;
