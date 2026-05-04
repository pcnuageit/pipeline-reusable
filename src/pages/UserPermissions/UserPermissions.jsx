import {
  faBan,
  faBarcode,
  faCheck,
  faCopy,
  faCreditCard,
  faDesktop,
  faDollarSign,
  faEye,
  faFileContract,
  faForward,
  faGift,
  faHistory,
  faLink,
  faList,
  faMobileAlt,
  faMoneyBillWave,
  faSignOutAlt,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Switch, Typography, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import {
  delPermissao,
  loadPermissaoGerenciar,
  postPermissaoAction,
} from "../../actions/actions";

import AccountCollectionItem from "../../components/AccountCollections/AccountCollectionItem/AccountCollectionItem";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import usePermission from "../../hooks/usePermission";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    /* padding: '80px 400px ', */
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "25px",
  },
  pageTitle: {
    color: "#c6930a",
    fontFamily: "Montserrat-SemiBold",
  },
  subTitleContainer: {
    margin: "15px 15px",
    display: "flex",
    justifyContent: "space-between",
  },
  contentContainer: {
    marginTop: "20px",
  },
  responsiveContainer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down(850)]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

const UserPermissions = () => {
  const classes = useStyles();
  const id = useParams()?.id ?? "";
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPermissaoGerenciar(token, id));
  }, [dispatch, token, id]);

  const handlePermissoes = async (event) => {
    setLoading(true);
    try {
      if (hasPermission(event.target.name)) {
        await dispatch(delPermissao(token, id, event.target.value));
      } else {
        await dispatch(postPermissaoAction(token, id, event.target.value));
      }
      await dispatch(loadPermissaoGerenciar(token, id));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Typography
        style={{ marginTop: "8px", color: APP_CONFIG.mainCollors.primary }}
        variant="h4"
      >
        Gerenciar Permissões
      </Typography>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Acesso total" icon={faCreditCard} />
          <Switch
            name={"Administrador - Acesso total"}
            value={1}
            checked={hasPermission("Administrador - Acesso total")}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.full_access
              )
            }
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Bloquear device" icon={faBarcode} />
          <Switch
            name={"Operações - Bloquear device"}
            value={2}
            checked={hasPermission("Operações - Bloquear device")}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.block_device
              )
            }
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Cancelamento de conta" icon={faCopy} />
          <Switch
            name={"Operações - Cancelamento de conta"}
            value={3}
            checked={hasPermission("Operações - Cancelamento de conta")}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.cancel_account
              )
            }
          />
        </Box>
      </Box>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Operações Gerenciamento de Conta"
            icon={faUndo}
          />
          <Switch
            name={
              "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar"
            }
            value={4}
            checked={hasPermission(
              "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar"
            )}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.manage_account
              )
            }
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Transações e histórico de transações não concluídas"
            typographyStyle={{ fontSize: 14 }}
            icon={faLink}
          />
          <Switch
            name={
              "Operações - Transações e histórico de transações não concluídas"
            }
            value={5}
            checked={hasPermission(
              "Operações - Transações e histórico de transações não concluídas"
            )}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.view_transactions
              )
            }
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Bloqueio de dispositivo por perda ou roubo"
            icon={faDesktop}
          />
          <Switch
            name={"Atendimento - Bloqueio de dispositivo por perda ou roubo"}
            value={11}
            checked={hasPermission(
              "Atendimento - Bloqueio de dispositivo por perda ou roubo"
            )}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.block_device_loss
              )
            }
          />
        </Box>
      </Box>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Consulta de extrato"
            icon={faDollarSign}
          />
          <Switch
            name={"Atendimento - Consulta de extrato"}
            value={6}
            checked={hasPermission("Atendimento - Consulta de extrato")}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.view_extract
              )
            }
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Consulta de status da conta"
            icon={faHistory}
          />
          <Switch
            name={"Atendimento - Consulta de status da conta"}
            value={7}
            checked={hasPermission("Atendimento - Consulta de status da conta")}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.view_account_status
              )
            }
          />
        </Box>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            typographyStyle={{ fontSize: "0.85rem" }}
            text="Consulta ao motivo de pendências de abertura de conta"
            icon={faForward}
          />
          <Switch
            name={
              "Atendimento - Consulta ao motivo de pendências de abertura de conta"
            }
            value={8}
            checked={hasPermission(
              "Atendimento - Consulta ao motivo de pendências de abertura de conta"
            )}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.view_pending_reasons
              )
            }
          />
        </Box>
      </Box>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            typographyStyle={{ fontSize: 13 }}
            text="Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)"
            icon={faSignOutAlt}
          />
          <Switch
            name={
              "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)"
            }
            value={9}
            checked={hasPermission(
              "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)"
            )}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(
                PERMISSIONS.administradores.permissions.view_personal_data
              )
            }
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Número da conta" icon={faCheck} />
          <Switch
            name={"Atendimento - Número da conta"}
            value={10}
            checked={hasPermission("Atendimento - Número da conta")}
            onClick={handlePermissoes}
          />

          <AccountCollectionItem
            typographyStyle={{ fontSize: 14 }}
            text="Gerenciamento de administradores"
            icon={faBan}
          />
          <Switch
            name={"Operações - Gerenciamento de administradores"}
            value={12}
            checked={hasPermission(
              "Operações - Gerenciamento de administradores"
            )}
            onClick={handlePermissoes}
          />
        </Box>
      </Box>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Parceiros - Visualizar Jeitto"
            icon={faCreditCard}
          />
          <Switch
            name={"Parceiros - Visualizar Jeitto"}
            value={14}
            checked={hasPermission("Parceiros - Visualizar Jeitto")}
            onClick={handlePermissoes}
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Parceiros - Visualizar Recargar"
            icon={faMobileAlt}
          />
          <Switch
            name={"Parceiros - Visualizar Recargar"}
            value={15}
            checked={hasPermission("Parceiros - Visualizar Recargar")}
            onClick={handlePermissoes}
          />

          <AccountCollectionItem
            text="Parceiros - Visualizar GiftCard"
            icon={faGift}
          />
          <Switch
            name={"Parceiros - Visualizar GiftCard"}
            value={16}
            checked={hasPermission("Parceiros - Visualizar GiftCard")}
            onClick={handlePermissoes}
          />
        </Box>
      </Box>

      <Box className={classes.responsiveContainer}>
        <Box display="flex" alignItems="center">
          <AccountCollectionItem text="Visualizar Logs" icon={faList} />
          <Switch
            name={"Operações - Visualizar Logs"}
            value={13}
            checked={hasPermission("Operações - Visualizar Logs")}
            onClick={handlePermissoes}
            disabled={
              !hasPermission(PERMISSIONS.administradores.permissions.view_logs)
            }
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Apoio Financeiro"
            icon={faMoneyBillWave}
          />
          <Switch
            name={"Crédito - Apoio Financeiro"}
            value={17}
            checked={hasPermission("Crédito - Apoio Financeiro")}
            onClick={handlePermissoes}
          />
        </Box>

        <Box display="flex" alignItems="center">
          <AccountCollectionItem
            text="Proposta de Apoio Financeiro"
            icon={faFileContract}
          />
          <Switch
            name={"Crédito - Proposta Apoio Financeiro"}
            value={18}
            checked={hasPermission("Crédito - Proposta Apoio Financeiro")}
            onClick={handlePermissoes}
          />
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        <AccountCollectionItem
          text="Gerenciar Proposta de Apoio Financeiro"
          icon={faFileContract}
        />
        <Switch
          name={"Crédito - Gerenciar Proposta Apoio Financeiro"}
          value={19}
          checked={hasPermission(
            "Crédito - Gerenciar Proposta Apoio Financeiro"
          )}
          onClick={handlePermissoes}
        />

        <AccountCollectionItem
          text="Gerenciar Autorização Bancária de benefícios"
          icon={faFileContract}
        />
        <Switch
          name={"Concorrência - Autorização Bancárias"}
          value={26}
          checked={hasPermission("Concorrência - Autorização Bancárias")}
          onClick={handlePermissoes}
          disabled={
            !hasPermission(
              PERMISSIONS.administradores.permissions
                .manage_banking_authorization
            )
          }
        />

        <AccountCollectionItem
          text="Gerenciar Acesso Logs Auditoria"
          icon={faEye}
        />
        <Switch
          name={"Concorrência - Acesso Audits Logs"}
          value={27}
          checked={hasPermission("Concorrência - Acesso Audits Logs")}
          onClick={handlePermissoes}
          disabled={
            !hasPermission(
              PERMISSIONS.administradores.permissions.manage_audit_logs
            )
          }
        />
      </Box>
    </Box>
  );
};

export default UserPermissions;
