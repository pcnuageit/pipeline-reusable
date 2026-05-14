/* import '../../../fonts/humanist-777-bt.ttf';
import '../../../fonts/microgramma-d-bold-extended.otf';
import '../../../fonts/humanist-777-bold-bt.ttf';
 */
import { Box, Grid, Typography } from "@material-ui/core";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import CustomButton from "../../components/CustomButton/CustomButton";

//import { loadAuth } from '../../actions/actions';
import { postAcessarWebAction } from "../../actions/actions";

import { makeStyles } from "@material-ui/styles";
import DownloadIcon from "@mui/icons-material/Download";
import LockIcon from "@mui/icons-material/Lock";
import SettingsRemoteIcon from "@mui/icons-material/SettingsRemote";
import WidgetsIcon from "@mui/icons-material/Widgets";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../constants/config";
import { getAcessoWeb } from "../../services/services";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",

    [theme.breakpoints.down("1024")]: {
      flexDirection: "column",
    },
  },

  leftBoxStyle1: {
    display: "flex",
    background: APP_CONFIG.mainCollors.primaryGradient,
    width: "50%",
    minHeight: "100vh",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("1024")]: {
      width: "100%",
      minHeight: "0px",
      height: "100%",
    },
  },
  leftBoxStyle2: {
    display: "flex",

    background: APP_CONFIG.mainCollors.primaryGradient,
    width: "50%",
    minHeight: "100vh",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("1024")]: {
      width: "100%",
      minHeight: "0px",
      height: "100%",
    },
  },
  rightBox: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    width: "50%",

    [theme.breakpoints.down("1024")]: {
      width: "100%",
    },
  },

  smallLogoContainer: {
    display: "flex",
    alignSelf: "flex-end",
    width: "100px",
    height: "100px",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "3px",
    alignItems: "center",
    marginTop: "80px",
    [theme.breakpoints.down("1024")]: {
      marginTop: "80px",
    },
  },
  QrCodeContainer: {
    marginBottom: "35px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "100px",
  },

  stepsContainer: {
    marginTop: "60px",
    flexDirection: "column",
    display: "flex",
  },
  stepContainer: {
    marginTop: "10px",
    flexDirection: "row",
    display: "flex",
    alignSelf: "flex-start",
  },
  appBarContainer: {
    width: "100%",
    height: "80px",
    backgroundColor: "white",
    zIndex: 2,
  },
  contentContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  backgroundImage1: {
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "10%",
  },
  formContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    zIndex: 2,
  },
  backgroundImage2: {
    height: "100%",
    width: "10%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  cadastrarButton: {
    color: "black",
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.05)",
    },
  },
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "40%",
    left: "43.1%",
    width: "260px",
    height: "200px",
    backgroundColor: "#F6F6FA",
    border: "0px solid #000",
    boxShadow: 24,
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const qrCodeValue = useSelector((state) => state.qrCodeValue);
  const [loginSteps, setLoginSteps] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleLogin = async (id) => {
    const resAcessarWeb = await getAcessoWeb(id);
    if (resAcessarWeb.data.token_jwt) {
      await localStorage.setItem(
        "@auth",
        JSON.stringify({
          access_token: resAcessarWeb.data.token_jwt,
          token_type: "bearer",
          expires_in: 3600,

          login_time: new Date().getTime(),
        }),
      );
      history.push("/dashboard/home");
      return;
    }

    setTimeout(() => {
      handleLogin(id);
    }, 5000);
  };

  const handleTimeout = () => {
    setTimeout(() => {
      setOpenModal(true);
    }, 120000);
  };

  const handleAcessarWeb = async () => {
    const id = await dispatch(postAcessarWebAction());
    if (id) {
      setLoginSteps(true);
      handleLogin(id);
      handleTimeout();
    } else {
      toast.error("Falha ao gerar QrCode");
    }
  };

  return (
    <Box className={classes.root}>
      {APP_CONFIG.titleLogin === "Bankzz" ? (
        <>
          <Box className={classes.leftBoxStyle2}>
            <img
              src={APP_CONFIG.assets.backgroundLogo}
              style={{ position: "fixed" }}
              alt="Logo"
            />
            <Box
              style={{
                alignSelf: "self-end",
                marginBottom: "60px",
                marginLeft: "200px",
              }}
            >
              <img src={APP_CONFIG.assets.loginSvg} style={{}} Alt="" />
            </Box>
          </Box>
        </>
      ) : (
        <Box className={classes.leftBoxStyle1}>
          <img
            src={APP_CONFIG.assets.loginSvg}
            style={{ width: "70%" }}
            alt=""
          />
        </Box>
      )}

      <Box className={classes.rightBox}>
        <Box
          className={classes.smallLogoContainer}
          style={{
            width:
              APP_CONFIG.titleLogin === "Acium BNK Empresas" ||
              APP_CONFIG.titleLogin === "xBank"
                ? "200px"
                : null,
            marginRight: "10px",
          }}
        >
          {APP_CONFIG.titleLogin === "xBank" ? null : (
            <>
              <img
                alt=""
                src={APP_CONFIG.assets.loginLogoDireita}
                style={{
                  marginTop: "0px",
                  marginRight: "0px",
                  ...(APP_CONFIG.titleLogin === "Bankzz"
                    ? { marginTop: "10px" }
                    : {}),
                  ...(APP_CONFIG.titleLogin === "Simer Bank"
                    ? { marginRight: "80px" }
                    : {}),
                  ...(APP_CONFIG.titleLogin === "Acium BNK Empresas"
                    ? { width: "200px" }
                    : {}),
                  ...(APP_CONFIG.name ===
                  "Dashboard da prefeitura de Corumbaíba"
                    ? {
                        width: "300px",
                        marginRight: "300px",
                        marginTop: "50px",
                      }
                    : {}),
                  ...(APP_CONFIG.name ===
                    "Dashboard da prefeitura de Firminópolis" ||
                  APP_CONFIG.name === "Dashboard da Secretaria Goiânia"
                    ? {
                        width: "300px",
                        marginRight: "300px",
                        marginTop: "50px",
                      }
                    : {}),
                  ...(APP_CONFIG.name ===
                    "Dashboard da prefeitura de Itapuranga" ||
                  APP_CONFIG.name === "Dashboard da prefeitura de Itumbiara"
                    ? {
                        width: "250px",
                        marginRight: "250px",
                        marginTop: "100px",
                      }
                    : {}),
                  ...(APP_CONFIG.name ===
                    "Dashboard da prefeitura de Itaberaí" ||
                  APP_CONFIG.name ===
                    "Dashboard da Secretaria de Estado da Educação – SEDUC" ||
                  APP_CONFIG.name ===
                    "Dashboard da Secretaria de Estado da Retomada" ||
                  APP_CONFIG.name ===
                    "Dashboard da Secretaria de Estado de Desenvolvimento Social – SEDS" ||
                  APP_CONFIG.name ===
                    "Dashboard da Agência Goiana de Habitação - Agehab" ||
                  APP_CONFIG.name ===
                    "Dashboard da Secretaria Da Ciência, Tecnologia, Inovação E Educação Profissional - SECTI" ||
                  APP_CONFIG.name ===
                    "Dashboard da Secretaria de Estado de Agricultura, Pecuária e Abastecimento – SEAPA" ||
                  APP_CONFIG.name ===
                    "Desenvolve MT - Dashboard da Agência de Crédito do Empreendedor" ||
                  APP_CONFIG.name ===
                    "Desenvolve MT - Dashboard da Secretaria de Estado de Agricultura Familiar – SEAF"
                    ? {
                        width: "400px",
                        marginRight: "400px",
                        marginTop: "50px",
                      }
                    : {}),
                  ...(APP_CONFIG.name ===
                  "Dashboard da Polícia Militar do Estado de Goiás - PMGO"
                    ? {
                        width: "250px",
                        marginRight: "130px",
                        marginTop: "80px",
                      }
                    : {}),
                }}
              />
            </>
          )}
        </Box>

        {loginSteps ? (
          <Box className={classes.QrCodeContainer}>
            <Typography
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontSize: "26px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Faça o login com o QR code
            </Typography>
            <Box className={classes.stepsContainer}>
              <Box className={classes.stepContainer}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "19px",
                    color: APP_CONFIG.mainCollors.primary,
                    fontWeight: "bold",
                  }}
                >
                  1
                </Typography>{" "}
                <Typography
                  style={{
                    fontSize: "19px",
                    color: APP_CONFIG.mainCollors.primary,

                    marginLeft: "10px",
                  }}
                >
                  Abra o app e autentique.
                </Typography>
              </Box>

              <Box className={classes.stepContainer}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "19px",
                    color: APP_CONFIG.mainCollors.primary,
                    fontWeight: "bold",
                  }}
                >
                  2
                </Typography>{" "}
                <Typography
                  style={{
                    fontSize: "19px",
                    color: APP_CONFIG.mainCollors.primary,

                    marginLeft: "10px",
                  }}
                >
                  Toque em QR code no final da tela.
                </Typography>
              </Box>
              <Box className={classes.stepContainer}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "19px",
                    color: APP_CONFIG.mainCollors.primary,
                    fontWeight: "bold",
                  }}
                >
                  3
                </Typography>{" "}
                <Typography
                  style={{
                    fontSize: "19px",
                    color: APP_CONFIG.mainCollors.primary,

                    marginLeft: "10px",
                  }}
                >
                  Aponte a câmera para o código abaixo.
                </Typography>
              </Box>
            </Box>
            <Box
              style={{
                alignSelf: "center",
                marginTop: "50px",
              }}
            >
              <QRCode value={qrCodeValue.otp} />
            </Box>
          </Box>
        ) : (
          <Box className={classes.titleContainer}>
            <Typography
              style={{
                fontSize: "26px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Seja bem vindo de volta :)
            </Typography>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <Grid
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "50px",
                }}
                container
              >
                <Grid item xs={6} sm={1}>
                  <WidgetsIcon
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                      fontSize: "40px",
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={5}>
                  <Typography
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Para acesso ao{" "}
                    {APP_CONFIG.isGestao || APP_CONFIG.isEstabelecimento
                      ? "Painel"
                      : "Internet Banking"}
                    , nunca será solicitado leitura de QR Code por outro
                    aplicativo que não seja o {APP_CONFIG.titleLogin}.
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
                container
              >
                <Grid item xs={6} sm={1}>
                  <DownloadIcon
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                      fontSize: "40px",
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={5}>
                  <Typography
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Nunca será solicitado a instalação de qualquer outro
                    aplicativo que não seja o {APP_CONFIG.titleLogin}.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
                container
              >
                <Grid item xs={6} sm={1}>
                  <LockIcon
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                      fontSize: "40px",
                    }}
                  />
                </Grid>

                <Grid item xs={6} sm={5}>
                  {APP_CONFIG.titleLogin === "xBank" ? (
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam eget ligula eu lectus lobortis condimentum.
                    </Typography>
                  ) : (
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      Nunca será solicitado envio de senha por SMS, e-mail,
                      whatsapp ou qualquer outra plataforma.
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
                container
              >
                <Grid item xs={6} sm={1}>
                  <SettingsRemoteIcon
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                      fontSize: "40px",
                    }}
                  />
                </Grid>

                <Grid item xs={6} sm={5}>
                  <Typography
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Não solicitamos nenhum tipo de instalação de aplicativo para
                    acesso remoto.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.titleContainer}>
              <CustomButton
                variant="contained"
                /* type="submit" */
                color="horizontalGradient"
                onClick={handleAcessarWeb}
              >
                <Typography
                  style={{
                    fontSize: "10px",
                    color: "white",
                  }}
                >
                  {APP_CONFIG.isGestao || APP_CONFIG.isEstabelecimento
                    ? "ACESSAR PAINEL"
                    : "ACESSAR MINHA CONTA DIGITAL PJ"}
                </Typography>
              </CustomButton>

              {/* <Box style={{ marginTop: "10px" }}></Box>
              {APP_CONFIG.isGestao ? null : (
                <CustomButton
                  variant="contained"
                  // type="submit"
                  color="purple"
                  component={Link}
                  to="/cadastro"
                >
                  <Typography
                    style={{
                      fontSize: "10px",
                      color: "white",
                    }}
                  >
                    CRIAR CONTA
                  </Typography>
                </CustomButton>
              )} */}

              <Link
                to={{ pathname: APP_CONFIG.linkPdfTermoContrato }}
                target="_blank"
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    color: APP_CONFIG.mainCollors.primary,
                    fontWeight: "bold",
                    marginTop: "30px",
                    marginBottom: "35px",
                  }}
                >
                  Leia a nossa política de privacidade.
                </Typography>
              </Link>
            </Box>
          </Box>
        )}
      </Box>

      <Modal open={openModal}>
        <Box className={classes.modal}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "30px",
            }}
          >
            <Typography
              style={{
                fontSize: "19px",
                color: APP_CONFIG.mainCollors.primary,

                marginLeft: "10px",
              }}
            >
              QrCode expirado.
            </Typography>
            <Typography
              style={{
                fontSize: "19px",
                color: APP_CONFIG.mainCollors.primary,

                marginLeft: "10px",
              }}
            >
              Volte para gerar um novo!
            </Typography>
            <Box style={{ marginTop: "30px" }}>
              <CustomButton
                color="purple"
                onClick={() => {
                  setLoginSteps(false);
                  setOpenModal(false);
                }}
              >
                <Typography
                  style={{
                    fontSize: "10px",
                    color: "white",
                  }}
                >
                  VOLTAR
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* <Box className={classes.root}>
			<Box className={classes.appBarContainer}>
				<img alt="Logo" src={loginHeaderLogo} style={{ width: '80px', padding: '10px 20%' }} />
			</Box>
			<Box className={classes.contentContainer}>
				<Box className={classes.backgroundImage1}>
					<img
						alt="Logo de fundo"
						src={backgroundLogoYellow}
						style={{
							width: '700px',
							position: 'absolute',
							bottom: '0',
							left: '-250px',
						}}
					/>
				</Box>
				<Box className={classes.formContainer}>
					<Box display="flex" flexDirection="column">
						<Typography variant="h1" style={{ fontSize: '48px', textAlign: 'center' }}>
							Bem vindo (a)!
						</Typography>

						<Typography variant="subtitle1" align="center" style={{ fontSize: '21px' }}>
							Digite seu e-mail e senha para ter acesso à plataforma
						</Typography>

						<form
							onSubmit={(e) => handleLogin(e)}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								marginTop: '120px',
								width: '350px',
								justifyContent: 'center',
								alignSelf: 'center',
							}}
						>
							<InputMask
								value={values.documento}
								onChange={(e) => setValues({ ...values, documento: e.target.value })}
								mask={'999.999.999-99'}
							>
								{() => (
									<CustomTextField
										fullWidth
										style={{ margin: '15px 0' }}
										placeholder="Documento"
										required
										error={errorLogin}
									/>
								)}
							</InputMask>

							<CustomTextField
								value={values.senha}
								onChange={(e) => setValues({ ...values, senha: e.target.value })}
								fullWidth
								placeholder="Senha"
								required
								error={errorLogin}
								type="password"
							/>
							<Box
								display="flex"
								flexDirection="column"
								justifyContent="center"
								alignItems="center"
								marginTop="8px"
							>
								<Typography
									component={Link}
									
									style={{ fontWeight: 'bold', color: theme.palette.primary.dark }}
								>
									Esqueceu sua senha?
								</Typography>

								<Box marginTop="40px">
									<CustomButton variant="contained" type="submit" color="black">
										ENTRAR
									</CustomButton>
								</Box>
							</Box>
						</form>
					</Box>
				</Box>
				<Box className={classes.backgroundImage2}>
					<img
						alt="Imagem de fundo"
						src={loginBackgroundWave}
						style={{ height: '450px', position: 'absolute', top: '10px' }}
					/>
				</Box>
			</Box>
		</Box> */}
    </Box>
  );
}
