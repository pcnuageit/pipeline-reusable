import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { APP_CONFIG } from './constants/config';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

datadogRum.init({
	applicationId: APP_CONFIG.datadog.application_id,
	clientToken: APP_CONFIG.datadog.client_token,
	site: 'datadoghq.com',
	service: 'dahsboard-xbank',
	env: 'prod',
	//  version: '1.0.0',
	sessionSampleRate: 100,
	sessionReplaySampleRate: 20,   
	trackResources: true,
	trackLongTasks: true,
	trackUserInteractions: true,
	defaultPrivacyLevel: 'mask-user-input',
});

datadogLogs.init({
	applicationId: APP_CONFIG.datadog.application_id,
	clientToken: APP_CONFIG.datadog.client_token,
	site: 'datadoghq.com',
	service: 'dahsboard-xbank',
	env: 'prod',
	forwardErrorsToLogs: true,
	sessionSampleRate: 100,
});

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
