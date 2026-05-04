import moment from "moment";
import { useState } from "react";
import { useParams } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import {
  postAddBeneficiario,
  postAddBeneficio,
  postAddCartao,
  postAddLoteBeneficiarios,
  postAddLoteBloquearCartao,
  postAddLoteCancelamentoCartao,
  postAddLoteCartoes,
  postAddLoteContratoAluguel,
  postAddLoteEstabelecimento,
  postAddLotePagamentoCartao,
  postAddLotePagamentoContratoAluguel,
  postAddLotePagamentoEstabelecimento,
  postAddLotePagamentoVoucher,
  postAddLoteSegundaViaCartao,
  postAddLoteStatusCartao,
  postAddLoteVouchers,
  postAddLoteVouchersEmbossing,
  postAddVoucher,
  postExcluirLoteContratoAluguel,
  putUpdateBeneficiario,
  putUpdateBeneficio,
} from "../../services/beneficiarios";
import { postAddLoteNotificacao } from "../../services/services";

export function useNovoCadastroRequests(
  tipo, //beneficiario, cartao, voucher
  update = false,
  data = {},
) {
  const token = useAuth();
  const id = useParams()?.id ?? "";
  const [errors, setErrors] = useState({});
  const [conta, setConta] = useState({
    beneficiario: {
      numero_inscricao: data?.numero_inscricao,
      nome: data?.nome,
      email: data?.email,
      data_nascimento: data?.data_nascimento
        ? moment(data.data_nascimento, "YYYY-MM-DD").format("DD/MM/YYYY")
        : "",
      documento: data?.documento,
      celular: data?.celular,
    },
    endereco: {
      cep: data?.concorrencia_endereco?.cep,
      rua: data?.concorrencia_endereco?.rua,
      numero: data?.concorrencia_endereco?.numero,
      complemento: data?.concorrencia_endereco?.complemento,
      bairro: data?.concorrencia_endereco?.bairro,
      cidade: data?.concorrencia_endereco?.cidade,
      estado: data?.concorrencia_endereco?.estado,
    },
    cartao: {
      documento: data?.user?.documento,
      data_solicitacao: "",
      municipio: data?.municipio,
      curso: data?.curso,
    },
    voucher: {
      documento: data?.documento,
      tipo_transferencia: data?.tipo_transferencia ?? "Dict",
      chave_pix: data?.chave_pix,
      nome_conta: data?.nome_conta,
      documento_conta: data?.documento_conta,
      banco: data?.banco,
      agencia: data?.agencia,
      conta: data?.conta,
      conta_digito: data?.conta_digito,
      tipo_conta: data?.tipo_conta,
      cvc: data?.cvc,
    },
    beneficio: {
      conta_id: data?.conta_id,
      nome_prefeitura: data?.nome_prefeitura,
      nome_beneficio: data?.nome_beneficio,
      sigla: data?.sigla,
      documento: data?.documento,
      cdProduto: data?.external_id,
      tipo: data?.tipo,
      is_credito_social: data?.is_credito_social,
      conta_mdr_id: data?.conta_mdr_id,
      is_validar_competencia: data?.is_validar_competencia,
      valida_limite_saldo: data?.valida_limite_saldo,
      limite_saldo: data?.limite_saldo,
      // tipo==="cartao"
      is_virtual: data?.is_virtual,
      is_gerar_cvc: data?.is_gerar_cvc,
      // tipo==="beneficiario" (voucher)
      is_contrato: data?.is_contrato,
      is_alterar_chave_pix: data?.is_alterar_chave_pix,
    },
    tipo_beneficio_id: "",
  });

  function resetFields() {
    setConta({
      beneficiario: {},
      endereco: {},
      cartao: {},
      voucher: { tipo_transferencia: "Dict" },
    });
  }

  async function requestHandler() {
    setErrors({});
    if (update) {
      if (tipo === "beneficiario") {
        await putUpdateBeneficiario(token, data?.id, {
          beneficiario: conta.beneficiario,
          endereco: conta.endereco,
        });
      }

      if (tipo === "beneficio") {
        await putUpdateBeneficio(token, data?.id, conta.beneficio);
      }
    } else {
      if (tipo === "beneficiario") {
        await postAddBeneficiario(token, id, {
          beneficiario: conta.beneficiario,
          endereco: conta.endereco,
        });
      }

      if (tipo === "cartao") {
        await postAddCartao(token, conta.tipo_beneficio_id, conta.cartao);
      }

      if (tipo === "voucher") {
        await postAddVoucher(token, id, conta.tipo_beneficio_id, conta.voucher);
      }

      if (tipo === "beneficio") {
        await postAddBeneficio(token, conta.beneficio);
      }
    }
  }

  return { errors, setErrors, conta, setConta, requestHandler, resetFields };
}

export function useLoteCadastroRequests(
  tipo, //beneficiario, cartao, voucher, pagamento_cartao, pagamento_estabelecimento, pagamento_voucher, contrato_aluguel, pagamento_contrato_aluguel, estabelecimento, notificacoes, cancelamento_cartao, bloquear_cartao, status_cartao, segunda_via_cartao, contrato_aluguel_excluir
) {
  const token = useAuth();
  const id = useParams()?.id ?? "";
  const [conta, setConta] = useState({
    descricao: "",
    data_pagamento: "",
    competencia: "",
    password: "",
    data_agendamento: "",
  });

  async function requestHandler(file) {
    if (tipo === "beneficiario") {
      await postAddLoteBeneficiarios(token, id, file);
    }
    if (tipo === "cartao") {
      await postAddLoteCartoes(token, id, file, conta?.password);
    }
    if (tipo === "voucher") {
      await postAddLoteVouchers(token, id, file);
    }
    if (tipo === "pagamento_cartao") {
      await postAddLotePagamentoCartao(
        token,
        id,
        file,
        conta.descricao,
        conta.data_pagamento,
        conta.competencia,
        conta?.password,
      );
    }
    if (tipo === "pagamento_estabelecimento") {
      await postAddLotePagamentoEstabelecimento(
        token,
        id,
        file,
        conta.descricao,
        conta.data_pagamento,
      );
    }
    if (tipo === "pagamento_voucher") {
      await postAddLotePagamentoVoucher(
        token,
        id,
        file,
        conta.descricao,
        conta.data_pagamento,
        conta.competencia,
      );
    }
    if (tipo === "contrato_aluguel") {
      await postAddLoteContratoAluguel(token, id, file);
    }
    if (tipo === "contrato_aluguel_excluir") {
      await postExcluirLoteContratoAluguel(token, id, file);
    }
    if (tipo === "pagamento_contrato_aluguel") {
      await postAddLotePagamentoContratoAluguel(
        token,
        id,
        file,
        conta.descricao,
      );
    }
    if (tipo === "estabelecimento") {
      await postAddLoteEstabelecimento(token, file);
    }
    if (tipo === "notificacoes") {
      await postAddLoteNotificacao(token, file);
    }
    if (tipo === "cancelamento_cartao") {
      await postAddLoteCancelamentoCartao(
        token,
        id,
        file,
        conta.data_agendamento,
      );
    }
    if (tipo === "bloquear_cartao") {
      await postAddLoteBloquearCartao(token, id, file, conta.data_agendamento);
    }
    if (tipo === "status_cartao") {
      await postAddLoteStatusCartao(token, id, file, conta.data_agendamento);
    }
    if (tipo === "segunda_via_cartao") {
      await postAddLoteSegundaViaCartao(token, id, file);
    }
    if (tipo === "voucher_embossing") {
      await postAddLoteVouchersEmbossing(token, id, file);
    }
  }

  return { conta, setConta, requestHandler };
}
