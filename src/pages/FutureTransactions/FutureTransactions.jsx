import {
	Box,
	Button,
	Grid,
	IconButton,
	LinearProgress,
	TextField,
	Tooltip,
	Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	faCalendarAlt as faCalendario,
	faCopy,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs/CustomBreadcrumbs';
import CustomCollapseTable from '../../components/CustomCollapseTable/CustomCollapseTable';
import CustomTable from '../../components/CustomTable/CustomTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '@material-ui/lab/Pagination';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { loadLancamentosFuturos } from '../../actions/actions';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { APP_CONFIG } from '../../constants/config';

const columns = [
	{
		headerText: 'Data de Liberação',
		key: 'data_liberacao',
		CustomValue: (data_liberacao) => {
			const date = new Date(data_liberacao);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return (
				<Box display="flex" justifyContent="center">
					<FontAwesomeIcon icon={faCalendario} size="lg" />
					<Typography style={{ marginLeft: '6px' }}>
						{formatted}
					</Typography>
				</Box>
			);
		},
	},
	{},
	{
		headerText: 'Valor',
		key: 'valor',
		CustomValue: (valor) => {
			return (
				<Typography
					variant=""
					style={{ fontSize: 17, color: 'green', fontWeight: 'bold' }}
				>
					R$ {valor}
				</Typography>
			);
		},
	},
];

const itemColumns = [
	{
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (data) => {
			const date = new Date(data);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return (
				<Box display="flex">
					<FontAwesomeIcon icon={faCalendarAlt} size="lg" />
					<Typography style={{ marginLeft: '6px' }}>
						{formatted}
					</Typography>
				</Box>
			);
		},
	},
	{
		headerText: 'ID da transação',
		key: 'id',
		CustomValue: (id) => {
			return (
				<Box display="flex" alignItems="center">
					<TextField id value={id} />
					<Tooltip title="Copiar">
						<CopyToClipboard text={id}>
							<Button
								aria="Copiar"
								style={{
									marginLeft: '6px',
									width: '60px',
									height: '20px',
									alignSelf: 'center',
									color: 'green',
								}}
								onClick={() =>
									toast.success('Link copiado com sucesso', {
										autoClose: 2000,
									})
								}
							>
								<FontAwesomeIcon
									style={{ width: '60px', height: '20px' }}
									icon={faCopy}
								/>
							</Button>
						</CopyToClipboard>
					</Tooltip>
				</Box>
			);
		},
	},
	{
		headerText: 'Tipo',
		key: 'payment_type',
		CustomValue: (type) => {
			if (type === 'credit') {
				return <Typography>Crédito</Typography>;
			}
			if (type === 'debit') {
				return <Typography>Débito</Typography>;
			}
			if (type === 'boleto') {
				return <Typography>Boleto</Typography>;
			}
			if (type === 'commission') {
				return <Typography>Comissão</Typography>;
			}
		},
	},
];

const FutureTransactions = () => {
	const dispatch = useDispatch();
	const token = useAuth();
	const [page, setPage] = useState(1);
	const userLancamentosFuturos = useSelector(
		(state) => state.lancamentosFuturos
	);
	const [filters, setFilters] = useState({
		data_liberacao: '',
	});
	useEffect(() => {
		dispatch(loadLancamentosFuturos(token, page, filters.data_liberacao));
	}, [token, page, filters]);

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []);

	return (
		<Box
			display="flex"
			flexDirection="column"
			style={{ position: 'absolute' }}
		>
			<Typography
				style={{ marginTop: '8px', marginBottom: '12px' }}
				variant="h4"
			>
				Lançamentos Futuros
			</Typography>

			<Box display="flex" marginTop="8px">
				<Grid container>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							InputLabelProps={{
								shrink: true,
								pattern: 'd {4}- d {2}- d {2} ',
							}}
							type="date"
							label="Data de Liberação"
							value={filters.data_liberacao}
							onChange={(e) =>
								setFilters({
									...filters,
									data_liberacao: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={6} sm={8}>
						<Box display="flex" width="100%" justifyContent="flex-end">
							<Tooltip title="Limpar Filtros">
								<IconButton
									onClick={() =>
										setFilters({
											...filters,
											data_liberacao: '',
										})
									}
								>
									<FontAwesomeIcon icon={faTrash} />
								</IconButton>
							</Tooltip>
						</Box>
					</Grid>
				</Grid>
			</Box>
			<Box marginTop="16px" marginBottom="16px"></Box>
			{userLancamentosFuturos && userLancamentosFuturos.per_page ? (
				<CustomCollapseTable
					itemColumns={itemColumns}
					data={userLancamentosFuturos.data}
					columns={columns}
				/>
			) : (
				<LinearProgress />
			)}
			<Box alignSelf="flex-end" marginTop="8px">
				<Pagination
					variant="outlined"
					color="secondary"
					size="large"
					count={userLancamentosFuturos.last_page}
					onChange={handleChangePage}
					page={page}
				/>
			</Box>
		</Box>
	);
};

export default FutureTransactions;
