import React, { useMemo, useState } from 'react';
import {
	Box,
	makeStyles,
	Paper,
	Tab,
	Tabs,
	Typography,
} from '@material-ui/core';

import { useSelector } from 'react-redux';

import { useCallback } from 'react';
import CardFeeDetails from '../CardFeeDetails/CardFeeDetails';
import { APP_CONFIG } from '../../constants/config';
import { isEmpty } from 'lodash';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
	tabSelected: {
		backgroundColor: APP_CONFIG.mainCollors.backgrounds,
	},
}));

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
};

const FeeDetails = ({ feeDetails, baseFeeDetails }) => {
	const classes = useStyles();
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	function a11yProps(index) {
		return {
			id: `vertical-tab-${index}`,
			'aria-controls': `vertical-tabpanel-${index}`,
			classes: {
				selected: classes.tabSelected,
			},
		};
	}

	const tabs = useMemo(() => {
		let availableTabs = [];

		if (feeDetails.credit_presential) {
			availableTabs.push('Crédito - CP');
		}

		if (feeDetails.credit_online) {
			availableTabs.push('Crédito - CNP');
		}

		if (feeDetails.debit_presential) {
			availableTabs.push('Débito - CP');
		}

		if (feeDetails.boleto) {
			availableTabs.push('Boleto');
		}

		if (feeDetails.pix) {
			availableTabs.push('Pix');
		}

		return availableTabs;
	}, [feeDetails]);

	const getTabIndex = useCallback(
		(value) => tabs.findIndex((tab) => value === tab),
		[tabs]
	);

	return (
		<Paper className={classes.root}>
			<Tabs
				value={value}
				onChange={handleChange}
				indicatorColor="primary"
				textColor="primary"
				style={{ alignSelf: 'center' }}
				variant="scrollable"
				scrollButtons="auto"
			>
				{tabs.map((tab, index) => (
					<Tab label={tab} key={tab} {...a11yProps(index)} />
				))}
			</Tabs>

			{feeDetails?.credit_presential && (
				<TabPanel value={value} index={getTabIndex('Crédito - CP')}>
					<CardFeeDetails
						width="100%"
						feesGroupedByInstallments={feeDetails.credit_presential}
						baseFeesGroupedByInstallments={
							baseFeeDetails?.credit_presential
						}
					/>
				</TabPanel>
			)}

			{feeDetails?.credit_online && (
				<TabPanel value={value} index={getTabIndex('Crédito - CNP')}>
					<CardFeeDetails
						width="100%"
						feesGroupedByInstallments={feeDetails.credit_online}
						baseFeesGroupedByInstallments={baseFeeDetails?.credit_online}
					/>
				</TabPanel>
			)}

			{feeDetails?.debit_presential && (
				<TabPanel value={value} index={getTabIndex('Débito - CP')}>
					<CardFeeDetails
						width="100%"
						feesGroupedByInstallments={feeDetails.debit_presential}
						baseFeesGroupedByInstallments={
							baseFeeDetails?.debit_presential
						}
					/>
				</TabPanel>
			)}

			{feeDetails?.boleto && (
				<TabPanel value={value} index={getTabIndex('Boleto')}>
					<Box display="flex" flexDirection="column" alignItems="center">
						<Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
							Percentual:{' '}
							{!isEmpty(feeDetails.boleto?.partner) &&
							!isEmpty(feeDetails.boleto?.zoop)
								? (
										(feeDetails.boleto?.partner[0].percent_amount +
											feeDetails.boleto?.zoop[0].percent_amount) /
										100
								  ).toFixed(2)
								: 0}
							%
						</Typography>
						<Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
							Valor fixo: R$
							{!isEmpty(feeDetails.boleto?.partner) &&
							!isEmpty(feeDetails.boleto?.zoop)
								? (
										(feeDetails.boleto?.partner[0].dollar_amount +
											feeDetails.boleto?.zoop[0].dollar_amount) /
										100
								  ).toFixed(2)
								: '0.00'}
						</Typography>
					</Box>
				</TabPanel>
			)}

			{feeDetails.pix && (
				<TabPanel value={value} index={getTabIndex('Pix')}>
					<Box display="flex" flexDirection="column" alignItems="center">
						<Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
							Percentual:{' '}
							{!isEmpty(feeDetails.boleto?.partner) &&
							!isEmpty(feeDetails.boleto?.zoop[0])
								? (
										(feeDetails.boleto?.partner[0].percent_amount +
											feeDetails.boleto?.zoop[0].percent_amount) /
										100
								  ).toFixed(2)
								: 0}
							%
						</Typography>
						<Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
							Valor fixo: R$
							{!isEmpty(feeDetails.boleto?.partner[0].dollar_amount) &&
							!isEmpty(feeDetails.boleto?.zoop[0].dollar_amount)
								? (
										(feeDetails.boleto?.partner[0].dollar_amount +
											feeDetails.boleto?.zoop[0].dollar_amount) /
										100
								  ).toFixed(2)
								: '0.00'}
						</Typography>
					</Box>
				</TabPanel>
			)}
		</Paper>
	);
};

export default FeeDetails;
