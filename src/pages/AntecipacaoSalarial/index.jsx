import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Grid,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCard from "../../components/CustomCard/CustomCard";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import { PERMISSIONS } from "../../constants/permissions";
import usePermission from "../../hooks/usePermission";
import { useGetAntecipacoesSalariaisQuery } from "../../modules/AntecipacaoSalarial/services/AntecipacaoSalarial";
import { formatMoney } from "../../modules/AntecipacaoSalarial/utils/money";
import { useGetAntecipacaoSalarialProposalQuery } from "../../modules/AntecipacaoSalarialProposal/services/AntecipacaoSalarialProposal";
import CustomBarChart from "./components/CustomBarChart/CustomBarChart";
import CustomLineChart from "./components/CustomLineChart/CustomLineChart";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  headerContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "24px",
    fontFamily: "Montserrat-SemiBold",
  },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
    fontSize: 32,
  },
  sectionTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
  },
  card: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    padding: 24,
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    borderRadius: 16,
    marginTop: "20px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    marginTop: "20px",
  },
}));

function AntecipacaoSalarial() {
  const classes = useStyles();
  const id = useParams()?.id ?? "";
  const { data: proposal, isLoading } = useGetAntecipacaoSalarialProposalQuery(
    id,
    {
      skip: !id,
    }
  );
  const { data: financialSupports } = useGetAntecipacoesSalariaisQuery({
    proposalId: id,
    status: "atrasado",
    per_page: 10,
  });

  const canManageFinancialSupport = usePermission([
    PERMISSIONS.MANAGE_FINANCIAL_SUPPORT,
    PERMISSIONS.FULL_ACCESS,
  ]);

  const linkToSupportList = (status) => {
    return canManageFinancialSupport
      ? `/dashboard/antecipacao-salarial/${id}/listagem?status=${status}`
      : "#";
  };

  return (
    !isLoading &&
    proposal && (
      <Box className={classes.root}>
        <Box display="flex" size="small" justifyContent="space-between">
          <Typography className={classes.pageTitle}>{proposal.nome}</Typography>
          {canManageFinancialSupport && (
            <Link to={linkToSupportList("")}>
              <CustomButton size="small" color="purple">
                Gerênciar Antecipações
              </CustomButton>
            </Link>
          )}
        </Box>
        <Box className={classes.headerContainer}>
          <Box className={classes.card}>
            <Box>
              <Typography className={classes.sectionTitle}>
                Detalhes da Proposta
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex">
                  <TextField
                    fullWidth
                    label="ID da Proposta de Antecipação Salarial"
                    value={proposal?.id}
                    disabled
                  />
                  <Box display="flex" marginTop="24px">
                    <Tooltip title="Copiar">
                      <CopyToClipboard text={proposal?.id}>
                        <Button
                          aria="Copiar"
                          style={{
                            marginLeft: "6px",
                            width: "60px",
                            height: "20px",
                            alignSelf: "center",
                            color: "green",
                          }}
                          onClick={() =>
                            toast.success(
                              "Copiado para area de transferência",
                              {
                                autoClose: 2000,
                              }
                            )
                          }
                        >
                          <FontAwesomeIcon
                            style={{
                              width: "60px",
                              height: "20px",
                            }}
                            icon={faCopy}
                          />
                        </Button>
                      </CopyToClipboard>
                    </Tooltip>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome da proposta"
                  value={proposal?.nome}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Valor liberado"
                  value={formatMoney(proposal?.valor_liberado)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Valor inicial"
                  value={formatMoney(proposal?.valor_inicial)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Valor final"
                  value={formatMoney(proposal?.valor_final)}
                  disabled
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  label="Contas Liberadas"
                  value={proposal?.qty_contas_liberadas}
                  disabled
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  label="Contas PJ Liberadas"
                  value={proposal?.qty_contas_liberadas_pj}
                  disabled
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextField
                  fullWidth
                  label="Contas PF Liberadas"
                  value={proposal?.qty_contas_liberadas_pf}
                  disabled
                />
              </Grid>
            </Grid>
            <Box marginTop={2}>
              <Typography className={classes.sectionTitle}>
                Status da Conta Bolsão
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Montante disponível"
                  value={formatMoney(
                    proposal.saldo_conta_credit.valor_disponivel
                  )}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Montante usado"
                  value={formatMoney(proposal.saldo_conta_credit.valor_usado)}
                  disabled
                />
              </Grid>
            </Grid>
          </Box>

          <Box className={classes.card}>
            <Typography className={classes.sectionTitle}>
              Situação das antecipações salariais
            </Typography>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("pendente")}>
                  <CustomCard text="Assinados" iconColor="green">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.assinado}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("pendente")}>
                  <CustomCard text="Pendentes" iconColor="orange">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.pendente}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("analise")}>
                  <CustomCard text="Em Analise" iconColor="yellow">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.analise}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("ativo")}>
                  <CustomCard text="Ativas" iconColor="green">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.ativo}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("recusado")}>
                  <CustomCard text="Recusadas" iconColor="deepPurple">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.recusado}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("atrasado")}>
                  <CustomCard text="Atrasadas" iconColor="red">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.atrasado}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("cancelado")}>
                  <CustomCard text="Canceladas" iconColor="black">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.cancelado}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("finalizado")}>
                  <CustomCard text="Finalizados" iconColor="red">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.finalizado}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Link to={linkToSupportList("erro")}>
                  <CustomCard text="Erros" iconColor="black">
                    <Box className={classes.cardContainer}>
                      <Typography className={classes.contadorStyle}>
                        {proposal.antecipacoes_status.erro}
                      </Typography>
                    </Box>
                  </CustomCard>
                </Link>
              </Grid>
            </Grid>
          </Box>

          <Box className={classes.bodyContainer}>
            <Box display="flex">
              <Grid container>
                <Grid xs={8}>
                  <CustomLineChart data={proposal.resumo_line_chart} />
                </Grid>
                <Grid xs={4}>
                  <CustomBarChart data={proposal.antecipacoes_status} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
        {canManageFinancialSupport && (
          <Box display="flex" style={{ height: "100%", marginTop: "20px" }}>
            <Grid container>
              <Grid xs={12}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",

                    height: "75px",
                    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                    borderTopRightRadius: 27,
                    borderTopLeftRadius: 27,
                  }}
                >
                  <Typography
                    style={{
                      color: APP_CONFIG.mainCollors.primary,
                      fontFamily: "Montserrat-SemiBold",
                      marginTop: "20px",
                      alignSelf: "center",
                      marginLeft: "30px",
                    }}
                  >
                    ANTECIPAÇÕES EM ATRASO
                  </Typography>

                  <Box
                    style={{
                      marginTop: "20px",
                      marginRight: "10px",
                    }}
                  >
                    <Link to={linkToSupportList("")}>
                      <CustomButton size="small" color="purple">
                        VER TODOS
                      </CustomButton>
                    </Link>
                  </Box>
                </Box>
                <Box style={{ marginBottom: "40px", width: "100%" }}>
                  <CustomTable
                    boxShadowTop={true}
                    columns={[
                      { headerText: "E-mail", key: "conta.email" },
                      { headerText: "Nome", key: "conta.nome" },
                      { headerText: "Status", key: "status" },
                      {
                        headerText: "Valor inicial",
                        key: "proposta.valor_inicial",
                      },
                      {
                        headerText: "Valor final",
                        key: "proposta.valor_final",
                      },
                      {
                        headerText: "Valor liberado",
                        key: "proposta.valor_liberado",
                      },
                    ]}
                    data={financialSupports ? financialSupports.data : []}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    )
  );
}

export default AntecipacaoSalarial;
