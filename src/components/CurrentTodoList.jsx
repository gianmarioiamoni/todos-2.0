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
  getListItems
} from '../services/listItemServices.js';
import { updateList, deleteList, getAllLists, getAllTodosListId } from '../services/listServices.js';

export function CurrentTodoList({isListDeleted, setIsListDeleted}) {
  const { currentList, setCurrentList } = useAppState();
  
  const [data, setData] = useState({});

  let allTodosListId;
  
  // const { updateList } = useTodoLists();
  const [newItemText, setNewItemText] = useState('');
  const [originalListName, setOriginalListName] = useState('');
  const [originalListItems, setOriginalListItems] = useState({});

  // USE EFFECTS

  // first render
  useEffect(() => {
    getAllTodosListId()
      .then((listId) => {
        // getAllTodosListId() returns -1 if an "ALL TODOs" list is not in the db
        if (listId === -1) {
          // add a "ALL TODOs" list to the db
          return;
        }
        allTodosListId = listId;

        getAllLists()
          .then((lists) => {
            // setCurrentList(allTodosListId);
            console.log("^^^^^ useEffect [] - lists = ", lists)

            setCurrentList(lists[0]?.id);

            const setListItems = async () => {
              // return await getListItems(lists[0]?.id, allTodosListId);
              // return await getListItems(currentList, allTodosListId);
              const listItems = await getListItems(lists[0]?.id, allTodosListId);
              console.log("///// setListItems() - lists[0]?.id: ", lists[0]?.id);
              console.log("///// setListItems() - currentList: ", currentList);
              console.log("///// setListItems() - allTodosListId: ", allTodosListId);
              console.log("///// setListItems() - listItems: ", listItems);

              return listItems;

            }
            // getAllTodosListId()
            //   .then((listId) => {
            //     // getAllTodosListId() returns -1 if an "ALL TODOs" list is not in the db
            //     allTodosListId = listId;
            //     return listId;
            //   })
            //   .catch(err => console.log(err))
            const newList = setListItems();
            console.log("^^^^^ useEffect [] - allTodosListId = ", allTodosListId);
            console.log("^^^^^ useEffect [] - newList = ", newList)

            // setCurrentList(lists[0]?.id);
            // setCurrentList(allTodosListId);
            setCurrentList(newList.id);

            // const idx = newList.findIndex((l) => l.id === allTodosListId)

            setData(newList);

            // setOriginalListItems(newList.items)

            if (newList[0]?.name) {
              setOriginalListName(newList[0].name);
            }
            // if (newList[idx].name) {
            //   setOriginalListName(newList[idx].name);
            // }
            return data;
          })
      })
  }, []);

  // isListDeleted
  useEffect(() => { 
    // // const setAllTodosId = async () => {
    // //   allTodosListId = await getAllTodosListId();
    // // }
    // // setAllTodosId();
    // if (isListDeleted) {
    //   getAllLists()
    //     .then((lists) => {
    //       const setListItems = async () => {
    //         return await getListItems(lists[0]?.id, allTodosListId); 
    //         // return await getListItems(currentList, allTodosListId); 
    //       }
          
    //       // getAllTodosListId()
    //       //   .then((listId) => {
    //       //     // getAllTodosListId() returns -1 if an "ALL TODOs" list is not in the db
    //       //     allTodosListId = listId;
    //       //     return listId;
    //       //   })
    //       //   .catch(err => console.log(err))
    //       console.log("useEffect [] - getAllLists()" )
    //       const newList = setListItems();
          
    //       // const idx = newList.findIndex((l) => l.id === allTodosListId)
    //       // if (newList[idx].name) {
    //       //   setOriginalListName(newList[idx].name);
    //       // }
    //       setCurrentList(lists[0]?.id);
    //       setCurrentList(newList[idx]?.id);

    //       setData(newList);

    //       if (newList[0]?.name) {
    //         setOriginalListName(newList[0].name);
    //       }
    //   })
    //   setIsListDeleted(false);
    // }
  }, [isListDeleted])
  
  // currentList, data?.name
  useEffect(() => {
    // const setAllTodosId = async () => {
    //   allTodosListId = await getAllTodosListId();
    // }
    // setAllTodosId();
    // const listId = await getAllTodosListId();
    getListItems(currentList, allTodosListId)
      .then(currListItems => {
        setData(currListItems);

        setCurrentList(currListItems.id);

        if (data?.name) {
          setOriginalListName(data.name);
        }
        return data;
      })
    .catch(err => console.log(err))
  }, [currentList, data?.name]);

  // data
  useEffect(() => {
    const setAllTodosId = async () => {
      allTodosListId = await getAllTodosListId();
    }
    setAllTodosId();

    if (data?.items) {
      setOriginalListItems(
        data.items.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {})
      );
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
                onBlur={event => {
                  setData((prev) => ({ ...prev, name: event.target.value }));
                  void updateList(data.id, event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    setData((prev) => ({ ...prev, name: event.target.value }));
                    void updateList(data.id, event.target.value);
                    event.preventDefault();
                  }
                }}
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
                      onClick={() => handleToggleChecked(id) }
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
                          onBlur={event => {
                            updateItem(id, event.target.value)
                              .then((updatedItem) =>
                                handleUpdateItem(updatedItem)
                              )
                            .catch(err => console.log(err))
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              updateItem(id, event.target.value)
                                .then((updatedItem) => {
                                  return handleUpdateItem(updatedItem)
                                })
                                .catch(err => console.log(err))
                            }
                          }}
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
