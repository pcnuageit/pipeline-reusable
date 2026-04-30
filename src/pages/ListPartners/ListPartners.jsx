import {
	faBan,
	faBarcode,
	faCheck,
	faCopy,
	faCreditCard,
	faDesktop,
	faDollarSign,
	faForward,
	faHandHoldingUsd,
	faHistory,
	faLink,
	faList,
	faMobile,
	faMoneyBill,
	faMoneyBillWave,
	faSignOutAlt,
	faUndo,
	faUsers,
	faGift,
	faMobileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Box,
	Switch,
	makeStyles,
	Typography,
	useMediaQuery,
	useTheme,
	Checkbox,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
	delPermissao,
	loadPermissaoGerenciar,
	postPermissaoAction,
} from '../../actions/actions';
import useAuth from '../../hooks/useAuth';
import AccountCollectionItem from '../../components/AccountCollections/AccountCollectionItem/AccountCollectionItem';
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
	},
	headerContainer: {
		/* padding: '80px 400px ', */
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginBottom: '25px',
	},
	pageTitle: {
		color: '#c6930a',
		fontFamily: 'Montserrat-SemiBold',
	},
	subTitleContainer: {
		margin: '15px 15px',
		display: 'flex',
		justifyContent: 'space-between',
	},
	contentContainer: {
		marginTop: '20px',
	},
	responsiveContainer: {
		display: 'flex',
		justifyContent: 'center',
		[theme.breakpoints.down(850)]: {
			flexDirection: 'column',
			alignItems: 'center',
		},
	},
}));

const ListPartner = () => {
	const classes = useStyles();
	const token = useAuth();
	const history = useHistory();
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const { id } = useParams();
	const dispatch = useDispatch();

	return (
		<Box display="flex" flexDirection="column" className={classes.root}>
			<LoadingScreen isLoading={loading} />

			<Typography
				style={{ marginTop: '8px', color: APP_CONFIG.mainCollors.primary }}
				variant="h4"
			>
				Parceiros
			</Typography>

			<Box className={classes.responsiveContainer}>
				<Box display="flex" alignItems="center">
					{/* <AccountCollectionItem link='jeitto' text="Jeitto" icon={faCreditCard} /> */}
				</Box>
				<Box display="flex" alignItems="center">
					<Typography
						variant="h6"
						style={{ color: APP_CONFIG.mainCollors.primary }}
					>
						Não há dados para serem exibidos
					</Typography>
					{/* <AccountCollectionItem link='recarga-celular-admin' text="Celcoin Recargar" icon={faMobileAlt} /> */}
				</Box>
				<Box display="flex" alignItems="center">
					{/* <AccountCollectionItem link='gift-cards-admin' text="Celcoin GiftCard" icon={faGift} /> */}
				</Box>
			</Box>
		</Box>
	);
};

export default ListPartner;
