import { Box, Grid, TextField, Typography, useTheme } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";

import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomFilterButton from "../../components/CustomFilterButton/CustomFilterButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomRoundedCard from "../../components/CustomRoundedCard/CustomRoundedCard";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dadosBox: {
    display: "flex",
    flexDirection: "row",

    marginTop: "100px",
    marginLeft: "30px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
}));
export default function ListaDeAdministradores() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector((state) => state.userData);
  const extrato = useSelector((state) => state.extrato);
  const token = useAuth();
  const [loading, setLoading] = useState(false);

  const columns = [
    { headerText: "Valor", key: "valor" },
    { headerText: "Nome", key: "nome" },
    { headerText: "Idade", key: "idade" },
  ];

  const itemColumns = [
    { headerText: "Valor", key: "valor" },
    { headerText: "Nome", key: "nome" },
    { headerText: "Idade", key: "idade" },
  ];

  const testeData = [{ valor: "teste", nome: "jose", idade: "32" }];

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container spacing={2} style={{ marginTop: "0px" }}>
              <Grid item sm={8} xs={12}>
                <Box
                  style={{
                    display: "flex",
                    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                    /* height: '100px', */
                    borderRadius: "17px",
                    flexDirection: "column",

                    /* alignItems: 'center', */
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      fontSize: "16px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "30px",
                      marginLeft: "40px",
                    }}
                  >
                    Extrato pix
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
                    {/* <CustomCollapseTable
										data={testeData}
										columns={columns}
										itemColumns={itemColumns}
									/> */}
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "10px",
                        alignItems: "center",
                      }}
                    >
                      <CustomFilterButton title="Lorem ipsum" />
                      <CustomFilterButton title="Lorem ipsum" />
                      <CustomFilterButton title="Lorem ipsum" />
                      <CustomFilterButton title="Lorem ipsum" />
                      <TextField
                        variant="outlined"
                        label=""
                        InputProps={{
                          endAdornment: (
                            <SearchIcon
                              style={{
                                fontSize: "25px",
                                color: APP_CONFIG.mainCollors.primary,
                              }}
                            />
                          ),
                        }}
                      />
                    </Box>
                    <Box
                      style={{
                        marginTop: "30px",
                        marginBottom: "30px",
                      }}
                    >
                      <CustomButton color="purple">
                        <Typography
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: "16px",
                            color: "white",
                          }}
                        >
                          Retirada
                        </Typography>
                      </CustomButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Box
                  style={{
                    display: "flex",
                    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                    /* height: '100px', */
                    borderRadius: "17px",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      fontSize: "16px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "30px",
                      marginLeft: "40px",
                    }}
                  >
                    Área pix
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
                        flexDirection: "column",
                        width: "60%",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          marginTop: "10px",
                        }}
                      >
                        <CustomRoundedCard title="Receber" icon="receber" />
                        <CustomRoundedCard title="Pagar" icon="pagar" />
                        <CustomRoundedCard title="Chaves" icon="chaves" />
                      </Box>
                      <Box
                        style={{
                          display: "flex",

                          justifyContent: "space-around",
                          marginTop: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        <CustomRoundedCard
                          title="Aprovações"
                          icon="aprovacoes"
                        />
                        <CustomRoundedCard title="Extrato" icon="extrato" />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
