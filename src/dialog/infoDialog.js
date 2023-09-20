import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const InforamtionDialog = ({ show, data, onClose }) => {
  const [open, setOpen] = React.useState(show);

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(data.content);
    setOpen(false);
    onClose();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{data.header}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {data.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {
            data.copy &&
            <Button onClick={handleCopy}>Copy</Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InforamtionDialog;