import { ListItemText } from "@material-ui/core";
import { format } from "date-fns";

const FeeChargeListItemText = ({ log, textAction  }) => {
	return (
		<ListItemText
      primary={log.action === 'pagamento_tarifa' ? `${textAction} ${log.tarifa?.ordem ?? "#"}` : textAction}
      secondary={
        <span>
          Status: {log.transferencia_pagamento?.status ?? "-"} <br />
          {format(
            new Date(log.created_at.slice(0, -1)),
            'dd MMM, HH:mm'
          )}
        </span>
      }
    />
	);
};

export default FeeChargeListItemText;
