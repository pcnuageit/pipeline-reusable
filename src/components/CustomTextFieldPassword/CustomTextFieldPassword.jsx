import { Box, InputAdornment, TextField } from '@material-ui/core';

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	textField: {
		borderRadius: '27px',
		/* boxShadow: '0px 0px 5px 0.5px grey', */
		height: '45px !important',
		borderColor: 'white',
		borderWidth: '1px',
		'& .MuiInput-underline:before': {
			borderBottom: '0px solid white',
		},
		'& .MuiInput-underline:after': {
			borderBottom: '0px solid yellow',
		},
		'& .MuiInput-underline:hover:before': {
			borderBottom: '0px solid green',
		},
	},

	cssLabel: {},

	cssOutlinedInput: {
		borderColor: 'white',
		borderRadius: '27px',
		'&$cssFocused $notchedOutline': {
			borderWidth: '1px',
		},
		'& :-webkit-autofill': {
			'-webkit-padding-after': '13px',
			'-webkit-padding-before': '13px',
			'-webkit-padding-end': '13px',
			'-webkit-padding-start': '13px',
			'-webkit-background-clip': 'text',
			'-webkit-text-color': 'white',
		},
	},

	input: {
		'&::placeholder': {
			textOverflow: 'ellipsis !important',
			color: 'white',
			fontWeight: '600',
			fontSize: '14px',
		},

		borderRadius: '27px',
		height: '10px',
		color: 'white',
	},

	cssFocused: {
		borderWidth: '1px',
	},

	notchedOutline: {
		borderWidth: '1px',
	},
}));
const CustomTextFieldPassword = (rest) => {
	const classes = useStyles();
	return (
		<TextField
			variant="outlined"
			{...rest}
			className={classes.textField}
			InputProps={{
				classes: {
					root: classes.cssOutlinedInput,
					focused: classes.cssFocused,
					notchedOutline: classes.notchedOutline,
					input: classes.input,
				},
				startAdornment: (
					<InputAdornment position="start">
						<LockIcon style={{ color: 'white' }} />
					</InputAdornment>
				),
			}}
		/>
	);
};

export default CustomTextFieldPassword;
