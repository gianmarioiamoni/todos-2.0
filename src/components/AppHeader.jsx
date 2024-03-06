import { Add, Person, SettingsSuggestRounded } from '@mui/icons-material';
import { AppBar, IconButton, Button, Link, Toolbar, Typography } from '@mui/material';
import { usePopupState } from 'material-ui-popup-state/hooks';

import { NewListDialog } from './NewListDialog.jsx';
import LogoutButton from './user/LogoutButton.jsx';
import LogoutSet from './user/LogoutSet.jsx';


export function AppHeader({handleListUpdated, handleLogout, user}) {
  const dialogState = usePopupState({ variant: 'dialog', popupId: 'new-list' });

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
            startIcon={<Add />}
            color="inherit"
            sx={{ mr: 1 }}
            onClick={dialogState.open}
          >
            Add List
          </Button>
          {/* <Button
            startIcon={<Person />}
            color="inherit"
            sx={{ mr: 1 }}
          >
            {user.username}
          </Button>
          <LogoutButton onClick={handleLogout} /> */}
          <LogoutSet user={user} handleLogout={handleLogout}/>
        </Toolbar>
      </AppBar>
    </>
  );
}
