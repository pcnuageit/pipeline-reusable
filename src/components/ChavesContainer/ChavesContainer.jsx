import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  makeStyles,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import KeyIcon from "@mui/icons-material/Key";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import ReactInputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  delChaveAction,
  getChavesPixAction,
  getReenviarCodigoAction,
  loadUserData,
  postConfirmarPropriedadeAction,
  postCriarChaveAction,
  postReivindicarPropriedadeAction,
  postReivindicaçãoPortabilidadeAction,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import CustomButton from "../CustomButton/CustomButton";
import CustomCollapseTablePix from "../CustomCollapseTablePix/CustomCollapseTablePix";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const useStyles = makeStyles((theme) => ({}));

const ChavesContainer = ({ title, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const chavesPix = useSelector((state) => state.chavesPix);
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [isModalCriarChaveOpen, setIsModalCriarChaveOpen] = useState(false);
  const [errors, setErrors] = useState("");
  const [isTextfieldDisabled, setIsTextfieldDisabled] = useState(false);
  const [criarChave, setCriarChave] = useState({
    tipo: "",
    chave: "",
  });

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  moment.locale();

  useEffect(() => {
    dispatch(getChavesPixAction(token, "", "", "", "", ""));
  }, [token]);

  useEffect(() => {
    if (userData) {
      if (criarChave.tipo === 1) {
        setCriarChave({ ...criarChave, chave: userData.cnpj });
        setIsTextfieldDisabled(true);
      }
      if (criarChave.tipo === 2) {
        setCriarChave({ ...criarChave, chave: userData.email });
        setIsTextfieldDisabled(false);
      }
      if (criarChave.tipo === 3) {
        setCriarChave({ ...criarChave, chave: userData.celular });
        setIsTextfieldDisabled(false);
      }
    }
  }, [criarChave.tipo]);

  const columns = [
    {
      headerText: "Tipo",
      key: "tipo",
    },
    {
      headerText: "",
      key: "",
      CustomValue: () => {
        return (
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              height: "50px",
              width: "50px",

              borderRadius: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <KeyIcon style={{ color: "white", fontSize: "30px" }} />
          </Box>
        );
      },
    },
    {
      headerText: "Chave",
      key: "chave",
      CustomValue: (chave) => {
        return (
          <Typography
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: "15px",
              color: APP_CONFIG.mainCollors.primary,
              lineBreak: "anywhere",
            }}
          >
            {chave}
          </Typography>
        );
      },
    },
    {
      headerText: "Status",
      key: "status",
    },
    {
      headerText: "",
      key: "menu",
    },
  ];

  const itemColumns = [];
  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [
      isModalConfirmarPropriedadeOpen,
      setIsModalConfirmarPropriedadeOpen,
    ] = useState(false);
    const [codigoConfirmarPropriedade, setCodigoConfirmarPropriedade] =
      useState("");

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleExcluirChave = async (row) => {
      setLoading(true);
      const resExcluirChave = await dispatch(delChaveAction(token, row.row.id));
      if (resExcluirChave) {
        toast.error("Erro ao excluir chave");
        setLoading(false);
      } else {
        toast.success("Chave excluída");
        dispatch(getChavesPixAction(token, "", "", "", "", ""));
        setLoading(false);
      }
    };

    const handleConfirmarPropriedade = async (row) => {
      const resConfirmarPropriedade = await dispatch(
        postConfirmarPropriedadeAction(
          token,
          row.row.id,
          codigoConfirmarPropriedade,
        ),
      );
      if (resConfirmarPropriedade) {
        toast.error("Erro ao confirmar propriedade");
      } else {
        toast.success("Propriedade da chave confirmada com sucesso");
        dispatch(getChavesPixAction(token, "", "", "", "", ""));
      }
    };

    const handleReivindicarPropriedade = async (row) => {
      const resReividicarPropriedade = await dispatch(
        postReivindicarPropriedadeAction(token, row.row.id),
      );
      if (resReividicarPropriedade) {
        toast.error("Erro ao reivindicar propriedade");
      } else {
        toast.success("Chave reivindicada com sucesso");
        dispatch(getChavesPixAction(token, "", "", "", "", ""));
      }
    };

    const handleReivindicaçãoPortabilidade = async (row, confirmar) => {
      const resReivindicaçãoPortabilidade = await dispatch(
        postReivindicaçãoPortabilidadeAction(token, confirmar, row.row.id),
      );
      if (resReivindicaçãoPortabilidade) {
        if (confirmar === 0) {
          toast.error("Erro ao não confirmar reivindicação/portabilidade");
        }
        if (confirmar === 1) {
          toast.error("Erro ao confirmar reivindicação/portabilidade");
        }
      } else {
        if (confirmar === 0) {
          toast.warning("Reivindicação/Portabilidade da chave cancelada");
        }
        if (confirmar === 1) {
          toast.success("Reivindicação/Portabilidade da chave concluída!");
        }

        dispatch(getChavesPixAction(token, "", "", "", "", ""));
      }
    };

    const handleReenviarCodigo = async (row) => {
      const resReenviarCodigo = await dispatch(
        getReenviarCodigoAction(token, row.row.id),
      );
      if (resReenviarCodigo) {
        toast.error("Falha ao reenviar código");
      } else {
        toast.success("Código reenviado");
      }
    };
    return (
      <>
        <LoadingScreen isLoading={loading} />
        <Box
          onClick={handleClick}
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            height: "50px",
            width: "50px",
            cursor: "pointer",
            borderRadius: "32px",
            alignItems: "center",
            justifyContent: "center",

            "&:hover": {
              cursor: "pointer",
              backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
            },
          }}
        >
          <SettingsIcon
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontSize: "30px",
              "&:hover": {
                backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
              },
            }}
          />
        </Box>
        <Menu
          onClick={() => {}}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {row.row.status === "Aguardando" ? (
            <MenuItem
              style={{
                color: APP_CONFIG.mainCollors.secondary,
                fontFamily: "Montserrat-Regular",
              }}
              onClick={() => setIsModalConfirmarPropriedadeOpen(true)}
            >
              Confirmar propriedade
            </MenuItem>
          ) : null}

          {row.row.status === "Reivindicação" ? (
            <MenuItem
              style={{
                color: "#90BAA3",
                fontFamily: "Montserrat-Regular",
              }}
              onClick={() => handleReivindicarPropriedade(row)}
            >
              Confirmar reinvindicação
            </MenuItem>
          ) : null}

          {row.row.status === "Confirmar Reivindicação/Portabiliade" ? (
            <>
              <MenuItem
                style={{
                  color: "#90BAA3",
                  fontFamily: "Montserrat-Regular",
                }}
                onClick={() => handleReivindicaçãoPortabilidade(row, 1)}
              >
                Confirmar Reivindicação/Portabilidade
              </MenuItem>
              <MenuItem
                style={{
                  color: "#90BAA3",
                  fontFamily: "Montserrat-Regular",
                }}
                onClick={() => handleReivindicaçãoPortabilidade(row, 0)}
              >
                Não Confirmar Reivindicação/Portabilidade
              </MenuItem>
            </>
          ) : null}

          <MenuItem
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
            onClick={() => handleExcluirChave(row)}
          >
            Excluir
          </MenuItem>
        </Menu>
        <Dialog
          open={isModalConfirmarPropriedadeOpen}
          onBackdropClick={() => setIsModalConfirmarPropriedadeOpen(false)}
        >
          <Box width="500px" padding="20px">
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
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: "16px",
                  color: APP_CONFIG.mainCollors.primary,
                  fontWeight: "bold",
                }}
              >
                Preencha o campo com o token enviado no seu E-mail ou Celular.
              </Typography>

              <ReactCodeInput
                value={codigoConfirmarPropriedade}
                onChange={(e) => setCodigoConfirmarPropriedade(e)}
                type="number"
                fields={6}
                inputStyle={{
                  fontFamily: "monospace",
                  margin: "4px",
                  marginTop: "30px",
                  MozAppearance: "textfield",
                  width: "30px",
                  borderRadius: "28px",
                  fontSize: "20px",
                  height: "50px",
                  paddingLeft: "7px",

                  color: APP_CONFIG.mainCollors.primary,
                  border: `1px solid ${APP_CONFIG.mainCollors.primary}`,
                }}
              />
              {errors.token ? (
                <FormHelperText
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    fontFamily: "Montserrat-ExtraBold",
                    color: "red",
                  }}
                >
                  {errors.token.join(" ")}
                </FormHelperText>
              ) : null}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "30px",
                }}
              >
                <LoadingScreen isLoading={loading} />
                <Box
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box style={{ marginTop: "10px" }}>
                    <CustomButton
                      variant="contained"
                      color="purple"
                      onClick={() => handleReenviarCodigo(row)}
                    >
                      <Typography
                        style={{
                          fontFamily: "Montserrat-Regular",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        Reenviar Código
                      </Typography>
                    </CustomButton>
                  </Box>
                  <Box style={{ marginTop: "10px" }}>
                    <CustomButton
                      variant="contained"
                      color="purple"
                      onClick={() => handleConfirmarPropriedade(row)}
                    >
                      <Typography
                        style={{
                          fontFamily: "Montserrat-Regular",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        Enviar
                      </Typography>
                    </CustomButton>
                  </Box>
                </Box>
              </Box>
              <Box style={{ alignSelf: "center", marginTop: "50px" }}>
                <img
                  src={APP_CONFIG.assets.tokenImageSvg}
                  style={{ width: "80%" }}
                />
              </Box>
            </Box>
          </Box>
        </Dialog>
      </>
    );
  };

  const handleCriarChave = async () => {
    setLoading(true);
    const formatedData =
      criarChave.tipo === 4 ? { tipo: criarChave.tipo } : criarChave;
    const resCriarChave = await dispatch(
      postCriarChaveAction(token, formatedData),
    );
    if (resCriarChave) {
      setErrors(resCriarChave);
      toast.error("Erro ao criar chave");
      setLoading(false);
    } else {
      toast.success("Chave criada com sucesso");
      dispatch(getChavesPixAction(token, "", "", "", "", ""));
      setIsModalCriarChaveOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        Chaves
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Box
          style={{
            width: "90%",
            height: "1px",
            backgroundColor: APP_CONFIG.mainCollors.primary,
          }}
        />

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          <CustomButton
            color="purple"
            onClick={() => setIsModalCriarChaveOpen(true)}
          >
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: "white",
              }}
            >
              Criar Chave
            </Typography>
          </CustomButton>
        </Box>
        <Box
          style={{
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          {chavesPix && chavesPix.length > 0 ? (
            <CustomCollapseTablePix
              noCollapse
              itemColumns={itemColumns}
              data={chavesPix}
              columns={columns}
              Editar={Editar}
            />
          ) : (
            <LinearProgress />
          )}
        </Box>
      </Box>
      <Dialog
        open={isModalCriarChaveOpen}
        onBackdropClick={() => setIsModalCriarChaveOpen(false)}
      >
        <Box width="500px" padding="20px">
          <DialogTitle>
            <Typography
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontSize: "20px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Selecione o tipo da sua chave:
            </Typography>
          </DialogTitle>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={criarChave.tipo}
              label="Tipo"
              onChange={(e) =>
                setCriarChave({ ...criarChave, tipo: e.target.value })
              }
            >
              {/* <MenuItem
								value={0}
								style={{
									color: APP_CONFIG.mainCollors.secondary,
									fontFamily: 'Montserrat-Regular',
								}}
							>
								CPF
							</MenuItem> */}
              <MenuItem
                value={1}
                style={{
                  color: APP_CONFIG.mainCollors.secondary,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                CNPJ
              </MenuItem>
              <MenuItem
                value={2}
                style={{
                  color: APP_CONFIG.mainCollors.secondary,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                Email
              </MenuItem>
              <MenuItem
                value={3}
                style={{
                  color: APP_CONFIG.mainCollors.secondary,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                Telefone
              </MenuItem>
              <MenuItem
                value={4}
                style={{
                  color: APP_CONFIG.mainCollors.secondary,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                Chave Aleatória
              </MenuItem>
            </Select>
          </FormControl>
          <Box style={{ marginTop: "20px" }}>
            {
              /* criarChave.tipo === 0 ? (
							<ReactInputMask
								mask="999.999.999-99"
								value={criarChave.chave}
								onChange={(e) =>
									setCriarChave({
										...criarChave,
										chave: e.target.value,
									})
								}
							>
								{() => (
									<TextField
										error={errors.chave}
										helperText={
											errors.chave ? errors.chave.join(' ') : null
										}
										fullWidth
										variant="standard"
										label="Digite seu CPF"
									/>
								)}
							</ReactInputMask>
						) :  */ criarChave.tipo === 1 ? (
                <ReactInputMask
                  disabled={isTextfieldDisabled}
                  mask="99.999.999/9999-99"
                  value={criarChave.chave}
                  onChange={(e) =>
                    setCriarChave({
                      ...criarChave,
                      chave: e.target.value,
                    })
                  }
                >
                  {() => (
                    <TextField
                      disabled={isTextfieldDisabled}
                      error={errors.chave}
                      helperText={errors.chave ? errors.chave.join(" ") : null}
                      fullWidth
                      variant="standard"
                      label="Digite seu CNPJ"
                    />
                  )}
                </ReactInputMask>
              ) : criarChave.tipo === 2 ? (
                <TextField
                  fullWidth
                  variant="standard"
                  label="Digite seu E-mail"
                  value={criarChave.chave}
                  error={errors.chave}
                  helperText={errors.chave ? errors.chave.join(" ") : null}
                  onChange={(e) =>
                    setCriarChave({
                      ...criarChave,
                      chave: e.target.value,
                    })
                  }
                />
              ) : criarChave.tipo === 3 ? (
                <ReactInputMask
                  mask="+55 (99) 99999-9999"
                  value={criarChave.chave}
                  onChange={(e) =>
                    setCriarChave({
                      ...criarChave,
                      chave: e.target.value,
                    })
                  }
                >
                  {() => (
                    <TextField
                      error={errors.chave}
                      helperText={errors.chave ? errors.chave.join(" ") : null}
                      fullWidth
                      variant="standard"
                      label="Digite seu Telefone"
                    />
                  )}
                </ReactInputMask>
              ) : null
            }
          </Box>
          {criarChave.tipo > -1 ? (
            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                justifyContent: "center",
                marginTop: "30px",
              }}
            >
              <CustomButton color="purple" onClick={handleCriarChave}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Criar
                </Typography>
              </CustomButton>
            </Box>
          ) : null}
          <Box
            display="flex"
            justifyContent="space-around"
            marginTop="20px"
          ></Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ChavesContainer;
