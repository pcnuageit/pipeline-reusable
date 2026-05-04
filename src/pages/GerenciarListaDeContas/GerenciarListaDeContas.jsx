import "../../fonts/Montserrat-SemiBold.otf";

import { Box, makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import {
  filters_historico_pix,
  filters_historico_ted,
  filters_historico_transacoes,
  filters_historico_transferencia,
} from "../../constants/localStorageStrings";

import { useSelector } from "react-redux";
import { useParams } from "react-router";
import AccountCollections from "../../components/AccountCollections/AccountCollections";
import { APP_CONFIG } from "../../constants/config";
import usePermission from "../../hooks/usePermission";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
  },
}));

const GerenciarListaDeContas = () => {
  const classes = useStyles();
  const conta = useSelector((state) => state.conta);
  const { subsection } = useParams();
  const { hasPermission, PERMISSIONS } = usePermission();
  //const isBanking = conta?.is_default_app_account;
  const isAdquirencia = conta?.solicitado_adquirencia;
  const isEstabelecimento = conta?.is_estabelecimento;
  const isGestao = conta?.is_gestao_concorrencia ?? true;
  const isBanking = !(isEstabelecimento || isGestao);
  const estado = APP_CONFIG?.estado;

  useEffect(() => {
    localStorage.removeItem(filters_historico_transacoes);
    localStorage.removeItem(filters_historico_transferencia);
    localStorage.removeItem(filters_historico_ted);
    localStorage.removeItem(filters_historico_pix);
  }, []);

  const pageTitle = conta?.saldo?.valor
    ? "Saldo: " +
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(conta?.saldo?.valor)
    : "Gerenciar conta";

  return (
    <Box className={classes.root}>
      <AccountCollections
        title={pageTitle}
        ted={isBanking}
        pix={false}
        pagamentoConta={false}
        chavespix={isBanking}
        cartao={isBanking}
        boleto={isBanking}
        carne={isBanking}
        assinaturas={isBanking}
        link={isBanking}
        extrato={isBanking}
        historicoTransacoes={false}
        historicoTransferencia={false}
        pagadores={isBanking}
        terminais={isBanking}
        recarga={isBanking}
        folhaPagamento={false}
        contasAutorizadas={isBanking && subsection === "lista-conta-juridica"}
        exportacoesSolicitadas={isBanking}
        tarifas={false}
        extrato_adquirencia={isAdquirencia}
        extrato_beneficios={isEstabelecimento}
        //
        beneficiarios={
          isGestao && hasPermission(PERMISSIONS.secretarias.beneficiarios.view)
        }
        listaBeneficios={
          isGestao && hasPermission(PERMISSIONS.secretarias.beneficios.view)
        }
        //
        cartoesBeneficiarios={
          isGestao && hasPermission(PERMISSIONS.secretarias.cartoes.view)
        }
        pagamentoCartaoPrivado={
          isGestao &&
          hasPermission(PERMISSIONS.secretarias.pagamento_cartao.view)
        }
        liberarCartoes={isGestao}
        //
        voucherBeneficiarios={
          estado !== "MT" &&
          isGestao &&
          hasPermission(PERMISSIONS.secretarias.vouchers.view)
        }
        pagamentoContaVoucher={
          estado !== "MT" &&
          isGestao &&
          hasPermission(PERMISSIONS.secretarias.pagamento_voucher.view)
        }
        autorizaPagamentoContaVoucher={
          estado !== "MT" &&
          isGestao &&
          hasPermission(
            PERMISSIONS.secretarias.autorizar_pagamento_voucher.view,
          )
        }
        //
        listaContratoAluguel={estado !== "MT" && isGestao}
        pagamentoContratoAluguel={estado !== "MT" && isGestao}
        autorizaPagamentoContratoAluguel={estado !== "MT" && isGestao}
      />
    </Box>
  );
};

export default GerenciarListaDeContas;
