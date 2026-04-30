import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
	paper: {
		marginBottom: theme.spacing(6),
		padding: theme.spacing(3),
		borderRadius: '0px',
		alignSelf: 'center',
		display: 'flex',
		flexDirection: 'column',
		width: '800px',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 2,
		color: '#fff',
	},
}));

const LoadingScreen = ({ isLoading }) => {
	const classes = useStyles();

	if (isLoading) {
		return (
			<Backdrop className={classes.backdrop} open={true}>
				<CircularProgress color="inherit" />
			</Backdrop>
		);
	} else return null;
};

export default LoadingScreen;
