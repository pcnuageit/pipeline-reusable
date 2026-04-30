import loginSvg from '../assets/vBankPJAssets/LoginSVG.svg';
import smallColoredLogo from '../assets/vBankPJAssets/vBankSmallLogo.svg';
import smallWhiteLogo from '../assets/vBankPJAssets/vBankSmallLogoWhite.svg';
import backgroundLogo from '../assets/vBankPJAssets/backgroundLogo.svg';
import tokenImageSvg from '../assets/vBankPJAssets/tokenImage.svg';
import faviconVbank from '../assets/vBankPJAssets/favicon/favicon.ico';

//vbank
import loginSvgAmazon from '../assets/amazonBankAssets/LoginSVG.svg';
import smallColoredLogoAmazon from '../assets/amazonBankAssets/amazonBankGreenLogo.svg';
import smallWhiteLogoAmazon from '../assets/amazonBankAssets/amazonBankLogo.svg';
import backgroundLogoAmazon from '../assets/amazonBankAssets/backgroundLogo.svg';
import tokenImageSvgAmazon from '../assets/amazonBankAssets/tokenImage.svg';
import faviconAmazon from '../assets/amazonBankAssets/favicon/favicon.ico';
//amazonbank

import loginSvgAcium from '../assets/aciumAssets/loginSvgAcium.svg';
import smallColoredLogoAcium from '../assets/aciumAssets/smallColoredLogoAcium.svg';
import smallWhiteLogoAcium from '../assets/aciumAssets/smallWhiteLogoAcium.svg';
import backgroundLogoAcium from '../assets/aciumAssets/backgroundLogoAcium.svg';
import tokenImageAcium from '../assets/aciumAssets/tokenImageAcium.svg';
import faviconAcium from '../assets/aciumAssets/favicon/favicon.ico';
//acium

import loginSvgAprobank from '../assets/aprobankAssets/loginSvgAprobank.svg';
import smallColoredLogoAprobank from '../assets/aprobankAssets/smallColoredLogoAprobank.svg';
//import smallWhiteLogoAprobank from '../assets/aprobankAssets/smallWhiteLogoAprobank.svg';
import backgroundLogoAprobank from '../assets/aprobankAssets/backgroundLogoAprobank.svg';
import tokenImageAprobank from '../assets/aprobankAssets/tokenImageAprobank.svg';
import faviconAprobank from '../assets/aprobankAssets/favicon/favicon.ico';
//aprobank

import loginSvgBelobank from '../assets/belobankAssets/loginSvgBelobank.svg';
import smallColoredLogoBelobank from '../assets/belobankAssets/smallColoredLogoBelobank.svg';
import smallWhiteLogoBelobank from '../assets/belobankAssets/smallWhiteLogoBelobank.svg';
import backgroundLogoBelobank from '../assets/belobankAssets/backgroundLogoBelobank.svg';
import tokenImageBelobank from '../assets/belobankAssets/tokenImageBelobank.svg';
import faviconBelobank from '../assets/belobankAssets/favicon/favicon.ico';
//belobank

import loginSvgSimer from '../assets/simerAssets/loginSvgSimer.svg';
import smallColoredLogoSimer from '../assets/simerAssets/smallColoredLogoSimer.svg';
import smallWhiteLogoSimer from '../assets/simerAssets/smallWhiteLogoSimer.svg';
//import backgroundLogoSimer from '../assets/simerAssets/backgroundLogoSimer.svg';
import tokenImageSimer from '../assets/simerAssets/tokenImageSimer.svg';
import faviconSimer from '../assets/simerAssets/favicon/favicon.ico';
//simerbank

import loginSvgPomelo from '../assets/pomeloAssets/loginSvgPomelo.svg';
import smallColoredLogoPomelo from '../assets/pomeloAssets/smallColoredLogoPomelo.svg';
/* import smallWhiteLogoPomelo from '../assets/pomeloAssets/smallWhiteLogoPomelo.svg'; */
import backgroundLogoPomelo from '../assets/pomeloAssets/backgroundLogoPomelo.svg';
import tokenImagePomelo from '../assets/pomeloAssets/tokenImagePomelo.svg';
import faviconPomelo from '../assets/pomeloAssets/favicon/favicon.ico';
//pomelo

import loginSvgXbank from '../assets/xbankAssets/loginSvgXbank.svg';
import smallColoredLogoXbank from '../assets/xbankAssets/smallColoredLogoXbank.svg';
/* import smallWhiteLogoXbank from '../assets/xbankAssets/smallWhiteLogoXbank.svg'; */
import backgroundLogoXbank from '../assets/xbankAssets/backgroundLogoXbank.svg';
import tokenImageXbank from '../assets/xbankAssets/tokenImageXbank.svg';
import faviconXbank from '../assets/xbankAssets/favicon/favicon.ico';
//xbank

import loginSvgBankzz from '../assets/bankzzAssets/smallColoredLogoBankzz.svg';

import smallColoredLogoBankzz from '../assets/bankzzAssets/smallColoredLogoBankzz.svg';
/* import smallWhiteLogoBankzz from '../assets/BankzzAssets/smallWhiteLogoBankzz.svg'; */
import backgroundLogoBankzz from '../assets/bankzzAssets/backgroundLogoBankzz.svg';
import backgroundLoginBankzz from '../assets/bankzzAssets/backgroundLoginBankzz.svg';
import tokenImageBankzz from '../assets/bankzzAssets/tokenImageBankzz.svg';
import faviconBankzz from '../assets/bankzzAssets/favicon/favicon.ico';
//bankzz

import loginSvgConcorrenciaPJ from "../assets/ConcorrenciaAssets/smallColoredLogoConcorrencia.svg";
import {
  default as loginSvgConcorrencia,
  default as smallColoredLogoConcorrencia,
} from "../assets/ConcorrenciaAssets/loginSvgXbankPJ.svg";
/* import smallWhiteLogoXbank from '../assets/xbankAssets/smallWhiteLogoXbank.svg'; */
import backgroundLogoConcorrencia from "../assets/ConcorrenciaAssets/backgroundLogoConcorrencia.svg";
import faviconConcorrencia from "../assets/ConcorrenciaAssets/favicon/favicon.ico";
import tokenImageConcorrencia from "../assets/ConcorrenciaAssets/tokenImageXbank.svg";
//concorrencia

export const APP_CONFIG = {
	vbank: {
		versao: '3.0.0',
		dataVersao: '00/00/00',
		AbaCartoes: true,
		AbaCredito: true,
		/* linkApp: "https://banking.integrapay.com.br", */
		name: 'V BANK - Dashboard do Banco IntegraPAY',
		description: 'V BANK – Soluções em pagamento para o seu negócio',
		headerListaContas: 'FitBank',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'fd4c279b-ce31-4253-9582-2757a872f530',
			client_token: 'pub493f20bad580831748a19ee380bb2433',
		},

		mainCollors: {
			primary: '#4C4B97',
			primaryVariant: '#7776BC',
			secondary: '#9D9DC6',
			backgrounds: '#ECECF4',
			disabledTextfields: '#E0DFF8',
			extratoHome: '#302F60',
			primaryGradient:
				'linear-gradient(135deg, rgba(2,149,59,1) 15%, rgba(75,75,150,1) 100%)',
			secondaryGradient:
				'linear-gradient(360deg, rgba(2,149,59,1) 0%, rgba(75,75,150,1) 100%)',
			buttonGradient:
				'linear-gradient(135deg, rgba(2,149,59,1) 10%, rgba(75,75,150,1) 100%)',
			buttonGradientVariant:
				'linear-gradient(180deg, rgba(2,149,59,1) 15%, rgba(75,75,150,1) 100%)',
			drawerSideBar: '#02953b',
			forgotPasswordLogin: '#ED757D',
		},
		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#FFF',
				},
				primary: {
					main: '#4C4B97',
					light: '#EDEDF4',
				},
				secondary: {
					main: '#fff',
					light: '#fff',
				},
				tertiary: {
					main: '#fff',
					light: '#fff',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#9D9DC6',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#9D9DC6',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvg,
			smallColoredLogo: smallColoredLogo,
			smallWhiteLogo: smallWhiteLogo,
			backgroundLogo: backgroundLogo,
			tokenImageSvg: tokenImageSvg,
			favicon: faviconVbank,
		},
	},

	amazonbank: {
		versao: '1.23.0',
		dataVersao: '26/01/24',
		AbaCartoes: false,
		AbaCredito: false,
		/* linkApp: "https://banking.integrapay.com.br", */
		name: 'Amazon Banking Trust - Dashboard do Banco Amazon Banking Trust',
		description: 'Amazon Banking Trust – Soluções em pagamento para o seu negócio',
		headerListaContas: 'AARIN',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'fd4c279b-ce31-4253-9582-2757a872f530',
			client_token: 'pub493f20bad580831748a19ee380bb2433',
		},

		mainCollors: {
			primary: '#0C4727',
			primaryVariant: '#299359',
			secondary: '#90BAA3',
			backgrounds: '#E7EDEA',
			disabledTextfields: '#90BAA3',
			extratoHome: '#123E26',
			primaryGradient:
				'linear-gradient(135deg, rgba(12,71,39,1) 15%, rgba(12,71,39,1) 100%)',
			secondaryGradient:
				'linear-gradient(360deg, rgba(215,162,31,1) 0%, rgba(170,122,19,1) 100%)',
			buttonGradient:
				'linear-gradient(135deg, rgba(215,162,31,1) 10%, rgba(170,122,19,1) 100%)',
			buttonGradientVariant:
				'linear-gradient(180deg, rgba(218,165,32,1) 15%, rgba(218,165,32,1) 100%)',
			drawerSideBar: '#d7a21f',
			forgotPasswordLogin: '#DAA520',
		},
		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#FFF',
				},
				primary: {
					main: '#0C4727',
					light: '#7A9A88',
				},
				secondary: {
					main: '#fff',
					light: '#fff',
				},
				tertiary: {
					main: '#fff',
					light: '#fff',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#7A9A88',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#7A9A88',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgAmazon,
			smallColoredLogo: smallColoredLogoAmazon,
			smallWhiteLogo: smallWhiteLogoAmazon,
			backgroundLogo: backgroundLogoAmazon,
			tokenImageSvg: tokenImageSvgAmazon,
			favicon: faviconAmazon,
		},
	},

	acium: {
		versao: '1.34.0',
		dataVersao: '19/09/23',
		AbaCartoes: false,
		AbaCredito: true,
		/* linkApp: "https://banking.integrapay.com.br", */
		linkDePagamento: 'https://banco.aciumbnk.com.br',
		name: 'ACIUM - Dashboard do Banco ACIUM',
		description: 'ACIUM – Soluções em pagamento para o seu negócio',
		headerListaContas: 'FitBank',
		crispId: '6501131f-ae92-4c67-8f05-01e1d5ff2784',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'c3f470a2-6a73-42c1-a965-a8b01a80d10e',
			client_token: 'pub75e24d18da8901a529a9aaa42345a1ce',
		},

		mainCollors: {
			primary: '#3C3C3C',
			primaryVariant: '#262626',
			secondary: '#070707',
			backgrounds: '#F4F4F4',
			disabledTextfields: '#E9E9E9',
			extratoHome: '#2B2B2B',
			primaryGradient:
				'linear-gradient(135deg, rgba(60,60,60) 15%, rgba(7,7,7) 100%)',
			secondaryGradient:
				'linear-gradient(360deg, rgba(60,60,60) 0%, rgba(7,7,7) 100%)',
			buttonGradient:
				'linear-gradient(135deg, rgba(60,60,60) 10%, rgba(7,7,7) 100%)',
			buttonGradientVariant:
				'linear-gradient(180deg, rgba(60,60,60) 15%, rgba(7,7,7) 100%)',
			drawerSideBar: '#3C3C3C',
			forgotPasswordLogin: '#ED757D',
		},
		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#fff',
				},
				primary: {
					main: '#3C3C3C',
					light: '#3C3C3C',
				},
				secondary: {
					main: '#3C3C3C',
					light: '#F4F4F4',
				},
				tertiary: {
					main: '#3C3C3C',
					light: '#3C3C3C',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#3C3C3C',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#3C3C3C',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgAcium,
			smallColoredLogo: smallColoredLogoAcium,
			smallWhiteLogo: loginSvgAcium,
			backgroundLogo: backgroundLogoAcium,
			tokenImageSvg: tokenImageAcium,
			favicon: faviconAcium,
		},
	},

	aprobank: {
		versao: '1.5.0',
		dataVersao: '08/08/24',
		AbaCartoes: false,
		AbaCredito: false,
		/* linkApp: "https://banking.integrapay.com.br", */
		name: 'QiTech',
		description: 'Aprobank – Soluções em pagamento para o seu negócio',
		headerListaContas: 'QiTech',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'c3f470a2-6a73-42c1-a965-a8b01a80d10e',
			client_token: 'pub75e24d18da8901a529a9aaa42345a1ce',
		},

		mainCollors: {
			primary: '#8D1812',
			primaryVariant: '#8D1812',
			secondary: '#8D1812',
			backgrounds: '#F2F2F2',
			disabledTextfields: '#E0DFF8',
			extratoHome: '#302F60',
			primaryGradient:
				'linear-gradient(180deg, rgba(160, 35, 34,1) 15%, rgba(98, 2, 0,1) 100%)',
			secondaryGradient:
				'linear-gradient(180deg, rgba(160, 35, 34,1) 15%, rgba(98, 2, 0,1) 100%)',
			buttonGradient:
				'linear-gradient(180deg, rgba(160, 35, 34,1) 15%, rgba(98, 2, 0,1) 100%)',
			buttonGradientVariant:
				'linear-gradient(180deg, rgba(160, 35, 34,1) 15%, rgba(98, 2, 0,1) 100%)',
			drawerSideBar: '#620200',
			forgotPasswordLogin: '#fff',
		},
		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#FFF',
				},
				primary: {
					main: '#8D1812',
					light: '#8D1812',
				},
				secondary: {
					main: '#fff',
					light: '#fff',
				},
				tertiary: {
					main: '#fff',
					light: '#fff',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#8D1812',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#8D1812',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgAprobank,
			smallColoredLogo: smallColoredLogoAprobank,
			smallWhiteLogo: loginSvgAprobank,
			backgroundLogo: backgroundLogoAprobank,
			tokenImageSvg: tokenImageAprobank,
			favicon: faviconAprobank,
		},
	},
	belobank: {
		versao: '1.3.0',
		dataVersao: '27/04/23',
		AbaCartoes: false,
		AbaCredito: false,
		/* linkApp: "https://banking.integrapay.com.br", */
		name: 'Belobank',
		description: 'Belobank – Soluções em pagamento para o seu negócio',
		headerListaContas: 'FitBank',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'c3f470a2-6a73-42c1-a965-a8b01a80d10e',
			client_token: 'pub75e24d18da8901a529a9aaa42345a1ce',
		},

		mainCollors: {
			primary: '#AF53FF',
			primaryVariant: '#AF53FF',
			secondary: '#AF53FF',
			backgrounds: '#FBF6FF',
			disabledTextfields: '#E0DFF8',
			extratoHome: '#302F60',
			primaryGradient:
				'linear-gradient(135deg, rgba(68, 3, 91,1) 15%, rgba(223, 61, 194,1) 100%)',
			secondaryGradient:
				'linear-gradient(0deg, rgba(68, 3, 91,1) 15%, rgba(223, 61, 194,1) 100%)',
			buttonGradient:
				'linear-gradient(270deg, rgba(68, 3, 91,1) 15%, rgba(223, 61, 194,1) 100%)',
			buttonGradientVariant:
				'linear-gradient(135deg, rgba(68, 3, 91,1) 15%, rgba(223, 61, 194,1) 100%)',
			drawerSideBar: '#44035b',
			forgotPasswordLogin: '#fff',
		},
		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#FFF',
				},
				primary: {
					main: '#AF53FF',
					light: '#AF53FF',
				},
				secondary: {
					main: '#fff',
					light: '#fff',
				},
				tertiary: {
					main: '#fff',
					light: '#fff',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#AF53FF',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#AF53FF',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgBelobank,
			smallColoredLogo: smallColoredLogoBelobank,
			smallWhiteLogo: smallWhiteLogoBelobank,
			backgroundLogo: backgroundLogoBelobank,
			tokenImageSvg: tokenImageBelobank,
			favicon: faviconBelobank,
		},
	},
	simerbank: {
		versao: '1.3.0',
		dataVersao: '27/04/23',
		AbaCartoes: false,
		AbaCredito: false,
		/* linkApp: "https://banking.integrapay.com.br", */
		name: 'Simerbank',
		description: 'Simerbank – Soluções em pagamento para o seu negócio',
		headerListaContas: 'FitBank',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'c3f470a2-6a73-42c1-a965-a8b01a80d10e',
			client_token: 'pub75e24d18da8901a529a9aaa42345a1ce',
		},

		mainCollors: {
			primary: '#205E6B',
			primaryVariant: '#205E6B',
			secondary: '#205E6B',
			backgrounds: '#F4F7F7',
			disabledTextfields: '#E0DFF8',
			extratoHome: '#302F60',
			primaryGradient:
				'linear-gradient(180deg, rgba(32, 94, 107,1) 15%, rgba(255, 102, 0,1) 100%)',
			secondaryGradient:
				'linear-gradient(0deg, rgba(32, 94, 107,1) 15%, rgba(255, 102, 0,1) 100%)',
			buttonGradient:
				'linear-gradient(90deg, rgba(32, 94, 107,1) 15%, rgba(255, 102, 0,1) 100%)',
			buttonGradientVariant:
				'linear-gradient(270deg, rgba(32, 94, 107,1) 15%, rgba(255, 102, 0,1) 100%)',
			drawerSideBar: '#205e6b',
			forgotPasswordLogin: '#fff',
		},
		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#FFF',
				},
				primary: {
					main: '#205E6B',
					light: '#205E6B',
				},
				secondary: {
					main: '#fff',
					light: '#fff',
				},
				tertiary: {
					main: '#fff',
					light: '#fff',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#205E6B',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#205E6B',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgSimer,
			smallColoredLogo: smallColoredLogoSimer,
			smallWhiteLogo: smallWhiteLogoSimer,
			backgroundLogo: '',
			tokenImageSvg: tokenImageSimer,
			favicon: faviconSimer,
		},
	},
	pomelo: {
		versao: '1.30.0',
		dataVersao: '25/08/23',
		AbaCartoes: false,
		AbaCredito: true,
		/* linkApp: "https://banking.integrapay.com.br", */
		linkDePagamento: 'https://banco.aciumbnk.com.br',
		name: 'POMELO - Dashboard do Banco POMELO',
		description: 'POMELO – Soluções em pagamento para o seu negócio',
		headerListaContas: 'Pomelo',
		crispId: '6501131f-ae92-4c67-8f05-01e1d5ff2784',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'c3f470a2-6a73-42c1-a965-a8b01a80d10e',
			client_token: 'pub75e24d18da8901a529a9aaa42345a1ce',
		},

		mainCollors: {
			primary: '#B91649',
			primaryVariant: '#198B8F',
			secondary: '#B91649',
			backgrounds: '#F2F2F2',
			disabledTextfields: '#E9E9E9',
			extratoHome: '#B91649',
			primaryGradient: 'linear-gradient(135deg, #CC1954 15%, #B91649 100%)',
			secondaryGradient: 'linear-gradient(360deg, #CC1954 0%, #B91649 100%)',
			buttonGradient: 'linear-gradient(135deg, #CC1954 10%, #B91649 100%)',
			buttonGradientVariant:
				'linear-gradient(180deg, #CC1954 15%, #B91649 100%)',
			drawerSideBar: '#B91649',
			forgotPasswordLogin: '#fff',
		},
		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#fff',
				},
				primary: {
					main: '#B91649',
					light: '#B91649',
				},
				secondary: {
					main: '#B91649',
					light: '#F4F4F4',
				},
				tertiary: {
					main: '#B91649',
					light: '#B91649',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#B91649',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#B91649',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgPomelo,
			smallColoredLogo: smallColoredLogoPomelo,
			smallWhiteLogo: loginSvgPomelo,
			backgroundLogo: backgroundLogoPomelo,
			tokenImageSvg: tokenImagePomelo,
			favicon: faviconPomelo,
		},
	},
	xbank: {
		versao: '1.2.0',
		dataVersao: '22/12/23',
		AbaCartoes: false,
		AbaCredito: true,
		/* linkApp: "https://banking.integrapay.com.br", */
		linkDePagamento: 'https://banco.xbank.integrapay.com.br',
		name: 'xBank - Dashboard do Banco xBank',
		description: 'xBank – Soluções em pagamento para o seu negócio',
		headerListaContas: 'AARIN',
		crispId: '6501131f-ae92-4c67-8f05-01e1d5ff2784',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'c3f470a2-6a73-42c1-a965-a8b01a80d10e',
			client_token: 'pub75e24d18da8901a529a9aaa42345a1ce',
		},

		mainCollors: {
			primary: '#0A43AD',
			primaryVariant: '#30DDFF',
			secondary: '#000',
			backgrounds: '#ECEBE9',
			disabledTextfields: '#E9E9E9',
			extratoHome: '#0A43AD',
			primaryGradient: 'linear-gradient(135deg, #20A4F4 15%, #0368DB 100%)',
			secondaryGradient: 'linear-gradient(360deg, #20A4F4 0%, #0368DB 100%)',
			buttonGradient: 'linear-gradient(135deg, #B3F402 10%, #B3F402 100%)',
			buttonGradientVariant:
				'linear-gradient(180deg, #B3F402 15%, #B3F402 100%)',
			drawerSideBar: '#B3F402',
			forgotPasswordLogin: '#fff',
		},
		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#fff',
				},
				primary: {
					main: '#0A43AD',
					light: '#0A43AD',
				},
				secondary: {
					main: '#0A43AD',
					light: '#F4F4F4',
				},
				tertiary: {
					main: '#0A43AD',
					light: '#0A43AD',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#15191E',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#15191E',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgXbank,
			smallColoredLogo: smallColoredLogoXbank,
			smallWhiteLogo: loginSvgXbank,
			backgroundLogo: backgroundLogoXbank,
			tokenImageSvg: tokenImageXbank,
			favicon: faviconXbank,
		},
	},
	bankzz: {
		versao: '1.2.0',
		dataVersao: '22/10/24',
		AbaCartoes: false,
		AbaCredito: true,
		/* linkApp: "https://banking.integrapay.com.br", */
		linkDePagamento: 'https://banco.xbank.integrapay.com.br',
		name: 'Bankzz - Dashboard do Banco xBank',
		description: 'Bankzz – Soluções em pagamento para o seu negócio',
		headerListaContas: 'QiTech',
		crispId: '6501131f-ae92-4c67-8f05-01e1d5ff2784',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'c3f470a2-6a73-42c1-a965-a8b01a80d10e',
			client_token: 'pub75e24d18da8901a529a9aaa42345a1ce',
		},

		mainCollors: {
			primary: '#153B50',
			primaryVariant: '#DEC593',
			secondadry: '#DEC593',
			backgrounds: '#F3F5F6',
			disabledTextfields: '#E9E9E9',
			extratoHome: '#153B50',
			primaryGradient: 'linear-gradient(135deg, #153B50 15%, #153B50 100%)',
			secondaryGradient: 'linear-gradient(360deg, #153B50 0%, #153B50 100%)',
			buttonGradient: 'linear-gradient(135deg, #153B50 10%, #153B50 100%)',
			buttonGradientVariant:
				'linear-gradient(180deg, #153B50 15%, #112332 100%)',
			drawerSideBar: '#153B50',
			forgotPasswordLogin: '#fff',
		},

		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#fff',
				},
				primary: {
					main: '#153B50',
					light: '#153B50',
				},
				secondary: {
					main: '#153B50',
					light: '#F4F4F4',
				},
				tertiary: {
					main: '#153B50',
					light: '#153B50',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#15191E',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#15191E',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgBankzz,
			smallColoredLogo: backgroundLogoBankzz,
			smallWhiteLogo: loginSvgBankzz,
			backgroundLogo: backgroundLoginBankzz,
			tokenImageSvg: tokenImageBankzz,
			favicon: faviconBankzz,
		},
	},
	concorrencia: {
		versao: '1.1.0',
		dataVersao: '15/01/24',
		AbaCartoes: false,
		AbaCredito: true,
		/* linkApp: "https://banking.integrapay.com.br", */   
		linkDePagamento: 'https://banco.xbank.integrapay.com.br', 
		name: 'Concorrencia - Dashboard do Banco Concorrencia',
		description: 'Bankzz – Soluções em pagamento para o seu negócio',
		headerListaContas: 'QItech',
		crispId: '6501131f-ae92-4c67-8f05-01e1d5ff2784',
		/* mailSupport: 'contato@integrapay.com.br', */

		datadog: {
			application_id: 'c3f470a2-6a73-42c1-a965-a8b01a80d10e',
			client_token: 'pub75e24d18da8901a529a9aaa42345a1ce',
		},

		mainCollors: {
			primary: '#4FB645',
			primaryVariant: '#296423',
			secondadry: '#296423',
			backgrounds: '#F3F3F3',
			disabledTextfields: '#E9E9E9',
			extratoHome: '#4FB645',
			primaryGradient: 'linear-gradient(135deg, #E0E0E0 15%, #E0E0E0 100%)',
			secondaryGradient: 'linear-gradient(360deg, #E0E0E0 0%, #E0E0E0 100%)',
			buttonGradient: 'linear-gradient(135deg, #4FB645 10%, #296423 100%)',
			buttonGradientVariant:
				'linear-gradient(180deg, #057472 15%, #4FB645 100%)',
			drawerSideBar: '#4FB645',
			forgotPasswordLogin: '#fff',
		},

		theme: {
			typography: {
				fontFamily: 'Montserrat-Regular',
			},
			palette: {
				background: {
					default: '#fff',
					paper: '#fff',
				},
				primary: {
					main: '#153B50',
					light: '#153B50',
				},
				secondary: {
					main: '#153B50',
					light: '#F4F4F4',
				},
				tertiary: {
					main: '#153B50',
					light: '#153B50',
				},
			},
			overrides: {
				MuiOutlinedInput: {
					root: {
						height: '45px',
						borderColor: 'white',
						borderRadius: 27,
						'&$cssFocused $notchedOutline': {
							borderWidth: 1,
						},
						'&:not($error) $notchedOutline': {
							borderColor: 'white',

							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								borderColor: 'rgba(0, 0, 0, 0.23)',
							},
						},

						borderWidth: '1px',
						'& :-webkit-autofill': {
							'-webkit-padding-after': '15px',
							'-webkit-padding-before': '18px',
							'-webkit-padding-end': '15px',
							'-webkit-padding-start': '15px',
							'-webkit-background-clip': 'text',
							'-webkit-color': 'white',

							'-webkit-text-fill-color': 'white !important',
						},

						'& $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&:hover $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
						'&$focused $notchedOutline': {
							borderColor: 'white',
							borderWidth: 1,
						},
					},
					focused: {
						borderWidth: '1px',
					},
					notchedOutline: {
						borderWidth: '1px',
					},
					input: {
						'&::placeholder': {
							textOverflow: 'ellipsis !important',
							color: '#15191E',
							fontWeight: '100',
							fontSize: '14px',
						},

						borderRadius: '27px',
						height: '10px',
					},
				},

				MuiTextField: {
					root: {
						margin: '10px 0px 0px 0px',
					},
				},
				MuiInputLabel: {
					outlined: {
						transform: 'translate(14px, 15px) scale(1)',
						'&$shrink': {
							transform: 'translate(14px, -20px) scale(0.8)',
							color: '#15191E',
							fontFamily: 'Montserrat-SemiBold',
						},
					},
				},
				MuiButton: {
					contained: {
						fontFamily: 'Montserrat-SemiBold',
						fontSize: '0.8rem',
					},
				},
			},
		},

		cssVariables: {
			gradient: {
				main: 'linear-gradient(to right top, #cc9b00, #cc9b00);',
			},
		},
		assets: {
			loginSvg: loginSvgConcorrenciaPJ,
			smallColoredLogo: loginSvgConcorrenciaPJ,
			smallWhiteLogo: backgroundLogoConcorrencia,
			backgroundLogo: loginSvgConcorrenciaPJ,
			tokenImageSvg: tokenImageConcorrencia,
			favicon: faviconConcorrencia,
		},
	},
}[process.env.REACT_APP_FRONT_APP || 'vbank'];
