import * as React from 'react';

import {
	ArgumentAxis,
	Chart,
	LineSeries,
	Legend,
	ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';

import { Box, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { APP_CONFIG } from '../../../../constants/config';

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

const status = [
	{
		text: 'Ativo',
		color: 'lightgreen',
	},
	{
		text: 'Assinado',
		color: 'green',
	},
	{
		text: 'Atras.',
		color: 'orange',
	},
	{
		text: 'Recus.',
		color: 'darkred',
	},
	{
		text: 'Anali.',
		color: 'yellow',
	},
	{
		text: 'Pend.',
		color: 'white',
	},
	{
		text: 'Canc.',
		color: 'red',
	},
	{
		text: 'Val. Neg.',
		color: 'black',
	},
];

const CustomLineChart = ({ data }) => (
	<Paper
		style={{
			borderRadius: 20,
			background: APP_CONFIG.mainCollors.primaryGradient,
			marginRight: '40px',
		}}
	>
		<Chart
			data={data.map((data) => ({
				...data,
				argument:
					data.argument.charAt(0).toUpperCase() + data.argument.slice(1),
			}))}
			pallete="black"
			height={300}
		>
			<Box style={{ padding: '20px' }}>
				<Box flex={1}>
					<Typography
						style={{
							color: 'white',
							fontFamily: 'Montserrat-SemiBold',
							marginTop: '3px',
						}}
					>
						Status das antecipações por mês
					</Typography>
				</Box>
				<Box>
					<Legend.Root
						style={{
							padding: 0,
							width: 'auto',
							display: 'flex',
							flexWrap: 'wrap',
						}}
					>
						{status.map(({ text, color }) => (
							<Legend.Item
								style={{
									width: 'auto',
									paddingLeft: 8,
									paddingRight: 8,
								}}
							>
								<Box
									width={10}
									height={10}
									borderRadius={10}
									bgcolor={color}
								/>
								<Legend.Label
									style={{
										color: 'white',
									}}
									text={text}
								/>
							</Legend.Item>
						))}
					</Legend.Root>
				</Box>
			</Box>

			<ArgumentAxis labelComponent={labelColorFunction} />
			<ValueAxis labelComponent={labelColorFunction} showGrid={false} />
			<LineSeries
				color="yellow"
				valueField="analise"
				argumentField="argument"
			/>
			<LineSeries
				color="green"
				valueField="assinado"
				argumentField="argument"
			/>
			<LineSeries
				color="white"
				valueField="pendente"
				argumentField="argument"
			/>
			<LineSeries
				color="darkred"
				valueField="recusado"
				argumentField="argument"
			/>
			<LineSeries
				color="black"
				valueField="validacao_negada"
				argumentField="argument"
			/>
			<LineSeries
				color="red"
				valueField="cancelado"
				argumentField="argument"
			/>
			<LineSeries
				color="orange"
				valueField="atrasado"
				argumentField="argument"
			/>
			<LineSeries
				color="lightgreen"
				valueField="ativo"
				argumentField="argument"
			/>
		</Chart>
	</Paper>
);

export default CustomLineChart;
