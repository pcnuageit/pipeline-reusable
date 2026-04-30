import { ListItemText } from "@material-ui/core";
import { format } from "date-fns";

const FinancialTransferListItemText = ({ log, textAction  }) => {
	return (
		<ListItemText
      primary={textAction}
      secondary={
        <span>
          Status: {log.transferencia_apoio?.status ?? "-"}<br />
          {format(
            new Date(log.created_at.slice(0, -1)),
            'dd MMM, HH:mm'
          )}
        </span>
      }
    />
	);
};

export default FinancialTransferListItemText;
