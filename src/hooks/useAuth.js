import { debounce } from 'lodash';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { postRefreshAuth } from '../services/services';

const useAuth = () => {
	const history = useHistory();

	const refreshAuth = async () => {
		const authToken = JSON.parse(localStorage.getItem('@auth'));
		if (authToken && authToken.access_token) {
			try {
				const { data } = await postRefreshAuth(authToken.access_token);
				await localStorage.setItem(
					'@auth',
					JSON.stringify({
						...data,
						login_time: new Date().getTime(),
					})
				);
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		setInterval(() => {
			refreshAuth();
		}, 1140000);
	}, []);

	const auth = () => {
		let auth = JSON.parse(localStorage.getItem('@auth'));

		if (auth) {
			const timeDifference = (new Date().getTime() - auth.login_time) / 1000;

			if (timeDifference > auth.expires_in) {
				localStorage.removeItem('@auth');
				toast.warning('Seu tempo de acesso expirou!', { autoClose: true });
				history.push('/login');
			}
			return auth;
		} else {
			return { access_token: null };
		}
	};
	return auth().access_token;
};

export default useAuth;

/* import { useHistory } from 'react-router';
import { toast } from 'react-toastify';

const useAuth = () => {
	const history = useHistory();

	const auth = () => {
		const auth = JSON.parse(localStorage.getItem('@auth'));

		if (auth) {
			const timeDifference = (new Date().getTime() - auth.login_time) / 1000;

			if (timeDifference > auth.expires_in) {
				localStorage.removeItem('@auth');
				toast.warning('Seu tempo de acesso expirou!', { autoClose: true });
				history.push('/login');
			}
			return auth;
		} else {
			return { access_token: null };
		}
	};
	return auth().access_token;
};

export default useAuth; */
