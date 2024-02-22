import { Box, CssBaseline } from '@mui/material';

import { useState } from 'react';

import { AppState } from '../providers/AppState.jsx';
import { AllTodoLists } from './AllTodoLists.jsx';
import { AppHeader } from './AppHeader.jsx';
import { CurrentTodoList } from './CurrentTodoList.jsx';


export function App() {
  const [isListDeleted, setIsListDeleted] = useState(false);
  const [isListUpdated, setIsListUpdated] = useState(false);

  function handleListDelete() {
    setIsListDeleted(true);
  }

  function handleListUpdated() {
    setIsListUpdated(true);
  }


  return (
    <AppState>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppHeader handleListUpdated={handleListUpdated} />
        <AllTodoLists
          handleListDelete={handleListDelete}
          setIsListUpdated={setIsListUpdated} isListUpdated={isListUpdated} />
        <CurrentTodoList
          isListDeleted={isListDeleted}
          setIsListDeleted={setIsListDeleted} 
          handleListUpdated={handleListUpdated}
          />
        </Box>
      
      </AppState>
  );
}
