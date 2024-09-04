import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Drawer,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from '@mui/icons-material/Home';

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });


function HeaderComponent() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(true);


  const [pages, setPages] = React.useState<string[]>(["Home", "Product", "Users", "Posts", "Login"]);
  const location = useLocation();
  const navigate = useNavigate();

  // This will run once when the component mounts
  React.useEffect(() => {
    //Taking user object from local storage
    const user:any = JSON.parse(localStorage.getItem("user")!);
    setPages(["Home", "Product", "Posts"]); // set default pages
    // check if user is not logged in we will add Login page to header 
    if(user === null && !pages.includes('Login')){
      // we are using spread operator to get previous pages ["Home", "Users", "Posts"] and adding Login page in this array.
      setPages((prevPages) => [...prevPages, 'Login']);
    }

    // Update the pages state to include "Users" page only if the user is logged in
    if (user && user.userType === 'admin') {
      setPages((prevPages) => [...prevPages, "Users"]);
    }

  //   const timer = setInterval(() => {
  //     setProgress((oldProgress) => {
  //       if (oldProgress === 100) {
  //         clearInterval(timer);
  //         setLoading(false); // Set loading to false once progress reaches 100
  //         return 100;
  //       }
  //       const diff = Math.random() * 10;
  //       return Math.min(oldProgress + diff, 100);
  //     });
  //   }, 200); // 200 meaning 0.2 mili second

  //   return () => {
  //     clearInterval(timer);
  //   };

  }, [location]);

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  const routeChange = (path: string) => {
    navigate(path);
  };

  const handleCloseNavMenu = (page: string) => {
    switch (page) {
      case "Home":
        routeChange("/");
        break;
      case "Users":
        routeChange("/user");
        break;
      case "Posts":
        routeChange("/post");
        break;
      case "Product":
        routeChange("/product");
        break;
      case "Login":
        routeChange("/auth/login");
        break;
    }
    setAnchorElNav(null);
  };

  const handleRefresh = () => {
    window.location.reload(); // Refreshes the page
  };

  const handleCloseUserMenu = (e: any) => {
    if (e.target.innerHTML === "Logout") {
      localStorage.removeItem("user");
      navigate("/auth/login");
    }
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (location.pathname.includes("auth")) {
    return <></>;
  } else {
    return (
      <>
      <AppBar position="static"
      sx={{ 
        backgroundColor: '#FFFDD0',
        boxShadow:"none",
        borderBottom: '1px solid gold', // Slim border
      }}>
        {/* <Box sx={{ width: '100%',color:"#000000" }}>
              <LinearProgress variant="buffer" value={progress} />
            </Box> */}
        <Container maxWidth="xl" sx={{marginTop:"1.5%", marginBottom:"0.5%"}}>
        <Toolbar disableGutters>
          {/* Logo */}
          <Box>
          <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{color:"black"}}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src="https://dolcino.qodeinteractive.com/wp-content/uploads/2018/11/logo-img-1.png" alt="Cake Shop Logo" style={{ height: 50, marginLeft:"5%" , marginRight: '5%' }} />
            <img src="https://cakeart.thimpress.com/wp-content/uploads/2016/01/logo.png" alt="Cake shop"
            onClick={handleRefresh} // Added onClick event handler
            style={{ cursor: 'pointer' }} // Optional: show pointer cursor to indicate clickability
          />
          </Box>
          {/* <Box>
          Search and Menu Icons
          <IconButton size="large" color="inherit" sx={{marginLeft:"10%", justifyContent:"center"}}>
              <SearchIcon />
            </IconButton>
          </Box> */}

          {/* Navigation Menu for larger screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  my: 2,
                  color: 'Black',
                  display: 'block',
                  fontSize: '18px',
                  fontFamily:"Roboto Slab",
                  fontWeight: "600",
                  // color: location.pathname.includes(page.toLowerCase()) ? '#ff4d94' : 'black', // Change color based on current page
                  '&:hover': {
                    color: '#ff4d94', // Change the font color on hover
                  },
                }}
              >
                {page}
              </Button>
            ))}

          </Box>
          
            {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Blog Posts
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box> */}

            {/* <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton> */}

            <Box sx={{ flexGrow: 0, marginLeft:"5%" }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            
          </Toolbar>
        </Container>
        
      </AppBar>

      <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerToggle}
    >
      <Box
        sx={{ width: 300,backgroundColor: '#FFFDD0',height: '100%', marginTop:"25%"}} // Ensure the color covers the full height
        role="presentation"
        onClick={handleDrawerToggle}
        onKeyDown={handleDrawerToggle}
      >
        {pages.map((page) => (
          <MenuItem key={page} onClick={() => handleCloseNavMenu(page) }>
            <Typography textAlign="center" sx={{fontFamily:"Roboto Slab", fontSize:"18px" }}>{page}</Typography>
          </MenuItem>
        ))}
      </Box>
    </Drawer>
  </>
      
    );
  }
}

// function App() {
//   const [mode, setMode] = React.useState<'light' | 'dark'>('light');
//   const colorMode = React.useMemo(
//     () => ({
//       toggleColorMode: () => {
//         setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//       },
//     }),
//     [],
//   );

//   const theme = React.useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//         },
//       }),
//     [mode],
//   );

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <HeaderComponent />
//         {/* Other components go here */}
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

export default HeaderComponent;
