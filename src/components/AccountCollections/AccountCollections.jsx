import {
  faArchive,
  faBarcode,
  faBuilding,
  faCheck,
  faCopy,
  faCreditCard,
  faDesktop,
  faDollarSign,
  faFileInvoiceDollar,
  faFileSignature,
  faHistory,
  faLink,
  faList,
  faListAlt,
  faMobile,
  faMobileAlt,
  faMoneyBill,
  faTags,
  faTicketAlt,
  faUndo,
  faUserCheck,
  faUsers,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import usePermission from "../../hooks/usePermission";
import AccountCollectionItem from "./AccountCollectionItem/AccountCollectionItem";

const useStyles = makeStyles((theme) => ({
  accountCollectionContainer: {
    width: "60%",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    color: theme.palette.primary.main,
    [theme.breakpoints.down(850)]: {
      width: "100%",
    },
  },
}));

const AccountCollections = ({
  title,
  ted,
  pix,
  pagamentoConta,
  chavespix,
  cartao,
  boleto,
  carne,
  assinaturas,
  link,
  extrato,
  historicoTransacoes,
  historicoTransferencia,
  pagadores,
  terminais,
  recarga,
  folhaPagamento,
  contasAutorizadas,
  exportacoesSolicitadas,
  tarifas,
  extrato_adquirencia,
  extrato_beneficios,
  beneficiarios,
  cartoesBeneficiarios,
  voucherBeneficiarios,
  pagamentoCartaoPrivado,
  liberarCartoes,
  pagamentoContaVoucher,
  autorizaPagamentoContaVoucher,
  listaBeneficios,
  listaContratoAluguel,
  pagamentoContratoAluguel,
  autorizaPagamentoContratoAluguel,
}) => {
  const token = useAuth();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { hasPermission, PERMISSIONS } = usePermission();
  const AbaGestao = APP_CONFIG.AbaGestao;

  // useEffect(() => {
  //   dispatch(postAuthMeAction(token));
  // }, [dispatch, token]);

  if (AbaGestao && !hasPermission(PERMISSIONS.secretarias.actions.manage))
    return null;

  return (
    <Box className={classes.accountCollectionContainer}>
      <Typography variant="h6">{title}</Typography>

      <Box display="flex">
        {contasAutorizadas ? (
          <AccountCollectionItem
            link="contas-autorizadas"
            text="Contas Autorizadas"
            icon={faUserCheck}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {cartao ? (
          <AccountCollectionItem
            link="cobrancas-credito"
            text="Máquina Virtual"
            icon={faCreditCard}
          />
        ) : null}

        {boleto ? (
          <AccountCollectionItem link="boleto" text="Boleto" icon={faBarcode} />
        ) : null}

        {carne ? (
          <AccountCollectionItem link="carne" text="Carnê" icon={faCopy} />
        ) : null}
      </Box>

      <Box display="flex">
        {link ? (
          <AccountCollectionItem
            link="link-pagamento"
            text="Link de Pagamento"
            icon={faLink}
          />
        ) : null}

        {pagadores ? (
          <AccountCollectionItem
            link="pagadores"
            text="Pagadores"
            icon={faUsers}
          />
        ) : null}

        {extrato ? (
          <AccountCollectionItem
            link={
              hasPermission("Atendimento - Consulta de extrato")
                ? "extrato"
                : null
            }
            text="Extrato"
            icon={faDollarSign}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {assinaturas ? (
          <AccountCollectionItem
            link="assinaturas"
            text="Cobrança Recorrente"
            icon={faUndo}
          />
        ) : null}
        {historicoTransacoes ? (
          <AccountCollectionItem
            link={
              hasPermission(
                "Operações - Transações e histórico de transações não concluídas",
              )
                ? "historico-de-transacoes"
                : null
            }
            text="Histórico de Transações"
            icon={faDesktop}
          />
        ) : null}

        {historicoTransferencia ? (
          <AccountCollectionItem
            link="historico-transferencia"
            text="Histórico de Transferência"
            icon={faHistory}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {ted ? (
          <AccountCollectionItem
            link="transferencia-ted"
            text="Transferência TED"
            icon={faUsers}
          />
        ) : null}
        {pix ? (
          <AccountCollectionItem
            link="transacoes-pix"
            text="Transações PIX"
            icon={faWallet}
          />
        ) : null}
        {chavespix ? (
          <AccountCollectionItem
            link="chaves-pix"
            text="Chaves PIX"
            icon={faTags}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {pagamentoConta ? (
          <AccountCollectionItem
            link="pagamento-conta"
            text="Pagamento Conta"
            icon={faMoneyBill}
          />
        ) : null}

        {/* {giftCard ? (
						<AccountCollectionItem
						link='gift-cards'
						text="Gift Card"
						icon={faGift}
					/>
					): null} */}

        {recarga ? (
          <AccountCollectionItem
            link="recarga-celular"
            text="Recarga"
            icon={faMobileAlt}
          />
        ) : null}

        {extrato_adquirencia ? (
          <AccountCollectionItem
            link={"extrato-adquirencia"}
            text="Extrato Adquirência"
            icon={faList}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {terminais ? (
          <AccountCollectionItem
            link="terminais-pos"
            text="Terminais - POS"
            icon={faMobile}
          />
        ) : null}

        {exportacoesSolicitadas ? (
          <AccountCollectionItem
            link={"exportacoes-solicitadas"}
            text="Exportações Solicitadas"
            icon={faArchive}
          />
        ) : null}

        {tarifas ? (
          <AccountCollectionItem
            link={"tarifas"}
            text="Tarifas"
            icon={faMoneyBill}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {folhaPagamento ? (
          <AccountCollectionItem
            link="folha-de-pagamento"
            text="Folha de Pagamento"
            icon={faListAlt}
          />
        ) : null}

        {extrato_beneficios ? (
          <AccountCollectionItem
            link={"extrato-adquirencia"}
            text="Extrato Benefícios"
            icon={faList}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {beneficiarios ? (
          <AccountCollectionItem
            link={
              hasPermission(PERMISSIONS.secretarias.beneficiarios.view)
                ? "lista-beneficiarios"
                : null
            }
            text="Beneficiários"
            icon={faUsers}
          />
        ) : null}

        {listaBeneficios ? (
          <AccountCollectionItem
            link={
              hasPermission(PERMISSIONS.secretarias.beneficios.view)
                ? "lista-beneficios"
                : null
            }
            text="Lista de benefícios"
            icon={faList}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {cartoesBeneficiarios ? (
          <AccountCollectionItem
            link={
              hasPermission(PERMISSIONS.secretarias.cartoes.view)
                ? "lista-beneficiarios-cartao"
                : null
            }
            text="Cartões dos Beneficiários"
            icon={faWallet}
          />
        ) : null}

        {pagamentoCartaoPrivado ? (
          <AccountCollectionItem
            link={
              hasPermission(PERMISSIONS.secretarias.pagamento_cartao.view)
                ? "pagamento-beneficiarios-cartao"
                : null
            }
            text="Pagamento Cartão Privado"
            icon={faCreditCard}
          />
        ) : null}

        {liberarCartoes ? (
          <AccountCollectionItem
            link={"liberar-beneficiarios-cartao"}
            text="Liberar Cartões"
            icon={faCreditCard}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {voucherBeneficiarios ? (
          <AccountCollectionItem
            link={
              hasPermission(PERMISSIONS.secretarias.vouchers.view)
                ? "lista-beneficiarios-voucher"
                : null
            }
            text="Vouchers dos Beneficiários"
            icon={faBuilding}
          />
        ) : null}

        {pagamentoContaVoucher ? (
          <AccountCollectionItem
            link={
              hasPermission(PERMISSIONS.secretarias.pagamento_voucher.view)
                ? "pagamento-beneficiarios-voucher"
                : null
            }
            text="Pagamento Conta Voucher"
            icon={faTicketAlt}
          />
        ) : null}

        {autorizaPagamentoContaVoucher ? (
          <AccountCollectionItem
            link={
              hasPermission(
                PERMISSIONS.secretarias.autorizar_pagamento_voucher.view,
              )
                ? "autorizar-pagamento-beneficiarios-voucher"
                : null
            }
            text="Autorizar Pagamento Conta Voucher"
            icon={faCheck}
          />
        ) : null}
      </Box>

      <Box display="flex">
        {listaContratoAluguel ? (
          <AccountCollectionItem
            link={"lista-contrato-aluguel"}
            text="Contrato de Aluguel"
            icon={faFileSignature}
          />
        ) : null}
        {pagamentoContratoAluguel ? (
          <AccountCollectionItem
            link={"pagamento-contrato-aluguel"}
            text="Pagamento Contrato de Aluguel"
            icon={faFileInvoiceDollar}
          />
        ) : null}
        {autorizaPagamentoContratoAluguel ? (
          <AccountCollectionItem
            link={"autorizar-pagamento-contrato-aluguel"}
            text="Autorizar Pagamento Contrato de Aluguel"
            icon={faCheck}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default AccountCollections;
