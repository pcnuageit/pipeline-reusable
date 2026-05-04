import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAuthMeAction } from "../actions/actions";
import useAuth from "./useAuth";

export default function usePermission(permission) {
  const dispatch = useDispatch();
  const token = useAuth();
  const me = useSelector((state) => state.me);
  const userPermissions = me?.permissao?.map(({ tipo }) => tipo);
  const userPermissionsTree = parsePermissionsTreeIds(
    me?.arvore_de_permissoes ?? {},
  );

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [dispatch, token]);

  /**
   *
   * @param {string} permission
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (userPermissionsTree?.includes(permission)) return true;

    // Use older permissions only if new permissions are not present
    if (userPermissionsTree === null || userPermissionsTree?.length === 0) {
      if (userPermissions?.includes("Administrador - Acesso total"))
        return true;
      if (userPermissions?.includes(permission)) return true;
    }

    return false;
  };

  return {
    PERMISSIONS,
    hasPermission,
  };
}

function parsePermissionsTreeIds(arvore_de_permissoes) {
  const ids = [];

  function traverse(node) {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach((item) => traverse(item));
    } else if (typeof node === "object") {
      if (node.id && typeof node.id === "number") {
        ids.push(node.id);
      }
      Object.values(node).forEach((value) => traverse(value));
    }
  }

  traverse(arvore_de_permissoes);
  return ids;
}

const PERMISSIONS = {
  // Authentication Module (Pre-Login)
  auth: {
    login: 1,
    forgot_password: 2,
    first_access: 3,
  },

  // Home/Dashboard Module
  home: {
    cards: {
      view_pending: 4,
      view_approved: 5,
      view_rejected: 6,
      view_refused: 7,
      view_active: 8,
      view_total: 9,
    },
    charts: {
      view_account_status: 10,
      view_accounts_by_month: 11,
    },
    table: {
      view: 12,
      view_button: 13,
    },
  },

  // Contas Module
  contas: {
    list: {
      view: 14,
      search: 15,
      export: 16,
    },
    details: {
      view: 17,
      view_documents: 18,
      view_partners: 18,
      view_representatives: 18,
      sync_data: 19,
    },
    actions: {
      edit: 20,
      approve: 21,
      deny: 22,
      block: 23,
      manage: 24,
      request_document_resend: 25,
      resend_approval_token: 26,
    },
  },

  // Estabelecimentos Module
  estabelecimentos: {
    list: {
      view: 50,
      search: 50,
      create: 51,
      export: 52,
    },
    actions: 53,
    manage: {
      view_transactions: 56,
      filter_transactions: 54,
      clear_filters: 55,
      update_extract: 55,
      export: 55,
      view_benefits_extract: 56,
      view_transaction_details: 56,
      view_daily_balance: 56,
    },
  },

  // Secretarias Module
  secretarias: {
    list: {
      view: 59,
      search: 57,
      export: 58,
    },
    actions: {
      edit: 60,
      manage: 61,
    },
    beneficiarios: {
      view: 65,
      create: 62,
      view_batch_files: 63,
      batch_upload: 64,
      update_recent_list: 65,
      export: 65,
      view_program: 66,
      delete: 66,
      edit: 66,
      revert: 66,
    },
    beneficios: {
      view: 67,
      create: 67,
    },
    cartoes: {
      view: 68,
      export: 69,
      view_batch_files: 70,
      create: 71,
      actions: 72,
    },
    pagamento_cartao: {
      view: 75,
      search: 73,
      update_extract: 74,
      clear_filters: 74,
      export: 74,
      print: 76,
      delete: 76,
      view_details: 76,
      view_return_message: 76,
    },
    vouchers: {
      view: 81,
      search: 77,
      update_extract: 78,
      clear_filters: 78,
      export: 78,
      create: 79,
      view_batch_files: 80,
      delete_recent: 82,
    },
    pagamento_voucher: {
      view: 83,
      actions: 84,
      view_batch_files: 85,
      create: 86,
      reverter_pagamentos: 529,
      export: 530,
      consultar_json: 531,
    },
    autorizar_pagamento_voucher: {
      view: 87,
      update_extract: 87,
      clear_filters: 87,
      export: 87,
      approve: 88,
      approve_all: 89,
    },
  },

  // Beneficiários Module
  beneficiarios: {
    list: {
      view: 90,
      search: 90,
      update_extract: 91,
      clear_filters: 91,
      export: 91,
    },
    actions: {
      view_program: 92,
      delete: 92,
      edit: 92,
      revert: 92,
    },
  },

  // Benefícios Module
  beneficios: {
    list: {
      view: 95,
      search: 93,
      update_extract: 94,
      clear_filters: 94,
      export: 94,
    },
    actions: {
      create: 98,
      edit: 97,
      delete: 96,
    },
  },

  // Pagamento Estabelecimento Module
  pagamento_estabelecimento: {
    todos_pagamentos: {
      list: {
        view: 99,
      },
      actions: {
        header: 100,
        row: 101,
      },
    },
    auditar_pagamentos: {
      list: {
        view: 102,
      },
      actions: {
        header: 103,
        create_payment: 104,
        approve_payment: 105,
        select_all: 106,
        view_payroll: 107,
      },
    },
    autorizar_pagamentos: {
      actions: {
        approve_payment: 108,
        approve_all: 109,
      },
    },
  },

  // Pré Contas Module
  pre_contas: {
    list: {
      view: 110,
    },
    actions: {
      all: 111,
      details: 112,
    },
  },

  // Transações Module
  transacoes: {
    historico: {
      list: {
        view: 115,
        search: 113,
      },
      actions: {
        all: 114,
      },
    },
    pix: {
      list: {
        view: 118,
        search: 116,
      },
      actions: {
        all: 117,
      },
    },
    p2p: {
      list: {
        view: 119,
      },
      actions: {
        all: 120,
      },
    },
    cartoes: {
      list: {
        view: 121,
      },
      actions: {
        all: 122,
        view_receipt: 123,
      },
    },
    voucher: {
      list: {
        view: 124,
      },
      actions: {
        all: 125,
        view_receipt: 126,
      },
    },
  },

  // Administradores Module
  administradores: {
    list: {
      view: 127,
      update_list: 128,
    },
    actions: {
      create: 130,
      send: 129,
      manage_permissions: 130,
      delete: 131,
      resend_token: 132,
      edit: 200,
    },
    permissions: {
      full_access: 133,
      block_device: 134,
      cancel_account: 135,
      manage_account: 136,
      view_transactions: 137,
      block_device_loss: 138,
      view_extract: 139,
      view_account_status: 140,
      view_pending_reasons: 141,
      view_personal_data: 142,
      view_partners: 143,
      view_logs: 144,
      manage_financial_support: 145,
      manage_banking_authorization: 146,
      manage_audit_logs: 147,
    },
  },

  // Dispositivos Bloqueados Module
  dispositivos_bloqueados: {
    list: {
      view: 150,
      search: 148,
      update_list: 149,
    },
  },

  // Visualizar Logs Module
  logs: {
    list: {
      view: 153,
      search: 151,
    },
    actions: {
      update_list: 152,
    },
  },

  // Logs Auditoria Module
  logs_auditoria: {
    list: {
      view: 154,
    },
    actions: {
      update_list: 155,
      view_previous_and_updated_data: 156,
    },
  },

  // Banners Module
  banners: {
    list: {
      view: 157,
      update_list: 158,
    },
    actions: {
      create: 159,
      upload_image: 159,
      add_link: 160,
      define_type: 161,
      delete: 162,
    },
  },

  // Notificações Module
  notificacoes: {
    list: {
      view: 163,
      search: 164,
    },
    actions: {
      send_notification: 165,
    },
  },

  // Arquivos Exportados Module
  arquivos_exportados: {
    list: {
      view: 166,
    },
    actions: {
      download: 167,
    },
  },

  // Tokens Públicos Module
  tokens_publicos: {
    list: {
      view: 168,
    },
    actions: {
      generate: 169,
    },
  },
};
