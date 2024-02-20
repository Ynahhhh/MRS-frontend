import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, Outlet } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
// import LiveTvIcon from '@mui/icons-material/LiveTv';
import WeekendIcon from '@mui/icons-material/Weekend';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    background: '#000',

    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const ListItemIconStyled = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}));



export default function Layout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex',  background:'#efefef', height: '100vh', width: '100vw' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: '#000', color: '#fff' }}>
        <Toolbar>
        <IconButton
          color="primary"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
            <MenuIcon />
          </IconButton>
          
              <Typography variant="h6" noWrap component="div" >
                Movie Reservation System
              </Typography>
         
             
              
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{ style: { backgroundColor: '#212121' } }}
      >
        <DrawerHeader >
          <IconButton onClick={handleDrawerClose} >
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* go to home */}
          <ListItem key='Home' disablePadding>
            <ListItemButton component={Link} to="/"> {/* Use component prop for custom link */}
                <ListItemIconStyled><HomeIcon/></ListItemIconStyled>
                <ListItemTextStyled primary='Home' />
            </ListItemButton>
          </ListItem>

          {/* go to movies */}
          {/* <ListItem key='Movies' disablePadding>
            <ListItemButton component={Link} to="/movies"> 
                <ListItemIconStyled><LiveTvIcon/></ListItemIconStyled>
                <ListItemTextStyled primary='Movies' />
            </ListItemButton>
          </ListItem> */}
        
        
          {/* go to reservation */}
          <ListItem key='Reserve' disablePadding>
            <ListItemButton component={Link} to="/reserve"> 
                <ListItemIconStyled><WeekendIcon/></ListItemIconStyled>
                <ListItemTextStyled primary='Reservation List' />
            </ListItemButton>
          </ListItem>

        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
