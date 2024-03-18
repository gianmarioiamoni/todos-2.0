import { Add, Home } from '@mui/icons-material';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { usePopupState } from 'material-ui-popup-state/hooks';

import { NewListDialog } from './NewListDialog.jsx';
import LogoutSet from './user/utils/LogoutSet.jsx'; 
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.jsx';


export function AppHeader({ handleListUpdated, handleLogout }) {
  const dialogState = usePopupState({ variant: 'dialog', popupId: 'new-list' });
  const navigate = useNavigate();

  const { user } = useAuth();

  return (
    <>
      <NewListDialog dialogState={dialogState} handleListUpdated={handleListUpdated} />
      <AppBar
        position="fixed"
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Lists
          </Typography>
          <Button
            startIcon={<Home />}
            color="inherit"
            sx={{ ml: 1 }}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            startIcon={<Add />}
            color="inherit"
            sx={{ mr: 1 }}
            onClick={dialogState.open}
          >
            Add List
          </Button>

          <LogoutSet handleLogout={handleLogout} />
          
        </Toolbar>
      </AppBar>
    </>
  );
}
