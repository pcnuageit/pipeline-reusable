import { ListItemText } from "@material-ui/core";
import { format } from "date-fns";

const DefaultListItemText = ({ log, textAction }) => {
  return (
    <ListItemText
      primary={textAction}
      secondary={format(new Date(log.created_at.slice(0, -1)), "dd MMM, HH:mm")}
    />
  );
};

export default DefaultListItemText;
