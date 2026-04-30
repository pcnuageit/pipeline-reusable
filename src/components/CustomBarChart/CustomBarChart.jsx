import * as React from 'react';

import {
	ArgumentAxis,
	BarSeries,
	Chart,
	LineSeries,
	ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Box, Typography } from '@material-ui/core';
import {
	getGraficoContaBarDashboardAction,
	getGraficoContaLineDashboardAction,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useState } from 'react';
import { APP_CONFIG } from '../../constants/config';

const CustomBarChart = () => {
	const token = useAuth();
	const dispatch = useDispatch();
	const graficoBarra = useSelector((state) => state.graficoBarra);

	useEffect(() => {
		dispatch(getGraficoContaBarDashboardAction(token));
	}, []);

	return (
		<Paper
			style={{
				borderRadius: 20,
				backgroundColor: APP_CONFIG.mainCollors.backgrounds,
			}}
		>
			<Chart data={graficoBarra} pallete="black" height={300}>
				<Box style={{ padding: '20px' }}>
					<Typography
						style={{
							fontFamily: 'Montserrat-SemiBold',
							marginTop: '3px',
						}}
					>
						Quantidade de Status de Contas
					</Typography>
				</Box>
				<ArgumentAxis style={{ color: 'black' }} />
				<ValueAxis showGrid={false} />

				<BarSeries
					valueField="value"
					argumentField="argument"
					barWidth={0.1}
					color={APP_CONFIG.mainCollors.primary}
				/>
			</Chart>
		</Paper>
	);
};

export default CustomBarChart;
