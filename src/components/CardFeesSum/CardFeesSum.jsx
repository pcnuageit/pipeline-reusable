import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';
import flags from '../../constants/flags';

const CardFeesSum = ({
	label,
	zoopFees,
	partnerFees,
	aplicationFees,
	agentFees,
}) => {
	const getPercentFeeByBrand = (card_brand, fees) => {
		const brandFee = fees.find((fee) => fee.card_brand === card_brand);
		return brandFee?.percent_amount ?? 0.0;
	};

	const checkExistenceByBrand = (card_brand, fees) => {
		const brandFee = fees.find((fee) => fee.card_brand === card_brand);
		return brandFee ? true : false;
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<Typography variant="h6">{label ?? 'APLICAÇÃO'}</Typography>

			{Object.keys(zoopFees).map((key) => {
				const cardBrand = zoopFees[key].card_brand;
				const Flag =
					flags[cardBrand ? cardBrand.toLowerCase().replace(' ', '') : ''];
				return (
					// checkExistenceByBrand(cardBrand, zoopFees) &&
					<Box display="flex" justifyContent="center" alignItems="center">
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
								{zoopFees[key].card_brand}
							</Typography>
						</Box>
						<Typography style={{ paddingLeft: '10px' }}>
							{(
								(parseInt(
									partnerFees
										? getPercentFeeByBrand(cardBrand, partnerFees)
										: 0.0
								) +
									parseInt(
										zoopFees
											? getPercentFeeByBrand(cardBrand, zoopFees)
											: 0.0
									) +
									parseInt(
										aplicationFees
											? getPercentFeeByBrand(
													cardBrand,
													aplicationFees
											  )
											: 0.0
									) +
									parseInt(
										agentFees
											? getPercentFeeByBrand(cardBrand, agentFees)
											: 0.0
									)) /
								100
							).toFixed(2)}
							%
						</Typography>
					</Box>
				);
			})}
		</Box>
	);
};

export default CardFeesSum;
