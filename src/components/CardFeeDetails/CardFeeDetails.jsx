import { useMediaQuery } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { APP_CONFIG } from "../../constants/config";
import CardFeesBox from "../CardFeesBox/CardFeesBox";
import CardFeesSum from "../CardFeesSum/CardFeesSum";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabSelected: {
    backgroundColor: theme.palette.secondary.light,
  },
}));

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const flagOrders = [
  "MasterCard",
  "Visa",
  "Elo",
  "American Express",
  "Hiper",
  "Hipercard",
  "Diners Club",
  "Discover",
  "Cabal",
  "Banescard",
  "Aura",
  "JCB",
  "Maestro",
  "Visa Electron",
  "Outros",
];

const sortInstallment = (flagA, flagB) => {
  const flagAIndex = flagOrders.findIndex(
    (flagOrder) => flagA.card_brand === flagOrder
  );
  const flagBIndex = flagOrders.findIndex(
    (flagOrder) => flagB.card_brand === flagOrder
  );

  return flagAIndex - flagBIndex;
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const CardFeeDetails = ({
  feesGroupedByInstallments,
  disableAll,
  baseFeesGroupedByInstallments,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const userPermissions = useSelector((state) => state.userPermissao.permissao);
  const permissionsName = userPermissions.map((permission) => permission.tipo);
  /* const canSeeAndEditAllFees = useMemo(
		() =>
			permissionsName.includes(ADM_PERMISSIONS.INTTEGRAR) ||
			permissionsName.includes(
				ADM_PERMISSIONS.APP_SALES_PLAN_FEE_MANAGEMENT
			),
		[permissionsName]
	); */
  /* const isSalesPlanManager = useMemo(
		() => permissionsName.includes(ADM_PERMISSIONS.SALES_PLAN_MANAGEMENT),
		[permissionsName]
	);
	const isAdm = useMemo(
		() => permissionsName.includes(ADM_PERMISSIONS.ADMIN),
		[permissionsName]
	); */

  const [value, setValue] = useState(0);
  const [keys, setKeys] = useState([]);
  const [personHeight, setPersonHeighy] = useState();

  useEffect(() => {
    setPersonHeighy(matches ? "700px" : "100%");
  }, [matches]);

  useEffect(() => {
    if (feesGroupedByInstallments) {
      setKeys(Object.keys(feesGroupedByInstallments));
    }
  }, [feesGroupedByInstallments]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        style={{
          height: personHeight,
          width: "100px",
          alignItems: "center",
        }}
      >
        {keys.map((key) => (
          <Tab
            label={`${key}x`}
            {...a11yProps(key)}
            classes={{ selected: classes.tabSelected }}
          />
        ))}
      </Tabs>

      {Object.entries(feesGroupedByInstallments).map(
        ([installment, installmentFees], numerickey) => {
          const sortedInstallmentFees = Object.entries(installmentFees).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: [...value].sort(sortInstallment),
            }),
            {}
          );

          const sortedBaseInstallmentFees = Object.entries(
            baseFeesGroupedByInstallments
              ? baseFeesGroupedByInstallments[installment]
              : {}
          ).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: [...value].sort(sortInstallment),
            }),
            {}
          );

          return (
            <TabPanel value={value} index={numerickey}>
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-around"
                alignItems="start"
                width="100%"
              >
                <>
                  {
                    sortedInstallmentFees.partner && (
                      <CardFeesBox
                        cardFees={sortedInstallmentFees.partner}
                        label="PARCEIRO"
                        editable={false}
                      />
                    ) // sera removido no futuro
                  }
                  {sortedInstallmentFees.zoop && (
                    <CardFeesBox
                      cardFees={sortedInstallmentFees.zoop}
                      label="SISTEMA"
                      editable={false}
                    />
                  )}
                  {sortedInstallmentFees.aplication && (
                    <CardFeesBox
                      cardFees={sortedInstallmentFees.aplication}
                      label={APP_CONFIG.name}
                      editable={true && !disableAll}
                    />
                  )}

                  {sortedBaseInstallmentFees.zoop && (
                    <CardFeesSum
                      label="BASE"
                      zoopFees={sortedBaseInstallmentFees.zoop}
                      partnerFees={sortedBaseInstallmentFees.partner}
                      aplicationFees={sortedBaseInstallmentFees.aplication}
                    />
                  )}

                  {sortedInstallmentFees.agent && (
                    <CardFeesBox
                      cardFees={sortedInstallmentFees.agent}
                      label="REPRESENTANTE"
                      editable={false}
                    />
                  )}

                  {sortedInstallmentFees.zoop && (
                    <CardFeesSum
                      label="TOTAL"
                      zoopFees={sortedInstallmentFees.zoop}
                      partnerFees={sortedInstallmentFees.partner}
                      aplicationFees={sortedInstallmentFees.aplication}
                      agentFees={sortedInstallmentFees.agent}
                    />
                  )}

                  {sortedBaseInstallmentFees.zoop && (
                    <CardFeesSum
                      label="TOTAL"
                      zoopFees={sortedBaseInstallmentFees.zoop}
                      partnerFees={sortedBaseInstallmentFees.partner}
                      aplicationFees={sortedBaseInstallmentFees.aplication}
                      agentFees={sortedInstallmentFees.agent}
                    />
                  )}
                </>
              </Box>
            </TabPanel>
          );
        }
      )}
    </div>
  );
};

export default CardFeeDetails;
/* import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useEffect } from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';
import { useMediaQuery } from '@material-ui/core';
import { useSelector } from 'react-redux';

import flags from '../../constants/flags';
import { APP_CONFIG } from '../../constants/config';
import CardFeesSum from '../CardFeesSum/CardFeesSum';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
	},
	tabSelected: {
		backgroundColor: theme.palette.secondary.light,
	},
}));

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			style={{ width: '100%' }}
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					<Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
						{children}
					</Typography>
				</Box>
			)}
		</div>
	);
}

const flagOrders = [
	'MasterCard',
	'Visa',
	'Elo',
	'American Express',
	'Hiper',
	'Hipercard',
	'Diners Club',
	'Discover',
	'Cabal',
	'Banescard',
	'Aura',
	'JCB',
];

const sortInstallment = (flagA, flagB) => {
	const flagAIndex = flagOrders.findIndex(
		(flagOrder) => flagA.card_brand === flagOrder
	);
	const flagBIndex = flagOrders.findIndex(
		(flagOrder) => flagB.card_brand === flagOrder
	);

	return flagAIndex - flagBIndex;
};

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

const CardFeeDetails = ({
	feesGroupedByInstallments,
	baseFeesGroupedByInstallments,
}) => {
	const classes = useStyles();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('md'));

	const [value, setValue] = React.useState(0);
	const [keys, setKeys] = useState([]);
	const [personHeight, setPersonHeighy] = useState();

	useEffect(() => {
		setPersonHeighy(matches ? '700px' : '100%');
	}, [matches]);

	useEffect(() => {
		if (feesGroupedByInstallments) {
			setKeys(Object.keys(feesGroupedByInstallments));
		}
	}, [feesGroupedByInstallments]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div className={classes.root}>
			<Tabs
				orientation="vertical"
				variant="scrollable"
				value={value}
				onChange={handleChange}
				aria-label="Vertical tabs example"
				className={classes.tabs}
				style={{
					height: personHeight,
					width: '100px',
					alignItems: 'center',
				}}
			>
				{keys.map((key) => (
					<Tab
						label={`${key}x`}
						{...a11yProps(key)}
						classes={{ selected: classes.tabSelected }}
					/>
				))}
			</Tabs>
			{Object.entries(feesGroupedByInstallments).map(
				([installment, installmentFees], numerickey) => {
					const sortedInstallmentFees = Object.entries(
						installmentFees
					).reduce(
						(acc, [key, value]) => ({
							...acc,
							[key]: [...value].sort(sortInstallment),
						}),
						{}
					);
					const sortedBaseInstallmentFees = Object.entries(
						baseFeesGroupedByInstallments
							? baseFeesGroupedByInstallments[installment]
							: {}
					).reduce(
						(acc, [key, value]) => ({
							...acc,
							[key]: [...value].sort(sortInstallment),
						}),
						{}
					);
					return (
						<TabPanel value={value} index={numerickey}>
							<Box
								display="flex"
								flexWrap="wrap"
								justifyContent="space-around"
								width="100%"
							>
								{sortedBaseInstallmentFees.zoop && (
									<CardFeesSum
										label="BASE"
										zoopFees={sortedBaseInstallmentFees.zoop}
										partnerFees={sortedBaseInstallmentFees.partner}
										aplicationFees={
											sortedBaseInstallmentFees.aplication
										}
									/>
								)}
								<Box
									display="flex"
									flexDirection="column"
									justifyContent="center"
									alignItems="center"
								>
									{Object.keys(sortedInstallmentFees.partner).map(
										(key) => {
											const Flag =
												flags[
													sortedInstallmentFees.partner[key]
														.card_brand
														? sortedInstallmentFees.partner[
																key
														  ].card_brand
																.toLowerCase()
																.replace(' ', '')
														: ''
												];
											return (
												<Box
													display="flex"
													justifyContent="center"
													alignItems="center"
												>
													<Box
														display="flex"
														width="200px"
														alignItems="center"
													>
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
																<FontAwesomeIcon
																	icon={faCreditCard}
																	size={'1x'}
																/>
															)}
														</Box>
														<Typography
															style={{ paddingLeft: '5px' }}
														>
															{
																sortedInstallmentFees.partner[
																	key
																].card_brand
															}
														</Typography>
													</Box>
													<Typography
														style={{ paddingLeft: '10px' }}
													>
														Percentual:{' '}
														{(
															(sortedInstallmentFees.partner[key]
																.percent_amount +
																sortedInstallmentFees.zoop[key]
																	.percent_amount) /
															100
														).toFixed(2)}
														%
													</Typography>
													<Typography
														style={{ paddingLeft: '10px' }}
													>
														Valor fixo: R$
														{(
															(sortedInstallmentFees.partner[key]
																.dollar_amount +
																sortedInstallmentFees.zoop[key]
																	.dollar_amount) /
															100
														).toFixed(2) ?? '-'}
													</Typography>
												</Box>
											);
										}
									)}
								</Box>
							</Box>
						</TabPanel>
					);
				}
			)}
		</div>
	);
};

export default CardFeeDetails;
 */
