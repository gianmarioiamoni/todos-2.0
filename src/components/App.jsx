import { Box, CssBaseline } from '@mui/material';

import { useState } from 'react';

import { AppState } from '../providers/AppState.jsx';
import { AllTodoLists } from './AllTodoLists.jsx';
import { AppHeader } from './AppHeader.jsx';
import { CurrentTodoList } from './CurrentTodoList.jsx';


export function App() {
  const [isListDeleted, setIsListDeleted] = useState(false);
  const [isListAdded, setIsListAdded] = useState(false);

  function handleListDelete() {
    setIsListDeleted(true);
  }

  function handleListAdded(id, name) {
    setIsListAdded(true);
  }

  return (
    <AppState>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppHeader handleListAdded={handleListAdded} />
        <AllTodoLists
          handleListDelete={handleListDelete}
          setIsListAdded={setIsListAdded} isListAdded={isListAdded} />
        <CurrentTodoList isListDeleted={isListDeleted} setIsListDeleted={setIsListDeleted}/>
      </Box>
    </AppState>
  );
}
