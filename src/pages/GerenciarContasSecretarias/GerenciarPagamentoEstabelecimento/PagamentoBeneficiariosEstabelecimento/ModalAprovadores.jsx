import {
  Dialog,
  DialogContent,
  DialogTitle,
  TableContainer,
  Typography,
} from "@material-ui/core";
import CustomTable from "../../../../components/CustomTable/CustomTable";

const columns = [
  { headerText: "nome", key: "user.nome" },
  { headerText: "email", key: "user.email" },
  {
    headerText: "aprovado",
    key: "aprovado",
    CustomValue: (v) => <Typography>{v ? "sim" : "não"}</Typography>,
  },
];

export default function ModalAprovadores({
  show = false,
  setShow = () => false,
}) {
  const handleClose = () => setShow(false);

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="80dvw"
      maxHeight="80dvh"
    >
      <DialogTitle id="form-dialog-title">Aprovadores</DialogTitle>

      <DialogContent style={{ overflow: "hidden", width: "100%" }}>
        <TableContainer style={{ overflowX: "auto" }}>
          <CustomTable data={show} columns={columns} />
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
