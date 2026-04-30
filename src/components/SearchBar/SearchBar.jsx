import React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	textField: {
		backgroundColor: '#ddf0f4',
		borderRadius: '27px',
	},

	cssLabel: {},

	cssOutlinedInput: {
		'&$cssFocused $notchedOutline': {
			borderWidth: '0',
		},
	},

	cssFocused: {
		borderWidth: '0',
	},

	notchedOutline: {
		borderWidth: '0',
	},
}));

const SearchBar = (rest) => {
	const classes = useStyles();
	return (
		<TextField
			{...rest}
			className={classes.textField}
			variant="outlined"
			InputProps={{
				startAdornment: (
					<InputAdornment style={{ margin: '4px' }} position="end">
						<FontAwesomeIcon icon={faSearch} />
					</InputAdornment>
				),
				classes: {
					root: classes.cssOutlinedInput,
					focused: classes.cssFocused,
					notchedOutline: classes.notchedOutline,
				},
			}}
		/>
	);
};

export default SearchBar;
