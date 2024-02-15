import { Box, CssBaseline } from '@mui/material';

import { useState } from 'react';

import { AppState } from '../providers/AppState.jsx';
import { AllTodoLists } from './AllTodoLists.jsx';
import { AppHeader } from './AppHeader.jsx';
import { CurrentTodoList } from './CurrentTodoList.jsx';


export function App() {
  const [isListDeleted, setIsListDeleted] = useState(false);
  function handleListDelete(id, name) {
    setIsListDeleted(true);
  }

  return (
    <AppState>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppHeader />
        <AllTodoLists handleListDelete={ handleListDelete } />
        <CurrentTodoList isListDeleted={isListDeleted} setIsListDeleted={setIsListDeleted}/>
      </Box>
    </AppState>
  );
}
