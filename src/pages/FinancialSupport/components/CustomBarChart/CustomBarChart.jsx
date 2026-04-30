import * as React from 'react';

import {
	ArgumentAxis,
	BarSeries,
	Chart,
	ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Box, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { APP_CONFIG } from '../../../../constants/config';

const CustomBarChart = ({ data }) => {
	return (
		<Paper
			style={{
				borderRadius: 20,
				backgroundColor: APP_CONFIG.mainCollors.backgrounds,
			}}
		>
			<Chart
				data={Object.entries(data).map(([key, value]) => ({
					argument:
						(key.charAt(0).toUpperCase() + key.slice(1)).slice(0, 3) +
						'.',
					value,
				}))}
				pallete="black"
				height={300}
			>
				<Box style={{ padding: '20px' }}>
					<Typography
						style={{
							fontFamily: 'Montserrat-SemiBold',
							marginTop: '3px',
						}}
					>
						Quantidade de apoios por Status
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
