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
  Chip
} from '@mui/material';


import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import DragHandleIcon from '@mui/icons-material/DragHandle';

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
import { updateList, getAllLists, getAllTodosListId } from '../services/listServices.js';

import PrioritySelect from './PrioritySelect.jsx';

import { priorityData } from '../common/priorities.jsx';


// const priorityData = [
//   { value: 1, name: "Urgent", color: "error.main", chipColor: "error", icon: <PriorityHighIcon /> },
//   { value: 2, name: "Medium", color: "warning.main", chipColor: "warning", icon: <DragHandleIcon /> },
//   { value: 3, name: "Normal", color: "success.main", chipColor: "success", icon: <LowPriorityIcon /> }
// ];

export function CurrentTodoList({ isListDeleted, setIsListDeleted, handleListUpdated }) {
  const { currentList, setCurrentList } = useAppState();

  const [data, setData] = useState({});
  const [allTodosListId, setAllTodosListId] = useState();

  const [newItemText, setNewItemText] = useState('');
  const [originalListName, setOriginalListName] = useState('');
  const [originalListItems, setOriginalListItems] = useState({});
  const [newItemPriority, setNewItemPriority] = useState(3);


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
    if (isListDeleted) {

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

      setIsListDeleted(false);
    }
  }, [isListDeleted])

  // currentList
  useEffect(() => {
    if (currentList != null) {
      async function setCurrentListChange() {
        if (currentList != null && currentList === allTodosListId) {
          const listItems = await getAllTodosListItems();
          setData(listItems);
        } else {
          const listItems = await getListItems(currentList);
          setData(listItems);
        }
      }
      setCurrentListChange();
    }
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

  // events handlers

  function handleUpdateItem(updatedItem, priority) {
    console.log("§§§§§ handleUpdateItem() - updatedItem = ", updatedItem)
    console.log("§§§§§ handleUpdateItem() - priority = ", priority)
    const itemsArray = data.items;
    const idx = itemsArray.findIndex((i) => i._id === updatedItem.id);
    console.log("§§§§§ handleUpdateItem() - idx = ", idx)
    const newItemsArray = [...itemsArray];
    newItemsArray[idx].name = updatedItem.name;
    if (priority != null) {
      newItemsArray[idx].priority = updatedItem.priority;
    }
    console.log("§§§§§ handleUpdateItem() - newItemsArray = ", newItemsArray)
    setData((prev) => ({ ...prev, items: newItemsArray }));
  }

  function handleAddItem() {
    const item = newItem(newItemText, currentList, newItemPriority)
      .then((newTodo) => {
        const itemsArray = [...data.items];
        if (itemsArray != null) {
          const newItemsArray = [...itemsArray, newTodo];
          setData((prev) => ({ ...prev, items: newItemsArray }))
        }
        setNewItemText('');
        setNewItemPriority(1);
      })
      .catch(err => console.log(err))

    return item;
  }

  async function handleToggleChecked(id) {
    const idx = data.items.findIndex((i) => i.id === id);
    const itemsArray = [...data.items];
    itemsArray[idx].checked = !itemsArray[idx].checked;
    setData(prev => ({ ...prev, items: itemsArray }));
    return await toggleChecked(id, itemsArray[idx].checked);
  }

  // manages list name change
  function onListUpdate(event) {
    setData((prev) => ({ ...prev, name: event.target.value }));
    // update lists in AllTosoLists
    handleListUpdated();
    // update list in db
    void updateList(data.id, event.target.value);
  }

  // manages list item name update
  async function onListItemUpdate(id, event) {
    // if (event.key && event.key === 'Enter') {
    //   event.preventDefault();
    // }
    const updatedItem = await updateItem(id, event.target.value, null);
    const returnItem = handleUpdateItem(updatedItem);
    return returnItem;

  }

  // update hook for new item priority
  const onChangePriority = (event) => {
    setNewItemPriority(event.target.value);
  };

  // update hook for update item priority
  const onChangeUpdateItemPriority = async (event, id) => {
    try {
      const idx = data.items.findIndex((i) => i.id === id);
      const newItemsArray = [...data.items];
      newItemsArray[idx].priority = event.target.value;
      setData((prev) => ({ ...prev, items: newItemsArray }));
      const updatedItem = await updateItem(id, null, event.target.value);
      return updatedItem;
    } catch (err) {console.log(err)}

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
                onKeyDown={(event) => {
                  onListUpdate(event);
                  if (event.key === 'Enter') {
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
              {data.items != null && data.items.map(({ id, checked, priority }) => {
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
                      // onClick={() => handleToggleChecked(id)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          onClick={() => handleToggleChecked(id)}
                          edge="start"
                          checked={checked ?? false}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>

                      <ListItemText id={labelId} >
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
                      {/* <Chip
                        label={priorityData.find(p => p.value === priority).name}
                        color={priorityData.find(p => p.value === priority).chipColor}
                        icon={priorityData.find(p => p.value === priority).icon}
                        size="small"
                        sx={{ marginRight: "5px" }}
                        onClick={() => console.log("Chip clicked")}
                      /> */}
                      <PrioritySelect
                        key={`priority-select-${id}`}
                        value={data.items.find(item => item.id === id).priority}
                        onChange={(event) => onChangeUpdateItemPriority(event, id)} />
                    </ListItemButton>
                  </ListItem>
                );
              })}

              {/* Add Item */}
              {(currentList !== allTodosListId) ? (
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

                    <PrioritySelect
                      key="priority-select"
                      value={newItemPriority}
                      onChange={(event) => onChangePriority(event)} />

                  </Box>

                </ListItem>
              ) : (<p></p>)}
            </List>
          </>
        ) : (
          <Typography>No List Selected</Typography>
        )}
      </Box>
    </Box>
  );
}
