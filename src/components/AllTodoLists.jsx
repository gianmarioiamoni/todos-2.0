import * as Icons from '@mui/icons-material';
import { DeleteOutlineRounded } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  IconButton
} from '@mui/material';
import { useState, useEffect } from 'react';

// import { useTodoLists } from '../hooks/useTodoLists.js';
import { useAppState } from '../providers/AppState.jsx';
import { getAllLists, deleteList } from '../services/listServices.js';

import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export function AllTodoLists({handleListDelete}) {
  const [data, setData] = useState([]); // add loading
  const { currentList, setCurrentList } = useAppState();

  useEffect(() => {
  }, []);
    

  useEffect(() => {
    getAllLists()
      .then(data => {
        setData(data)
        if (!currentList) {
          setCurrentList(data[0]?.id);
        }
        return data;
      })
      .catch((err) => console.log(err));

  }, [currentList, data, setCurrentList]);

  return (
    <Drawer
      sx={{
        width: 0.25,
        minWidth: 200,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 0.25,
          minWidth: 200,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/*Empty Toolbar for spacing*/}
      <Toolbar />
      <List>
        {data != null && data.map(({ name, id, icon }) => {
          const Icon = Icons[icon];
          return (
            <ListItem
              key={id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    // call function in App to manage update of CurrentTodoList
                    handleListDelete(id, name);
                    const newLists = data.filter(l => l.id !== id);
                    setData(prev => ([...newLists]));
                    setCurrentList(data[0]?.id);
                    return deleteList(id);
                  }}
                >
                  {/* <DeleteOutlineRounded /> */}
                  <ClearIcon />
                </IconButton>
              }
              disablePadding>
              <ListItemButton
                onClick={() => {
                  setCurrentList(id);
                }}
                selected={currentList === id}
              >
                {Icon ? <Icon /> : <Icons.List />}
                <ListItemText sx={{ ml: 0.5 }} primary={name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
