import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userRegistration } from '../../../services/userAuth.service'; // Ensure this path is correct

interface RegistrationDialogProps {
  open: boolean;
  onClose: () => void;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({ open, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  const handlePhoneChange = (e: any) => {
    const value = e.target.value;
    setPhone(value);
    if (!/^[0-9]*$/.test(value)) {
      setPhoneError('Phone number must contain only numbers');
    } else {
      setPhoneError('');
    }
  };

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: any) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password && value !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (passwordError || phoneError) {
      return;
    }
    try {
      const result = await userRegistration(JSON.parse(JSON.stringify({ firstName:firstName, lastName:lastName, email:email, phone:phone, password:password })), "");
      if (result.data.status) {
        console.log(result.data.user);
        // Storing user data in localStorage
        //localStorage.setItem('user', JSON.stringify(result.data.user));
        setSnackbarMessage('Registration successful!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onClose();
      } else {
        setSnackbarMessage(result.data.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error(result.data.message);
      }
    } catch (error) {
      setSnackbarMessage('Registration failed. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Registration failed:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h4">Registration</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            variant="standard"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            variant="standard"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            variant="standard"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            variant="standard"
            type="tel"
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            fullWidth
            margin="normal"
            error={!!phoneError}
          />
          {phoneError && (
            <Typography color="error" variant="body2">
              {phoneError}
            </Typography>
          )}
          <TextField
            label="Password"
            variant="standard"
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!passwordError}
          />
          <TextField
            label="Confirm Password"
            variant="standard"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            fullWidth
            margin="normal"
            error={!!passwordError}
          />
          {passwordError && (
            <Typography color="error" variant="body2">
              {passwordError}
            </Typography>
          )}
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!!passwordError || !!phoneError} onClick={handleSubmit}>
              Register
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default RegistrationDialog;
