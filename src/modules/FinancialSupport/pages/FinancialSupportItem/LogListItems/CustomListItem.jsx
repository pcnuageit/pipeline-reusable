import {
	Avatar,
	Box,
	colors,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@material-ui/core';
import {
	AttachMoney,
	Block,
	BorderColor,
	Cancel,
	Check,
	DoneAll,
	InfoOutlined,
	MoneyOff,
	Receipt,
} from '@material-ui/icons';
import Popover from '../../../components/Popover';
import { format } from "date-fns";
import { useMemo } from 'react';
import FeeChargeListItemText from './FeeChargeListItemText';
import FinancialTransferListItemText from './FinancialTransferListItemText';
import DefaultListItemText from './DefaultListItemText';

const mappedLogs = {
  solicitado: {
    Icon: Check,
    color: colors.grey[100],
    textAction: "Solicitado",
  },
  validacao_negada: {
    Icon: Block,
    color: colors.red[500],
    textAction: "Validação negada",
  },
  reativado: {
    Icon: Check,
    color: colors.grey[100],
    textAction: "Reativado",
  },
  aprovado: {
    Icon: DoneAll,
    color: colors.green[500],
    textAction: "Aprovado",
  },
  recusado: {
    Icon: Cancel,
    color: colors.red[500],
    textAction: "Recusado",
  },
  assinado: {
    Icon: BorderColor,
    color: colors.green[500],
    textAction: "Assinado",
  },
  liberacao_apoio: {
    Icon: AttachMoney,
    color: colors.green[500],
    textAction: "Transferência de apoio",
  },
  cancelado: {
    Icon: Block,
    color: colors.red[500],
    textAction: "Cancelado",
  },
  pagamento_tarifa: {
    Icon: AttachMoney,
    color: colors.green[500],
    textAction: "Cobrança de tarifa",
  },
  pagamento_apoio: {
    Icon: AttachMoney,
    color: colors.green[500],
    textAction: "Cobrança do apoio",
  },
  gerar_qr_code: {
    Icon: Receipt,
    color: colors.grey[100],
    textAction: "QR code gerado",
  },
  pagamento_qr_code: {
    Icon: Receipt,
    color: colors.green[500],
    textAction: "Pagamento via QR code",
  },
  saldo_insuficiente: {
    Icon: MoneyOff,
    color: colors.red[500],
    textAction: "Saldo Insuficiente",
  },
};

const CustomListItem = ({ log }) => {
  const { Icon, color, textAction } = mappedLogs[log.action];

  const customColor = useMemo(() => {
    if(log.action === "pagamento_tarifa" || log.action === "pagamento_apoio") {
      if(!log.transferencia_pagamento?.status) return colors.grey[100];
      return log.transferencia_pagamento?.status === "Sucesso" ? colors.green[500] : colors.red[500];
    }
    if(log.action === "liberacao_apoio") {
      if(!log.transferencia_apoio?.status) return colors.grey[100];
      return log.transferencia_apoio?.status === "Sucesso" ? colors.green[500] : colors.red[500];
    }
    return color;
  }, [color, log]);

  const item = useMemo(() => {
    if(log.action === "pagamento_tarifa" || log.action === "pagamento_apoio") {
      return <FeeChargeListItemText log={log} textAction={textAction} />;
    }
    if(log.action === "liberacao_apoio") {
      return <FinancialTransferListItemText log={log} textAction={textAction} />;
    }
    return <DefaultListItemText log={log} textAction={textAction} />;
  }, [log, textAction])

  const details = useMemo(() => {
    if(log.action === "pagamento_tarifa" || log.action === "pagamento_apoio") {
      if(log.transferencia_pagamento?.fitbank?.Message) return log.transferencia_pagamento?.fitbank?.Message;
      return "-";
    }
    if(log.action === "liberacao_apoio") {
      if(log.transferencia_apoio?.fitbank?.Message) return log.transferencia_apoio?.fitbank?.Message;
      return "-";
    }
    return "-";
  }, [log])

  return (
    <ListItem disableGutters>
      <ListItemAvatar>
        <Avatar>
          <Icon style={{ color: customColor }} />
        </Avatar>
      </ListItemAvatar>
      {item}
      <Popover buttonContent={<InfoOutlined />}>
        <Box>
          <Typography variant="body2">
            Descrição: {log.description}
          </Typography>
          <Typography variant="body2">
            Detalhes: {details}
          </Typography>
          <Box marginTop={1}>
            <Typography variant="body2">
              Por: {log.user} <br />
              Via IP: {log.ip}
            </Typography>
          </Box>
        </Box>
      </Popover>
    </ListItem>
  );
};

export default CustomListItem;
