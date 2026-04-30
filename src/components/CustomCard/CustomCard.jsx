import {
	Box,
	makeStyles,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PersonIcon from '@material-ui/icons/Person';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	iconContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		padding: '12px',
		width: '100%',
		height: '100px',
		backgroundColor: APP_CONFIG.mainCollors.backgrounds,
		color: '#35322f',
		transition: `${theme.transitions.create(
			['background-color', 'transform'],
			{
				duration: theme.transitions.duration.standard,
			}
		)}`,
		'&:hover': {
			cursor: 'pointer',
			backgroundColor: theme.palette.secondary.light,
			transform: 'scale(1.05)',
			border: '2px solid',
			borderColor: APP_CONFIG.mainCollors.backgrounds,
		},
		animation: `$myEffect 500ms ${theme.transitions.easing.easeInOut}`,
	},
	'@keyframes myEffect': {
		'0%': {
			opacity: 1,
			transform: 'translateX(20%)',
		},
		'100%': {
			opacity: 1,
			transform: 'translateX(0)',
		},
	},

	textImageContainer: {
		width: '100%',

		fontFamily: 'Montserrat-Regular',
		color: APP_CONFIG.mainCollors.primary,
		fontSize: '0.7rem',
		fontWeight: '400',
		[theme.breakpoints.up('md')]: {
			fontSize: '1rem',
			fontWeight: '500',
		},
	},

	textContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: 'Montserrat-Regular',
		color: APP_CONFIG.mainCollors.primary,
		fontSize: '0.7rem',
		fontWeight: '400',
		[theme.breakpoints.up('md')]: {
			fontSize: '1rem',
			fontWeight: '500',
		},
	},
}));

const CustomCard = ({
	icon,
	iconColor,
	link,
	text,
	subtext,
	children,
	aprovada,
	rejeitada,
	...rest
}) => {
	const classes = useStyles();
	const { section, id, subsection, subsectionId } = useParams();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Box>
			<Box
				className={classes.iconContainer}
				style={{ borderRadius: 27 }}
				onClick={
					link === null
						? () =>
								toast.warning(
									'Sem permissão para acessar essa funcionalidade'
								)
						: null
				}
				{...rest}
			>
				{matches ? null : (
					<Box
						style={{
							display: 'flex',
							borderRadius: 36,
							width: '100px',
							height: '70px',
							backgroundColor: 'white',
							alignItems: 'center',
							alignContent: 'center',
							justifyContent: 'center',
						}}
					>
						<PersonIcon
							color={'primary'}
							style={{
								alignSelf: 'center',
								fontSize: 30,
								color:
									iconColor ??
									(aprovada ? 'green' : rejeitada ? 'red' : null),
							}}
						/>
					</Box>
				)}

				<Box
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
					}}
				>
					<Typography
						variant="h6"
						align="center"
						className={classes.textImageContainer}
					>
						{text}
					</Typography>
					<Typography
						variant="subtitle2"
						align="center"
						className={classes.textContainer}
					>
						{children}
						{subtext}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default CustomCard;
