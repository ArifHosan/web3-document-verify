import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const IdentifierInputDialog = ({ show, onClose }) => {
  const [open, setOpen] = React.useState(show);
  const [identifier, setIdentifier] = React.useState('');

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    setIdentifier('');
    onClose();
  };
  const handleSubmit = () => {
    setOpen(false);
    onClose(identifier);
    setIdentifier('');
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Document Identifier</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter the unique document identifier to verify the document
          </DialogContentText>
          <TextField
            autoFocus
            onChange={(e) => setIdentifier(e.target.value)}
            value={identifier}
            margin="dense"
            id="identifier"
            label="Document Identifier"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default IdentifierInputDialog;