import {
	Box,
	Button,
	LinearProgress,
	Menu,
	MenuItem,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable/CustomTable';
import SearchBar from '../../components/CustomTextField/CustomTextField';

import CustomBreadcrumbs from '../../components/CustomBreadcrumbs/CustomBreadcrumbs';

import { useDispatch, useSelector } from 'react-redux';
import { generatePath, Link, useHistory, useParams } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { delPagador, loadPagadoresFilter } from '../../actions/actions';
import { APP_CONFIG } from '../../constants/config';

const columns = [
	{ headerText: 'Nome', key: 'nome' },
	{ headerText: 'Documento', key: 'documento' },
	{ headerText: 'E-mail', key: 'email' },
	{ headerText: 'Contato', key: 'celular' },
];

const Payers = () => {
	const token = useAuth();
	const history = useHistory();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const { id } = useParams();
	const userData = useSelector((state) => state.userData);
	const [filters, setFilters] = useState({
		like: '',
		order: '',
		mostrar: '',
	});
	const debouncedLike = useDebounce(filters.like, 800);
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const pagadoresList = useSelector((state) => state.pagadores);

	useEffect(() => {
		dispatch(
			loadPagadoresFilter(
				token,
				page,
				debouncedLike,
				filters.order,
				filters.mostrar,
				id
			)
		);
	}, [page, filters.order, filters.mostrar, debouncedLike, id]);

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	const Editar = ({ row }) => {
		const [anchorEl, setAnchorEl] = useState(null);
		const handleClick = (event) => {
			setAnchorEl(event.currentTarget);
		};
		const handleClose = () => {
			setAnchorEl(null);
		};

		const handleExcluir = async () => {
			dispatch(delPagador(token, row.id));
			setAnchorEl(null);
		};
		const handleEditar = (row) => {
			const path = generatePath('/dashboard/pagadores/:id/editar', {
				id: row.id,
			});
			history.push(path);
		};

		return (
			<Box>
				{token && userData === '' ? null : (
					<>
						<Button
							style={{ height: '15px', width: '10px' }}
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
							<MenuItem onClick={() => handleEditar(row)}>
								Editar
							</MenuItem>
							<MenuItem onClick={() => handleExcluir(row)}>
								Excluir
							</MenuItem>
						</Menu>
					</>
				)}
			</Box>
		);
	};

	return (
		<Box display="flex" flexDirection="column">
			<Box
				display="flex"
				justifyContent="space-between"
				flexDirection={matches ? 'column' : null}
			>
				<Typography
					style={{
						marginTop: '8px',
						color: APP_CONFIG.mainCollors.primary,
						marginBottom: 30,
					}}
					variant="h4"
				>
					Pagadores
				</Typography>

				{/* {token && userData === '' ? null : (
					<Link to="novo-pagadores">
						<GradientButton buttonText="+ Novo Pagador" />
					</Link>
				)} */}
			</Box>
			<Box
				style={{
					width: '100%',
					backgroundColor: APP_CONFIG.mainCollors.backgrounds,
					borderTopLeftRadius: 27,
					borderTopRightRadius: 27,
				}}
			>
				<Box marginTop="16px" marginBottom="16px" style={{ margin: 30 }}>
					<TextField
						variant="outlined"
						fullWidth
						placeholder="Pesquisar por nome, documento..."
						value={filters.like}
						onChange={(e) =>
							setFilters({
								...filters,
								like: e.target.value,
							})
						}
					/>
				</Box>
			</Box>

			{pagadoresList.data && pagadoresList.per_page ? (
				<CustomTable
					columns={columns}
					data={pagadoresList.data}
					Editar={Editar}
				/>
			) : (
				<LinearProgress />
			)}
			<Box alignSelf="flex-end" marginTop="8px">
				<Pagination
					variant="outlined"
					color="secondary"
					size="large"
					count={pagadoresList.last_page}
					onChange={handleChangePage}
					page={page}
				/>
			</Box>
		</Box>
	);
};

export default Payers;
