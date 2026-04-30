import * as React from 'react';

import {
	ArgumentAxis,
	Chart,
	LineSeries,
	Title,
	ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Box, Typography } from '@material-ui/core';
import {
	getGraficoContaBarDashboardAction,
	getGraficoContaLineDashboardAction,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import { Palette } from '@devexpress/dx-react-chart';
import Paper from '@material-ui/core/Paper';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useState } from 'react';
import { APP_CONFIG } from '../../constants/config';

const labelColor = '#fff';

const makeLabel =
	(symbol, color) =>
	({ text, style, ...restProps }) =>
		(
			<ValueAxis.Label
				text={`${text} ${symbol}`}
				style={{
					fontSize: '10px',
					fill: color,
					...style,
				}}
				{...restProps}
			/>
		);

const labelColorFunction = makeLabel('', labelColor);

const CustomLineChart = () => {
	const token = useAuth();
	const dispatch = useDispatch();
	const graficoLinha = useSelector((state) => state.graficoLinha);

	useEffect(() => {
		dispatch(getGraficoContaLineDashboardAction(token));
	}, []);

	return (
		<Paper
			style={{
				borderRadius: 20,
				background: APP_CONFIG.mainCollors.buttonGradientVariant,
				marginRight: '40px',
			}}
		>
			<Chart data={graficoLinha} pallete="black" height={300}>
				<Box style={{ padding: '20px' }}>
					<Typography
						style={{
							color: 'white',
							fontFamily: 'Montserrat-SemiBold',
							marginTop: '3px',
						}}
					>
						Contas Cadastradas por Mês
					</Typography>
				</Box>

				<ArgumentAxis labelComponent={labelColorFunction} />
				<ValueAxis labelComponent={labelColorFunction} showGrid={false} />
				<LineSeries
					color="white"
					valueField="value"
					argumentField="argument"
				/>
			</Chart>
		</Paper>
	);
};

export default CustomLineChart;
