import React, { useMemo, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';

import { InputAdornment, TextField } from '@material-ui/core';
import { toast } from 'react-toastify';

import { useEffect } from 'react';
import flags from '../../constants/flags';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { useDispatch } from 'react-redux';
import { putFeesAction } from '../../actions/actions';
import useAuth from '../../hooks/useAuth';

const CardFee = ({ cardFee, editable, setIsLoading }) => {
	const [feeValue, setFeeValue] = useState(0);
	const [changed, setChanged] = useState(false);
	const dispatch = useDispatch();
	const token = useAuth();
	const [errors, setErrors] = useState({});
	/* const [updateCardFee, updateCardFeeStatus] = useUpdateFeeMutation();
	const updateFeeError = useMemo(
		() =>
			updateCardFeeStatus.error
				? updateCardFeeStatus.error.data.errors
				: false,
		[updateCardFeeStatus]
	); */

	useEffect(() => {
		setFeeValue((cardFee.percent_amount / 100).toFixed(2));
	}, [cardFee]);

	const handleChange = (event) => {
		setChanged(true);
		setFeeValue(event.target.value.replace(',', '.'));
	};

	const handleUpdateCardFee = async () => {
		if (changed) {
			setIsLoading(true);
			const resPutFees = await dispatch(
				putFeesAction(token, cardFee.id, (feeValue * 100).toFixed(0), '')
			);
			if (resPutFees) {
				toast.error('Erro ao atualizar taxa!');
				setIsLoading(false);
				setChanged(false);
				setErrors(resPutFees);
			} else {
				toast.success('Taxa atualizada!');
				setIsLoading(false);
				setChanged(false);
			}
		}
	};

	const Flag =
		flags[
			cardFee.card_brand
				? cardFee.card_brand.toLowerCase().replace(' ', '')
				: ''
		];

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			key={cardFee.card_brand}
		>
			<Box display="flex" width="200px" alignItems="center">
				<Box
					width={40}
					height={40}
					display="flex"
					justifyContent="center"
					alignItems="center"
					marginRight={1}
				>
					{Flag ? (
						<Flag />
					) : (
						<FontAwesomeIcon icon={faCreditCard} size={'1x'} />
					)}
				</Box>
				<Typography style={{ paddingLeft: '5px' }}>
					{cardFee.card_brand}
				</Typography>
			</Box>

			<TextField
				id={cardFee.id}
				disabled={!editable}
				value={feeValue}
				onChange={handleChange}
				style={{ width: '6ch' }}
				InputProps={{
					endAdornment: <InputAdornment>%</InputAdornment>,
				}}
				onBlur={handleUpdateCardFee}
				error={errors.nome}
				helperText={errors.nome ? errors.nome.join(' ') : null}
			/>
		</Box>
	);
};

const CardFeesBox = ({ cardFees, label, editable }) => {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<LoadingScreen isLoading={isLoading} />
			<Typography variant="h6">{label}</Typography>
			{cardFees.map((cardFee) => {
				return (
					<CardFee
						cardFee={cardFee}
						editable={editable}
						setIsLoading={setIsLoading}
					/>
				);
			})}
		</Box>
	);
};

export default CardFeesBox;
