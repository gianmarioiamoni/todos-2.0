import * as Icons from '@mui/icons-material';
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

import { AllTodosListItem } from './AllTodosListItem.jsx';

import { useAppState } from '../providers/AppState.jsx';
import { getAllLists, getAllTodosListId, deleteList } from '../services/listServices.js';

import { themeSelection } from "../common/themes";

import { useAuth } from '../hooks/useAuth.jsx';

let allTodosListId = "";

export function AllTodoLists({handleListDelete, isListUpdated, setIsListUpdated}) {
  const [data, setData] = useState([]); // add loading
  const { currentList, setCurrentList } = useAppState();

  const { user } = useAuth();
  
  // USE EFFECTS

  // first render
  useEffect(() => {
    if (!currentList) {
      setCurrentList(data[0]?.id);
    }

    getAllTodosListId()
      .then((listId) => {
        // // getAllTodosListId() returns -1 if an "ALL TODOs" list is not in the db
        // if (listId === -1) {
        //   // add a "ALL TODOs" list to the db
        //   const newTodosList = newList("NEW TODOs", "List", user._id, true);
        //   allTodosListId = newTodosList._id;
        //   return newTodosList._id;
        // }

        allTodosListId = listId;
        handleAllTodosList();
        return listId;
      })
      .catch(err => console.log(err))
  }, []);
    
  // currentList, setCurrentList, isListUpdated
  useEffect(() => {
    if (!currentList) {
      setCurrentList(data[0]?.id);
    }

    if (isListUpdated) {
      handleAllTodosList();
      setIsListUpdated(false);
    }

  }, [currentList, setCurrentList, isListUpdated]);

  function handleAllTodosList() {
    getAllLists(user)
      .then(data => {
        // check if "ALL TODOs" list is the first in the list
        // if (data[0]?._id != allTodosListId) {
        if (data.length > 1 && !data[0]?.isAllTodos) {
          // move "ALL TODOs" list at the top of the array
          const oldListsArray = [...data];
          const idx = oldListsArray.findIndex((l) => l.id === allTodosListId);
          const list = { ...oldListsArray[idx] };

          // remove list from previous position in the array
          const filteredArray = oldListsArray.filter((l) => l.id !== allTodosListId);
          // add list at the top of the array
          const newListArray = [list, ...filteredArray];
          console.log("AllTodoLists - handleAllTodosList() - newListArray: ", newListArray)

          setData(newListArray);

          if (!currentList) {
            setCurrentList(newListArray[0]?.id);
          }
        } else {
          // "ALL TODOs" list is already at the top
          console.log("AllTodoLists - handleAllTodosList() - data: ", data)
          setData(data);

          if (!currentList) {
            setCurrentList(data[0]?.id);
          }
        } 

        return data;
      })
      .catch((err) => console.log(err));
  }

  function isAllTodosList(listId) {
    return (listId === allTodosListId); 
  }

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
          console.log("AllTodoLists() - id: ", id)
          const Icon = Icons[icon];
          if (!isAllTodosList(id)) {
            return (
              <ListItem
                key={id}
                sx={ id === currentList ? (
                {
                  color: themeSelection.palette.secondary.main,
                  backgroundColor: themeSelection.palette.primary.main,
                  fontWeight: 'bold'
                  }
                ) : ({})
                }
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    sx={id === currentList ? (
                      {
                        color: themeSelection.palette.secondary.main,
                        backgroundColor: themeSelection.palette.primary.main,
                        fontWeight: 'bold'
                      }
                    ) : ({})
                    }
                    onClick={() => {
                      // call function in App to manage update of CurrentTodoList
                      handleListDelete();
                      const newLists = data.filter(l => l.id !== id);
                      setData(newLists);
                      setCurrentList(data[0]?.id);
                      return deleteList(id);
                    }}
                  >
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
          } else {
            console.log("AllTodoLists() - AllTodos - id: ", id)
            return <AllTodosListItem
              key={id}
              id={id}
              name={name}
              setCurrentList={setCurrentList}
              currentList={currentList} />
          }
        })}
      </List>
    </Drawer>
  );
}
