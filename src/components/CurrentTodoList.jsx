import { DeleteOutlineRounded, Send } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

// import { useTodoList } from '../hooks/useTodoList.js';
// import { useTodoLists } from '../hooks/useTodoLists.js';
import { useAppState } from '../providers/AppState.jsx';

import {
  newItem,
  deleteItem,
  toggleChecked,
  updateItem,
  getListItems,
  getAllTodosListItems
} from '../services/listItemServices.js';
import { updateList, deleteList, getAllLists, getAllTodosListId } from '../services/listServices.js';

export function CurrentTodoList({ isListDeleted, setIsListDeleted, handleListUpdated }) {
  const { currentList, setCurrentList } = useAppState();

  const [data, setData] = useState({});
  const [allTodosListId, setAllTodosListId] = useState();

  const [newItemText, setNewItemText] = useState('');
  const [originalListName, setOriginalListName] = useState('');
  const [originalListItems, setOriginalListItems] = useState({});

  
  // first render
  useEffect(() => {
    async function getInitialData() {
      try {
        const listId = await getAllTodosListId();

        setAllTodosListId(listId);
        setCurrentList(listId);

        const lists = await getAllLists();

        const l = await getAllTodosListItems();
        setData(l)

      } catch (err) { console.log(err) }
    } // getInitialData()
    getInitialData();
    
  }, []);

  // isListDeleted
  useEffect(() => {
    console.log("useEffect([isListDeleted])")
    // const setAllTodosId = async () => {
    //   allTodosListId = await getAllTodosListId();
    // }
    // setAllTodosId();
    if (isListDeleted) {
      console.log("isListDeleted");

      async function setListDeleted() {
        const lists = await getAllLists();
        setCurrentList(lists[0]?.id);
        
        if (currentList != null && currentList === allTodosListId) {
          const newList = await getAllTodosListItems();
          setData(newList);
        } else {
          const newList = await getListItems(lists[0]?.id);
          setData(newList);
        }
        
        
        

      }
      setListDeleted();
    //   getAllLists()
    //     .then((lists) => {
    //       const setListItems = async () => {
    //         return await getListItems(lists[0]?.id); 
    //       }

    //       const newList = setListItems();

    //       setCurrentList(lists[0]?.id);

    //       setData(newList);

    //       if (newList[0]?.name) {
    //         setOriginalListName(newList[0].name);
    //       }
    //   })
      setIsListDeleted(false);
    } // if (isListDeleted)
  }, [isListDeleted])

  // currentList
  useEffect(() => {
    if (currentList != null) {
      const setListItems = async () => {
        const listItems = await getListItems(currentList);
        return listItems;
      }

      const setAllTodosListItems = async () => {
        const listItems = await getAllTodosListItems();
        return listItems;
      }

      if (currentList != null && currentList === allTodosListId) {
        setAllTodosListItems()
          .then((l) => {
            setData(l);

            return l;
          })
          .catch(err => console.log(err))
      } else {
        setListItems()
          .then((l) => {
            setData(l);
            return l;
          })
          .catch(err => console.log(err))
      } // if (currentList != null && currentList === allTodosListId)
    } // if (currentList != null)

  }, [currentList]);

  // data?.name
  useEffect(() => {
    if (data?.name) {
          setOriginalListName(data.name);
    }
  }, [data?.name]);


  // data
  useEffect(() => {

    if (data != null && data?.name) {

      if (data?.name) {
        setOriginalListName(data.name);
      }

      if (data?.items) {
        setOriginalListItems(
          data.items.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {})
        );
      }
    }
  }, [data]);

  function handleUpdateItem(updatedItem) {
    const itemsArray = data.items;
    const idx = itemsArray.findIndex((i) => i._id === updatedItem.id);
    const newItemsArray = itemsArray[idx].name = event.target.value;
    setData((prev) => ({ ...prev, items: newItemsArray }));
  }

  function handleAddItem() {
    const item = newItem(newItemText, currentList)
      .then((newTodo) => {
        const itemsArray = [...data.items];
        if (itemsArray != null) {
          const newItemsArray = [...itemsArray, newTodo];
          setData((prev) => ({ ...prev, items: newItemsArray }))
        }
      })
      .catch(err => console.log(err))

    setNewItemText('');
    return item;
  }

  function handleToggleChecked(id) {
    const idx = data.items.findIndex((i) => i.id === id);
    const itemsArray = [...data.items];
    itemsArray[idx].checked = !itemsArray[idx].checked;
    setData(prev => ({ ...prev, items: itemsArray }));
    return toggleChecked(id, itemsArray[idx].checked);
  }

  // manages list name change
  function onListUpdate(event) {
    if (event.key && event.key === 'Enter') {
      event.preventDefault();
    }
    setData((prev) => ({ ...prev, name: event.target.value }));
    // update lists in AllTosoLists
    handleListUpdated();
    // update list in db
    void updateList(data.id, event.target.value);
  }

  // manages list item update
  function onListItemUpdate(id, event) {
    if (event.key && event.key === 'Enter') {
      event.preventDefault();
    }
    updateItem(id, event.target.value)
      .then((updatedItem) => {
        return handleUpdateItem(updatedItem)
      })
      .catch(err => console.log(err))
  }


  const Icon = Icons[data?.icon];

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ flex: 1 }}>
        {data ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  border: theme => `1px solid ${theme.palette.divider}`,
                  p: 1,
                  mr: 1,
                  borderRadius: '50%',
                  display: 'flex',
                }}
              >
                {Icon ? (
                  <Icon fontSize="large" />
                ) : (
                  <Icons.List fontSize="large" />
                )}
              </Box>
              <TextField
                value={originalListName}
                onChange={event => {
                  setOriginalListName(event.target.value);
                }}
                onBlur={(event) => onListUpdate(event)}
                onKeyDown={(event) => onListUpdate(event)}
              />
            </Box>
            <Divider />
            <List
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                mx: 'auto',
                mt: 2,
              }}
            >
              {data.items != null && data.items.map(({ id, checked }) => {
                const labelId = `checkbox-list-label-${id}`;

                return (
                  <ListItem
                    key={id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          const newItems = data.items.filter(i => i.id !== id);
                          setData(prev => ({ ...prev, items: newItems }));
                          return deleteItem(id);
                        }}
                      >
                        <DeleteOutlineRounded />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={() => handleToggleChecked(id)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked ?? false}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId}>
                        <TextField
                          onClick={e => e.stopPropagation()}
                          onChange={event => {
                            setOriginalListItems({
                              ...originalListItems,
                              [id]: event.target.value,
                            });
                          }}
                          onBlur={event => onListItemUpdate(id, event)}
                          onKeyDown={(event) => onListItemUpdate(id, event)}
                          value={originalListItems[id] ?? ''}
                          size="small"
                          variant="standard"
                        />
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
              <ListItem>
                <Box
                  component="form"
                  sx={{ width: 1 }}
                  onSubmit={event => {
                    event.preventDefault();
                    return handleAddItem();
                  }}
                >
                  <TextField
                    onChange={event => {
                      setNewItemText(event.target.value);
                    }}
                    value={newItemText}
                    margin="normal"
                    id="new-item"
                    label="New Item"
                    type="text"
                    fullWidth
                    variant="filled"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="submit"

                            onClick={() => {
                              document.activeElement.blur();
                              return handleAddItem();
                            }}
                            edge="end"
                          >
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </ListItem>
            </List>
          </>
        ) : (
          <Typography>No List Selected</Typography>
        )}
      </Box>
    </Box>
  );
}
