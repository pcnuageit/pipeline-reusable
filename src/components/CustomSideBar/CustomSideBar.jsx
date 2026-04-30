import { Box, Button, Collapse } from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
	loadContaId,
	loadPermissao,
	postAuthMeAction,
} from '../../actions/actions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSIONS } from '../../constants/permissions';
import CssBaseline from '@material-ui/core/CssBaseline';
import CurrencyFormat from 'react-currency-format';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import ItaDash1 from '../../assets/ItaDash1.svg';
import ItaLogo from '../../assets/ItaLogo.svg';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import useAuth from '../../hooks/useAuth';
import { useHistory } from 'react-router';
import vBankLogo from '../../assets/vbankSvgs/vBankLogo.svg';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LockIcon from '@material-ui/icons/Lock';
import AssignmentIcon from '@material-ui/icons/Assignment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GroupIcon from '@material-ui/icons/Group';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BlockIcon from '@material-ui/icons/Block';
import usePermission from '../../hooks/usePermission';
import {
	AttachMoney,
	ExpandLess,
	ExpandMore,
	Settings,
} from '@material-ui/icons';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { APP_CONFIG } from '../../constants/config';
import PaidIcon from '@mui/icons-material/Paid';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import PixIcon from '@mui/icons-material/Pix';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PercentIcon from '@mui/icons-material/Percent';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
	root: {
		background: APP_CONFIG.mainCollors.secondaryGradient,
		display: 'flex',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
		borderRightWidth: '0px',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

function CustomSideBar(props) {
	const dispatch = useDispatch();
	const { id, section } = useParams();
	const token = useAuth();
	const contaSelecionada = useSelector((state) => state.conta);
	const userData = useSelector((state) => state.userData);
	const { window } = props;
	const classes = useStyles();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const history = useHistory();

	const canShowFinancialSupport = usePermission([
		PERMISSIONS.FULL_ACCESS,
		PERMISSIONS.MANAGE_FINANCIAL_PROPOSAL,
		PERMISSIONS.MANAGE_FINANCIAL_SUPPORT,
	]);

	const me = useSelector((state) => state.me);
	useEffect(() => {
		dispatch(postAuthMeAction(token));
	}, []);

	const [openCreditCollapse, setOpenCreditCollapse] = useState(false);
	const [openTransferenciaCollapse, setOpenTransferenciaCollapse] =
		useState(false);
	const [openTarifasCollapse, setOpenTarifasCollapse] = useState(false);

	useEffect(() => {
		if (me.id !== undefined) {
			dispatch(loadPermissao(token, me.id));
		}
	}, [me.id]);

	useEffect(() => {
		if (id && token && section !== 'taxa' && section !== 'apoio-financeiro') {
			dispatch(loadContaId(token, id));
		}
	}, [id, token, userData]);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
	const getSideBarItemBackgroundColor = (index) =>
		index === selectedIndex ? 'white' : null;

	const getSideBarItemColor = (index) =>
		index === selectedIndex ? APP_CONFIG.mainCollors.primary : 'white';
	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
	};

	const drawer = (
		<Box
			style={{
				background: APP_CONFIG.mainCollors.secondaryGradient,
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
			}}
		>
			<Box
				style={{
					width: '100%',
					justifyContent: 'center',
					display: 'flex',
					marginTop: '50px',
				}}
			>
				<img
					src={APP_CONFIG.assets.smallWhiteLogo}
					alt=""
					style={{ width: '130px', alignSelf: 'center' }}
				/>
			</Box>
			<Box className={classes.toolbar} />

			<List style={{ marginLeft: '30px' }}>
				<ListItem
					component={Link}
					button
					selected={selectedIndex === 0}
					onClick={(event) => handleListItemClick(event, 0)}
					to="/dashboard/home"
					style={
						selectedIndex === 0
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
				>
					<ListItemIcon style={{ width: '60px' }}>
						<HomeIcon
							fontSize="50px"
							style={{
								backgroundColor: getSideBarItemBackgroundColor(0),
								color: getSideBarItemColor(0),
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<ListItemText>
						<Typography
							style={
								selectedIndex === 0
									? {
											fontWeight: 'bold',
											fontFamily: 'Montserrat-SemiBold',
											fontSize: '14px',
											color: APP_CONFIG.mainCollors.primary,
									  }
									: {
											fontFamily: 'Montserrat-Regular',
											fontSize: '14px',
											color: 'white',
									  }
							}
						>
							Home
						</Typography>
					</ListItemText>
				</ListItem>
				<ListItem
					button
					selected={selectedIndex === 1}
					onClick={(event) => handleListItemClick(event, 1)}
					component={Link}
					to="/dashboard/lista-de-contas"
					style={
						selectedIndex === 1
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
				>
					<ListItemIcon>
						<PersonIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(1),
								color: getSideBarItemColor(1),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 1
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Contas
					</Typography>
				</ListItem>
				<ListItem
					button
					selected={selectedIndex === 17}
					onClick={(event) => handleListItemClick(event, 17)}
					component={Link}
					to="/dashboard/lista-de-contas-adquirencia"
					style={
						selectedIndex === 17
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
				>
					<ListItemIcon>
						<PersonOutlineIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(17),
								color: getSideBarItemColor(17),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 17
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Contas Adquirência
					</Typography>
				</ListItem>
				<ListItem
					button
					selected={selectedIndex === 24}
					onClick={(event) => handleListItemClick(event, 24)} 
					component={Link}
					to="/dashboard/lista-de-contas-estabelecimentos"
					style={
						selectedIndex === 24
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
				>
					<ListItemIcon>
						<PersonOutlineIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(24),
								color: getSideBarItemColor(24),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 24
								? { 
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Contas Estabelecimentos
					</Typography>
				</ListItem>
				{canShowFinancialSupport && APP_CONFIG.AbaCredito && (
					<>
						<ListItem
							button
							onClick={() => setOpenCreditCollapse((open) => !open)}
							component={Link}
						>
							<ListItemIcon>
								<AccountBalanceIcon
									style={{
										width: '48px',
										marginRight: '10px',
										fontSize: '48px',
										color: 'white',
										borderRadius: '33px',
										padding: '5px',
									}}
								/>
							</ListItemIcon>
							<Typography
								style={{
									fontFamily: 'Montserrat-Regular',
									fontSize: '14px',
									color: 'white',
									flex: 1,
								}}
							>
								Crédito
							</Typography>
							{openCreditCollapse ? (
								<ExpandLess
									style={{
										fontSize: '32px',
										color: 'white',
									}}
								/>
							) : (
								<ExpandMore
									style={{
										fontSize: '32px',
										color: 'white',
									}}
								/>
							)}
						</ListItem>
						<Collapse
							in={openCreditCollapse}
							timeout="auto"
							unmountOnExit
						>
							<List component="div" disablePadding>
								<ListItem
									button
									selected={selectedIndex === 11}
									onClick={(event) => handleListItemClick(event, 11)}
									className={classes.nested}
									component={Link}
									to="/dashboard/apoio-financeiro"
									style={
										selectedIndex === 11
											? {
													backgroundColor: 'white',
													borderTopLeftRadius: 32,
													borderBottomLeftRadius: 32,
											  }
											: {}
									}
								>
									<ListItemIcon>
										<AttachMoney
											style={{
												width: '48px',
												marginRight: '10px',
												fontSize: '48px',
												backgroundColor:
													getSideBarItemBackgroundColor(11),
												color: getSideBarItemColor(11),
												borderRadius: '33px',
												padding: '5px',
											}}
										/>
									</ListItemIcon>
									<Typography
										style={
											selectedIndex === 11
												? {
														fontWeight: 'bold',
														fontFamily: 'Montserrat-SemiBold',
														fontSize: '14px',
														color: APP_CONFIG.mainCollors.primary,
												  }
												: {
														fontFamily: 'Montserrat-Regular',
														fontSize: '14px',
														color: 'white',
												  }
										}
									>
										Apoio Financeiro
									</Typography>
								</ListItem>
							</List>
							<List component="div" disablePadding>
								<ListItem
									button
									selected={selectedIndex === 20}
									onClick={(event) => handleListItemClick(event, 20)}
									className={classes.nested}
									component={Link}
									to="/dashboard/antecipacao-salarial"
									style={
										selectedIndex === 20
											? {
													backgroundColor: 'white',
													borderTopLeftRadius: 32,
													borderBottomLeftRadius: 32,
											  }
											: {}
									}
								>
									<ListItemIcon>
										<RequestQuoteIcon
											style={{
												width: '48px',
												marginRight: '10px',
												fontSize: '48px',
												backgroundColor:
													getSideBarItemBackgroundColor(20),
												color: getSideBarItemColor(20),
												borderRadius: '33px',
												padding: '5px',
											}}
										/>
									</ListItemIcon>
									<Typography
										style={
											selectedIndex === 20
												? {
														fontWeight: 'bold',
														fontFamily: 'Montserrat-SemiBold',
														fontSize: '14px',
														color: APP_CONFIG.mainCollors.primary,
												  }
												: {
														fontFamily: 'Montserrat-Regular',
														fontSize: '14px',
														color: 'white',
												  }
										}
									>
										Antecipação Salarial
									</Typography>
								</ListItem>
							</List>
						</Collapse>
					</>
				)}
				<ListItem
					style={
						selectedIndex === 2
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 2}
					onClick={(event) => handleListItemClick(event, 2)}
					component={Link}
					to="/dashboard/lista-pre-contas"
				>
					<ListItemIcon>
						<PersonAddIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(2),
								color: getSideBarItemColor(2),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 2
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Pré contas
					</Typography>
				</ListItem>
				<>
					<ListItem
						button
						onClick={() => setOpenTransferenciaCollapse((open) => !open)}
						component={Link}
					>
						<ListItemIcon>
							<PaidIcon
								style={{
									width: '48px',
									marginRight: '10px',
									fontSize: '48px',
									color: 'white',
									borderRadius: '33px',
									padding: '5px',
								}}
							/>
						</ListItemIcon>
						<Typography
							style={{
								fontFamily: 'Montserrat-Regular',
								fontSize: '14px',
								color: 'white',
								flex: 1,
							}}
						>
							Transações
						</Typography>
						{openTransferenciaCollapse ? (
							<ExpandLess
								style={{
									fontSize: '32px',
									color: 'white',
								}}
							/>
						) : (
							<ExpandMore
								style={{
									fontSize: '32px',
									color: 'white',
								}}
							/>
						)}
					</ListItem>
					<Collapse
						in={openTransferenciaCollapse}
						timeout="auto"
						unmountOnExit
					>
						<List component="div" disablePadding>
							<ListItem
								button
								selected={selectedIndex === 22}
								onClick={(event) => handleListItemClick(event, 22)}
								className={classes.nested}
								component={Link}
								to="/dashboard/transacoes"
								style={
									selectedIndex === 22
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<ImportExportIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(22),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 22
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									Trasações Adquirência
								</Typography>
							</ListItem>
							<ListItem
								button
								selected={selectedIndex === 12}
								onClick={(event) => handleListItemClick(event, 12)}
								className={classes.nested}
								component={Link}
								to="/dashboard/transacoes-pix"
								style={
									selectedIndex === 12
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<PixIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(12),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 12
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									PIX
								</Typography>
							</ListItem>
							<ListItem
								button
								selected={selectedIndex === 13}
								onClick={(event) => handleListItemClick(event, 13)}
								className={classes.nested}
								component={Link}
								to="/dashboard/transacoes-p2p"
								style={
									selectedIndex === 13
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<CompareArrowsIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(13),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 13
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									P2P
								</Typography>
							</ListItem>
							<ListItem
								button
								selected={selectedIndex === 14}
								onClick={(event) => handleListItemClick(event, 14)}
								className={classes.nested}
								component={Link}
								to="/dashboard/transacoes-ted"
								style={
									selectedIndex === 14
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<LocalAtmIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(14),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 14
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									TED
								</Typography>
							</ListItem>
							<ListItem
								button
								selected={selectedIndex === 15}
								onClick={(event) => handleListItemClick(event, 15)}
								className={classes.nested}
								component={Link}
								to="/dashboard/transacoes-pagamento-conta"
								style={
									selectedIndex === 15
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<AttachMoneyIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(15),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 15
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									Pagamento Conta
								</Typography>
							</ListItem>
							<ListItem
								button
								selected={selectedIndex === 16}
								onClick={(event) => handleListItemClick(event, 16)}
								className={classes.nested}
								component={Link}
								to="/dashboard/transacoes-pagamento-boleto"
								style={
									selectedIndex === 16
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<ReceiptIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(16),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 16
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									Boletos
								</Typography>
							</ListItem>
						</List>
					</Collapse>
				</>
				<ListItem
					style={
						selectedIndex === 3
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 3}
					onClick={(event) => handleListItemClick(event, 3)}
					component={Link}
					to="/dashboard/lista-de-administradores"
				>
					<ListItemIcon>
						<AccountBoxIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(3),
								color: getSideBarItemColor(3),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 3
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Administradores
					</Typography>
				</ListItem>
				<ListItem
					style={
						selectedIndex === 4
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 4}
					onClick={(event) => handleListItemClick(event, 4)}
					component={Link}
					to="/dashboard/lista-dispositivos-bloqueados"
				>
					<ListItemIcon>
						<LockIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(4),
								color: getSideBarItemColor(4),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 4
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Dispositivos bloqueados
					</Typography>
				</ListItem>

				<>
					<ListItem
						button
						onClick={() => setOpenTarifasCollapse((open) => !open)}
						component={Link}
					>
						<ListItemIcon>
							<AssignmentIcon
								style={{
									width: '48px',
									marginRight: '10px',
									fontSize: '48px',
									backgroundColor: getSideBarItemBackgroundColor(5),
									color: getSideBarItemColor(5),
									borderRadius: '33px',
									padding: '5px',
								}}
							/>
						</ListItemIcon>
						<Typography
							style={{
								fontFamily: 'Montserrat-Regular',
								fontSize: '14px',
								color: 'white',
								flex: 1,
							}}
						>
							Tarifas
						</Typography>
						{openTarifasCollapse ? (
							<ExpandLess
								style={{
									fontSize: '32px',
									color: 'white',
								}}
							/>
						) : (
							<ExpandMore
								style={{
									fontSize: '32px',
									color: 'white',
								}}
							/>
						)}
					</ListItem>
					<Collapse in={openTarifasCollapse} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								button
								selected={selectedIndex === 5.1}
								onClick={(event) => handleListItemClick(event, 5.1)}
								className={classes.nested}
								component={Link}
								to="/dashboard/taxas"
								style={
									selectedIndex === 5.1
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<PercentIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(5.1),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 5.1
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									Taxas
								</Typography>
							</ListItem>
							<ListItem
								button
								selected={selectedIndex === 5.2}
								onClick={(event) => handleListItemClick(event, 5.2)}
								className={classes.nested}
								component={Link}
								to="/dashboard/taxa-padrao"
								style={
									selectedIndex === 5.2
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<AssessmentIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(5.2),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 5.2
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									Tarifa Padrão
								</Typography>
							</ListItem>
							<ListItem
								button
								selected={selectedIndex === 5.3}
								onClick={(event) => handleListItemClick(event, 5.3)}
								className={classes.nested}
								component={Link}
								to="/dashboard/transacoes-tarifas"
								style={
									selectedIndex === 5.3
										? {
												backgroundColor: 'white',
												borderTopLeftRadius: 32,
												borderBottomLeftRadius: 32,
										  }
										: {}
								}
							>
								<ListItemIcon>
									<AutoAwesomeMotionIcon
										style={{
											width: '48px',
											marginRight: '10px',
											fontSize: '30px',

											color: getSideBarItemColor(5.3),
											borderRadius: '33px',
											padding: '5px',
										}}
									/>
								</ListItemIcon>
								<Typography
									style={
										selectedIndex === 5.3
											? {
													fontWeight: 'bold',
													fontFamily: 'Montserrat-SemiBold',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
											  }
											: {
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: 'white',
											  }
									}
								>
									Transações Tarifas
								</Typography>
							</ListItem>
						</List>
					</Collapse>
				</>

				<ListItem
					style={
						selectedIndex === 6
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 6}
					onClick={(event) => handleListItemClick(event, 6)}
					component={Link}
					to="/dashboard/logs"
				>
					<ListItemIcon>
						<VisibilityIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(6),
								color: getSideBarItemColor(6),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 6
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Visualizar logs
					</Typography>
				</ListItem>
				<ListItem
					style={
						selectedIndex === 21
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 21}
					onClick={(event) => handleListItemClick(event, 21)}
					component={Link}
					to="/dashboard/representantes"
				>
					<ListItemIcon>
						<AccessibilityNewIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(21),
								color: getSideBarItemColor(21),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 21
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Representantes
					</Typography>
				</ListItem>

				<ListItem
					style={
						selectedIndex === 7
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 7}
					onClick={(event) => handleListItemClick(event, 7)}
					component={Link}
					to="/dashboard/parceiros"
				>
					<ListItemIcon>
						<GroupIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(7),
								color: getSideBarItemColor(7),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 7
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Parceiros
					</Typography>
				</ListItem>
				<ListItem
					style={
						selectedIndex === 8
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 8}
					onClick={(event) => handleListItemClick(event, 8)}
					component={Link}
					to="/dashboard/blacklist"
				>
					<ListItemIcon>
						<BlockIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(8),
								color: getSideBarItemColor(8),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 8
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Blacklist
					</Typography>
				</ListItem>
				<ListItem
					style={
						selectedIndex === 9
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 9}
					onClick={(event) => handleListItemClick(event, 9)}
					component={Link}
					to="/dashboard/banners"
				>
					<ListItemIcon>
						<ViewCarouselIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(9),
								color: getSideBarItemColor(9),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 9
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Banners
					</Typography>
				</ListItem>
				<ListItem
					style={
						selectedIndex === 18
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 18}
					onClick={(event) => handleListItemClick(event, 18)}
					component={Link}
					to="/dashboard/notificacoes"
				>
					<ListItemIcon>
						<NotificationsIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(18),
								color: getSideBarItemColor(18),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 18
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Notificações
					</Typography>
				</ListItem>
				<ListItem
					style={
						selectedIndex === 19
							? {
									backgroundColor: 'white',
									borderTopLeftRadius: 32,
									borderBottomLeftRadius: 32,
							  }
							: {}
					}
					button
					selected={selectedIndex === 19}
					onClick={(event) => handleListItemClick(event, 19)}
					component={Link}
					to="/dashboard/plano-vendas"
				>
					<ListItemIcon>
						<MenuBookIcon
							style={{
								width: '48px',
								marginRight: '10px',
								fontSize: '48px',
								backgroundColor: getSideBarItemBackgroundColor(19),
								color: getSideBarItemColor(19),
								borderRadius: '33px',
								padding: '5px',
							}}
						/>
					</ListItemIcon>
					<Typography
						style={
							selectedIndex === 19
								? {
										fontWeight: 'bold',
										fontFamily: 'Montserrat-SemiBold',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
								  }
								: {
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: 'white',
								  }
						}
					>
						Planos de vendas
					</Typography>
				</ListItem>
				{APP_CONFIG.AbaCartoes ? (
					<ListItem
						style={
							selectedIndex === 10
								? {
										backgroundColor: 'white',
										borderTopLeftRadius: 32,
										borderBottomLeftRadius: 32,
								  }
								: {}
						}
						button
						selected={selectedIndex === 10}
						onClick={(event) => handleListItemClick(event, 10)}
						component={Link}
						to="/dashboard/cartoes"
					>
						<ListItemIcon>
							<CreditCardIcon
								style={{
									width: '48px',
									marginRight: '10px',
									fontSize: '48px',
									backgroundColor: getSideBarItemBackgroundColor(10),
									color: getSideBarItemColor(10),
									borderRadius: '33px',
									padding: '5px',
								}}
							/>
						</ListItemIcon>
						<Typography
							style={
								selectedIndex === 10
									? {
											fontWeight: 'bold',
											fontFamily: 'Montserrat-SemiBold',
											fontSize: '14px',
											color: APP_CONFIG.mainCollors.primary,
									  }
									: {
											fontFamily: 'Montserrat-Regular',
											fontSize: '14px',
											color: 'white',
									  }
							}
						>
							Cartões
						</Typography>
					</ListItem>
				) : (
					<></>
				)}
			</List>
			{id &&
			token &&
			section !== 'taxa' &&
			section !== 'apoio-financeiro' &&
			section !== 'detalhes-pre-conta' ? (
				<Box
					style={{ color: 'black' }}
					display="flex"
					flexDirection="column"
					alignContent="center"
					alignItems="center"
					marginBottom="30px"
				>
					<Typography variant="h5" style={{ color: 'white' }}>
						Conta Selecionada:{' '}
					</Typography>
					<Typography
						style={{ wordWrap: 'break-word', color: 'white' }}
						align="center"
					>
						{contaSelecionada.nome ? contaSelecionada.nome : null}
					</Typography>
					<Typography
						style={{ wordWrap: 'break-word', color: 'white' }}
						align="center"
					>
						{contaSelecionada.razao_social
							? contaSelecionada.razao_social
							: null}
					</Typography>
					<Typography style={{ color: 'white' }}>
						{contaSelecionada.documento
							? contaSelecionada.documento
							: null}
					</Typography>
					<Typography style={{ color: 'white' }}>
						{contaSelecionada.cnpj ? contaSelecionada.cnpj : null}
					</Typography>
					<Typography style={{ color: 'white' }}>
						{contaSelecionada.saldo ? (
							<CurrencyFormat
								value={contaSelecionada.saldo.valor.replace('.', ',')}
								displayType={'text'}
								thousandSeparator={'.'}
								decimalSeparator={','}
								prefix={'R$ '}
								renderText={(value) => <div> Saldo: {value}</div>}
							/>
						) : null}
					</Typography>
				</Box>
			) : null}

			<Box
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<Box
					style={{
						display: 'flex',
						marginBottom: '10px',
						alignItems: 'center',
						flexDirection: 'column',
					}}
				>
					<Typography style={{ fontSize: '12px', color: 'white' }}>
						Versão: {APP_CONFIG.versao}
					</Typography>
					<Typography style={{ fontSize: '12px', color: 'white' }}>
						Data da Versão: {APP_CONFIG.dataVersao}
					</Typography>
				</Box>
				<Box
					style={{
						marginBottom: '20px',
						justifyContent: 'center',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					{/* <img
						src={ItaLogo}
						alt=""
						style={{ width: '200px', marginBottom: 10 }}
					/> */}
					<Button
						style={{ width: '0.9rem' }}
						variant="contained"
						onClick={() => {
							localStorage.removeItem('@auth');
							history.push('/login');
						}}
					>
						Sair
					</Button>
				</Box>
			</Box>
		</Box>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<div className={classes.root}>
			<CssBaseline />

			<nav className={classes.drawer} aria-label="mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
					<Drawer
						container={container}
						variant="temporary"
						anchor={theme.direction === 'rtl' ? 'right' : 'left'}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant="permanent"
						open
					>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
		</div>
	);
}

CustomSideBar.propTypes = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

export default CustomSideBar;
