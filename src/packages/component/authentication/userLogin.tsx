import React, { useEffect, useState } from "react";
import { TextField, Button, Link, Box, Typography, Snackbar, Alert  } from "@mui/material";
import RegistrationDialog from "../authentication/userRegistration"; // Adjust the import path as needed
import {userLogin} from "../../../services/userAuth.service";
import { useNavigate } from "react-router-dom";
import { getUserInfoFromLS } from "../../helpers/localStorage.hapler";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
const [errorMessage, setErrorMessage] = useState('');

    // this wil call once when component will mount and we are checking if user is logged in we will redirect to the home page.
    useEffect(() => {
      const user = getUserInfoFromLS();
      if (user) {
        navigate('/');
      }
    }, []);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    try{
    // we are triggering userLogin API to validate the user
    const result = await userLogin({emailOrPhone: emailOrPhone, password: password},"");
    if (result.data.status) {
        //storing user data in localstorage.
        localStorage.setItem('user', JSON.stringify(result.data.user));
        setSnackbarMessage('Login successful');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate('/');
      } else {
        setSnackbarMessage(result.data.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Login failed. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const openRegistrationDialog = () => {
    setIsDialogOpen(true);
  };

  const closeRegistrationDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        boxShadow: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: '16px',
        // minHeight: '100vh',
        margin: '12.5% 30% 12.5% 30%',
        alignContent: 'center',
        p: 3,
        backgroundColor: 'white'
      }}
    >
      <Typography variant="h4" gutterBottom
      sx={{marginTop:'10px'}}>
        Login
      </Typography>
      <Box
        component="form"
        sx={{
          width: "100%",
          maxWidth: 450,
          display: "flex",
        //   marginLeft:'10vh',
        //   marginRight:'10vh',
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Email or Phone Number"
          variant="standard"
          name="emailOrPhone"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          variant="standard"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Box justifyContent={'center'} display={'flex'} alignItems={'center'} gap={3}>
            <Button variant="outlined" color="primary" type="button" onClick={handleSubmit}>Submit</Button>
            <Button variant="outlined" color="primary" type="submit" onClick={() => navigate('/')}>Cancel</Button>
        </Box>
        <Typography>{errorMessage}</Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openRegistrationDialog();
            }}
            variant="body2"
          >
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
      <RegistrationDialog
        open={isDialogOpen}
        onClose={closeRegistrationDialog}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
        </Snackbar>
    </Box>
    
  );
};

export default Login;
