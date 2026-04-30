import '../../fonts/Montserrat-SemiBold.otf';

import { Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	customButton: {
		borderRadius: '37px',
		fontWeight: 'bold',
		fontSize: '11px',
		width: '220px',
		height: '38px',
		boxShadow: '0px 0px 5px 0.7px grey',
		fontFamily: 'Montserrat-SemiBold',
	},
}));

const CustomButton = (props) => {
	const classes = useStyles();
	return (
		<Button
			{...props}
			className={classes.customButton}
			variant="contained"
			style={
				(props.size === 'medium'
					? {
							width: '310px',
					  }
					: { width: '320px' },
				props.color === 'black'
					? { backgroundColor: '#443D38', color: 'white' }
					: props.color === 'yellow'
					? { backgroundColor: '#ffdc00', color: 'black' }
					: props.color === 'purple'
					? {
							backgroundColor: APP_CONFIG.mainCollors.primary,
							color: 'white',
					  }
					: props.color === 'red'
					? { backgroundColor: '#ED757D', color: 'white' }
					: {
							backgroundColor: 'white',
							color: APP_CONFIG.mainCollors.primary,
					  })
			}
		>
			{props.children}
		</Button>
	);
};

export default CustomButton;
