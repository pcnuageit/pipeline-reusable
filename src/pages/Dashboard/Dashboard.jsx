import {
	Box,
	Grid,
	LinearProgress,
	Typography,
	makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory, useParams } from 'react-router';
import {
	getContasAction,
	getGraficoContaBarDashboardAction,
	getGraficoContaLineDashboardAction,
	getResumoContaDashboardAction,
	loadPermissao,
	postAuthMeAction,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import CustomBarChart from '../../components/CustomBarChart/CustomBarChart';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomCard from '../../components/CustomCard/CustomCard';
import CustomLineChart from '../../components/CustomLineChart/CustomLineChart';
import CustomTable from '../../components/CustomTable/CustomTable';
import ItaDash4 from '../../assets/ItaDash4.svg';
import useAuth from '../../hooks/useAuth';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: 'white',
		height: '100%',
		width: '100%',
	},
	headerContainer: {
		display: 'flex',
		/* width: '100%', */

		justifyContent: 'center',

		flexDirection: 'column',
	},

	contadorStyle: {
		display: 'flex',
		fontSize: '30px',
		fontFamily: 'Montserrat-SemiBold',
	},

	pageTitle: {
		color: APP_CONFIG.mainCollors.primary,
		fontFamily: 'Montserrat-SemiBold',
	},

	cardContainer: {
		display: 'flex',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
	},

	bodyContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		marginTop: '20px',
	},
}));

const columns = [
	{ headerText: 'Nome', key: 'nome' },
	{ headerText: 'Tipo', key: 'tipo' },
	{
		headerText: 'Status',
		key: 'status',
		CustomValue: (value) => {
			if (value === 'pending') {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#F1E3D4',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: 'orange', width: '100%' }}>
								PENDENTE
							</Typography>
						</Box>
					</Box>
				);
			}
			if (value === 'active') {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#C9DBF2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#75B1ED', width: '100%' }}>
								ATIVO
							</Typography>
						</Box>
					</Box>
				);
			}
			if (value === 'enabled') {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#C9DBF2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#75B1ED', width: '100%' }}>
								ATIVO
							</Typography>
						</Box>
					</Box>
				);
			}
			if (value === 'approved') {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#C9ECE7',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#00B57D', width: '100%' }}>
								APROVADO
							</Typography>
						</Box>
					</Box>
				);
			}
			if (value === 'denied') {
				return (
					<Box
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							style={{
								borderRadius: 32,
								backgroundColor: '#ECC9D2',
								maxWidth: '120px',
								padding: '5px',
							}}
						>
							<Typography style={{ color: '#ED757D', width: '100%' }}>
								NEGADO
							</Typography>
						</Box>
					</Box>
				);
			}
		},
	},
	{ headerText: 'Número do Documento', key: 'numero_documento' },
	{ headerText: 'Documento', key: 'documento' },
];

const Dashboard = () => {
	const history = useHistory();
	const classes = useStyles();
	const token = useAuth();

	const [page, setPage] = useState(1);

	const dispatch = useDispatch();
	const contadores = useSelector((state) => state.contadores);

	useEffect(() => {
		dispatch(getResumoContaDashboardAction(token));
	}, []);

	const listaContas = useSelector((state) => state.contas);
	useEffect(() => {
		dispatch(
			getContasAction(
				token,
				page,

				'',
				'',
				5,
				'',
				'',
				'',
				'',
				''
			)
		);
	}, [token, page]);

	const handleVerTudo = () => {
		const path = generatePath('/dashboard/lista-de-contas');
		history.push(path);
	};

	return (
		<Box className={classes.root}>
			<Box className={classes.headerContainer}>
				<Box>
					<Typography className={classes.pageTitle}>DASHBOARD</Typography>
				</Box>

				<Box
					style={{
						display: 'flex',

						marginTop: '20px',
					}}
				>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={4}>
							<CustomCard
								text="Contas pendentes"
								/* style={{ marginLeft: '0px' }} */
							>
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.cadastro_pendente}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
						<Grid item xs={12} sm={4}>
							<CustomCard text="Contas aprovadas" aprovada>
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.cadastro_aprovado}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
						<Grid item xs={12} sm={4}>
							<CustomCard text="Contas ativas">
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.cadastro_ativo}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
					</Grid>
				</Box>

				<Box
					style={{
						display: 'flex',
						marginTop: '20px',
					}}
				>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={4}>
							<CustomCard text="Contas rejeitadas" rejeitada>
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.cadastro_rejeitado}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
						<Grid item xs={12} sm={4}>
							<CustomCard text="Contas recusadas" rejeitada>
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.cadastro_recusado}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
						<Grid item xs={12} sm={4}>
							<CustomCard text="Frequência diária">
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.frequencia_quantidade_diaria}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
					</Grid>
				</Box>

				<Box
					style={{
						display: 'flex',
						marginTop: '20px',
					}}
				>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={4}>
							<CustomCard text="Cadastro Pessoa Física">
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.cadastro_pessoa_fisica}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
						<Grid item xs={12} sm={4}>
							<CustomCard text="Cadastro Pessoa Jurídica">
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.cadastro_pessoa_juridica}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
						<Grid item xs={12} sm={4}>
							<CustomCard text="Total de Contas">
								<Box className={classes.cardContainer}>
									<Typography className={classes.contadorStyle}>
										{contadores.cadastro_total}
									</Typography>
								</Box>
							</CustomCard>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Box className={classes.bodyContainer}>
				<Box display="flex">
					<Box style={{ width: '77%' }}>
						<CustomLineChart />
					</Box>
					<Box style={{ width: '35%' }}>
						<CustomBarChart />
					</Box>

					{/* 	<Grid container>
						<Grid item xs={12} sm={8}>
							<CustomLineChart />
						</Grid>
						<Grid item xs={12} sm={4}>
							<CustomBarChart />
						</Grid>
					</Grid> */}
				</Box>
				<Box display="flex" style={{ height: '100%', marginTop: '40px' }}>
					<Grid container>
						<Grid xs={12}>
							<Box
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',

									height: '75px',
									backgroundColor: APP_CONFIG.mainCollors.backgrounds,
									borderTopRightRadius: 27,
									borderTopLeftRadius: 27,
								}}
							>
								<Typography
									style={{
										color: APP_CONFIG.mainCollors.primary,
										fontFamily: 'Montserrat-SemiBold',
										marginTop: '20px',
										alignSelf: 'center',
										marginLeft: '30px',
									}}
								>
									CONTAS RECENTES
								</Typography>

								<Box
									style={{
										marginTop: '20px',
										marginRight: '10px',
									}}
								>
									<CustomButton
										size="small"
										color="purple"
										onClick={handleVerTudo}
									>
										VER TUDO
									</CustomButton>
								</Box>
							</Box>
							<Box style={{ marginBottom: '40px', width: '100%' }}>
								{listaContas.data && listaContas.per_page ? (
									<CustomTable
										boxShadowTop={true}
										columns={columns}
										data={listaContas.data}
									/>
								) : null}
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
