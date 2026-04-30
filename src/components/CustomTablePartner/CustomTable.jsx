import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { get } from 'lodash';
import { Box, Grid, Typography } from '@material-ui/core';
import { APP_CONFIG } from '../../constants/config';

const StyledTableCell = withStyles((theme) => ({
	head: {
		boxSizing: '',
		fontSize: 17,
		fontFamily: 'Montserrat-SemiBold',
		backgroundColor: '#f4f4f4',
		color: 'black',
		[theme.breakpoints.down('sm')]: {},
	},
	body: {
		fontFamily: 'Montserrat-Regular',
		fontSize: 15,

		[theme.breakpoints.down('sm')]: {},
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: '#fff',
		},
		'&:hover': {
			cursor: 'pointer',
			backgroundColor: '#afafaf',
		},
		[theme.breakpoints.down('sm')]: {},
	},
}))(TableRow);

const useStyles = makeStyles((theme) => ({
	tableContainer: {
		boxShadow: '0px 0px 5px 1px grey',
		borderRadius: '0px',
		[theme.breakpoints.down('sm')]: {},
	},
	table: {
		[theme.breakpoints.down('sm')]: {},
	},
	tableHead: {
		backgroundColor: '#000',
		[theme.breakpoints.down('sm')]: {},
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
			<TableContainer
				className={classes.tableContainer}
				style={boxShadowTop ? { boxShadow: '0px 4px 5px 1px grey' } : null}
				component={Paper}
			>
				<Grid item sm={12}>
					<Table
						className={classes.table}
						aria-label="customized table"
						stickyHeader
						size={compacta ? 'small' : null}
					>
						<TableHead>
							<TableRow className={classes.tableHead}>
								{columns.map((column) => (
									<StyledTableCell
										key={column.headerText}
										align="center"
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
										size={compacta ? 'small' : null}
										key={row.id}
										onClick={
											handleClickRow
												? () => handleClickRow(row)
												: null
										}
									>
										{columns.map((column) => (
											<StyledTableCell align="center">
												{column.key === 'menu' ? (
													<Editar row={row} key={row.id} />
												) : null}
												{column.Teste ? column.Teste(row) : null}
												{column.CustomValue
													? column.CustomValue(
															get(row, column.key)
													  )
													: get(row, column.key)}
												{column.FullObject
													? column.FullObject(row)
													: null}
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
												style={{ color: '#ccc' }}
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
