import '../../fonts/Montserrat-SemiBold.otf';
import '../../fonts/Montserrat-Regular.otf';
import '../../fonts/microgramma-d-bold-extended.otf';

import {
	Box,
	Button,
	TextField,
	Typography,
	makeStyles,
	InputAdornment,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import { Link } from 'react-router-dom';
import { postLoginAction, setSessionAuth } from '../../actions/actions';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import CustomTextFieldPassword from '../../components/CustomTextFieldPassword/CustomTextFieldPassword';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '100vw',
		height: '100vh',

		background: APP_CONFIG.mainCollors.primaryGradient,
		justifyContent: 'flex-end',
	},
	textfield: {
		display: 'flex',
		justifyContent: 'center',

		width: '45%',
	},
	title: {
		letterSpacing: '3px',
		fontFamily: 'microgramma-d-bold-extended',
	},
	subtitle: {
		fontFamily: 'Montserrat-Regular',
	},
	forgotPassword: {
		fontFamily: 'Montserrat-Regular',
		color: APP_CONFIG.mainCollors.forgotPasswordLogin,
	},
}));

const Login = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const token = useAuth();

	const classes = useStyles();
	const [loginData, setLoginData] = useState({
		email: '',
		password: '',
	});
	const handleLogin = async (e) => {
		e.preventDefault();

		const resLogin = await dispatch(
			postLoginAction(loginData.email, loginData.password)
		);
		if (resLogin) {
			await localStorage.setItem(
				'@auth',
				JSON.stringify({
					...resLogin.data,
					login_time: new Date().getTime(),
				})
			);
			/* const login_time = new Date().getTime();
			await dispatch(
				setSessionAuth({ ...resLogin.data, login_time: login_time })
			); */

			history.push('/dashboard/home');
		} else {
			toast.error('Usuário ou senha inválidos');
		}
	};

	return (
		<Box className={classes.root}>
			<Box
				style={{
					width: '100%',
					display: 'flex',

					height: '100%',
					marginTop: '150px',

					alignSelf: 'center',
				}}
			>
				<Box
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						alignItems: 'center',
					}}
				>
					<Box
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							height: '100%',
							marginRight: '00px',

							alignSelf: 'center',
						}}
					>
						<Box
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								alignSelf: 'center',
							}}
						>
							<img
								src={APP_CONFIG.assets.smallWhiteLogo}
								alt=""
								style={{
									width: '200px',
								}}
							/>

							{/* <Typography
								variant="h4"
								aling="center"
								className={classes.title}
							>
								LOGO Vbank
							</Typography> */}

							{/* <Typography
								variant="h9"
								align="center"
								className={classes.subtitle}
							>
								Digite seu e-mail e senha para ter acesso à plataforma
							</Typography> */}
						</Box>
						<Box
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								height: '100%',
								width: '100%',
								marginBottom: '30%',
								zIndex: 10,
							}}
						>
							<form
								onSubmit={(e) => handleLogin(e)}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									height: '100%',
									justifyContent: 'center',
									width: '100%',
									marginBottom: '10%',
								}}
							>
								<CustomTextField
									variant="outlined"
									style={{
										width: '300px',
										margin: '10px',
									}}
									onChange={(e) =>
										setLoginData({
											...loginData,
											email: e.target.value,
										})
									}
									placeholder="Email"
									size="small"
									type="email"
									id="email"
									name="email"
									autoComplete="email"
									autoFocus
									required
								/>

								<CustomTextFieldPassword
									/* InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LockIcon style={{ color: 'white' }} />
											</InputAdornment>
										),
									}} */
									style={{ width: '300px' }}
									onChange={(e) =>
										setLoginData({
											...loginData,
											password: e.target.value,
										})
									}
									placeholder="Senha"
									size="small"
									type="password"
									variant="outlined"
									margin="none"
									required
									name="password"
									id="password"
									autoComplete="current-password"
								/>

								<Box
									display="flex"
									flexDirection="column"
									/* alignItems="center" */
									marginTop="10px"
									marginBottom="30px"
									style={{ width: '100%' }}
								>
									{/* <Button
										uppercase={false}
										className={classes.forgotPassword}
										size="small"
										component={Link}
										to="/solictar-reset"
										style={{ height: '28px', borderRadius: '27px' }}
									> */}
									<Box>
										<Typography
											component={Link}
											className={classes.forgotPassword}
											to="/solicitar-reset"
											uppercase={false}
											variant="h9"
											style={{
												display: 'flex',
												justifyContent: 'end',
												marginBottom: '30px',
											}}
										>
											Esqueci a senha.
										</Typography>
									</Box>
									{/* </Button> */}
								</Box>
								<CustomButton color="white" type="submit" size="medium">
									Entrar
								</CustomButton>
								<Box style={{ marginTop: '100px' }}>
									<Typography
										variant="h9"
										style={{ color: 'white', fontSize: 16 }}
									>
										É seu primeiro acesso?{' '}
									</Typography>

									<Typography
										className={classes.forgotPassword}
										component={Link}
										to="/cadastro"
									>
										Cadastrar senha.
									</Typography>
								</Box>
							</form>
						</Box>
					</Box>
				</Box>
			</Box>
			{APP_CONFIG.name === 'Bankzz - Dashboard do Banco xBank' ? (
				<Box style={{ position: 'fixed', width: '100%' }}>
					<img
						src={APP_CONFIG.assets.backgroundLogo}
						alt=""
						style={{ width: '100%' }}
					/>
				</Box>
			) : (
				<img
					src={APP_CONFIG.assets.backgroundLogo}
					alt=""
					style={
						APP_CONFIG.name === 'POMELO - Dashboard do Banco POMELO' ||
						APP_CONFIG.name === 'xBank - Dashboard do Banco xBank'
							? {
									width: '400px',
									position: 'absolute',
									right: '0px',
									bottom: '0px',
							  }
							: {
									width: '600px',
									position: 'absolute',
									right: '0px',
									bottom: '0px',
							  }
					}
				/>
			)}

			{/* <Box
				style={{
					width: '500px',
					height: '1000px',
					position: 'absolute',
					display: 'flex',
					alignItems: 'flex-end',
				}}
			>
				
			</Box> */}
		</Box>
	);
};

export default Login;
