import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function DiscardModal({ handleDelete }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Button
        variant="text"
        color="error"
        endIcon={<DeleteForeverIcon />}
        onClick={() => setOpen(true)}
        sx={{maxWidth: 10}}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="discard-dialog-title"
        aria-describedby="discard-dialog-description"
      >
        <DialogTitle
          id="discard-dialog-title"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <WarningAmberRoundedIcon color="warning" />
          Confirmação
        </DialogTitle>
        <Divider />
        <DialogContent id="discard-dialog-description">
          Tem certeza que quer remover essa review?
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete();
              setOpen(false);
            }}
          >
            Remover
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
