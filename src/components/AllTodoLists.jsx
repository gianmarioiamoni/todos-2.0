import * as Icons from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { useState, useEffect } from 'react';

import { useTodoLists } from '../hooks/useTodoLists.js';
import { useAppState } from '../providers/AppState.jsx';
import { getAllLists } from '../services/listServices.js';

import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export function AllTodoLists() {
  const [data, setData] = useState([]); // add loading
  const { currentList, setCurrentList } = useAppState();

  useEffect(() => {
    axios.get(serverUrl + "/lists")
      .then((data) => {
        setData(data?.data);
      })
      .catch((err) => console.log(err));
  }, []);
    

  useEffect(() => {
    axios.get(serverUrl + "/lists")
      .then((data) => {
        setData(data?.data);
        if (!currentList) {
          setCurrentList(data.data[0]?.id);
        }

      })
      .catch((err) => console.log(err));
    // const getNewList = () => getAllLists();
    // const newLists = getNewList();
    // setData(newLists);

    // if (!currentList) {
    //   setCurrentList(newLists[0]?.id);
    // }
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
            <ListItem key={id} disablePadding>
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
