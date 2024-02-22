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

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


import { useEffect, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';

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
import SortRadioButtonGroup from './SortRadioButtonGroup.jsx';

import { priorityData, sortItems } from '../common/priorities.jsx';
import { HighlightedText } from "../common/themes.jsx";


export function CurrentTodoList({ isListDeleted, setIsListDeleted, handleListUpdated }) {
  const { currentList, setCurrentList } = useAppState();

  const [data, setData] = useState({});
  const [allTodosListId, setAllTodosListId] = useState();

  const [newItemText, setNewItemText] = useState('');
  const [originalListName, setOriginalListName] = useState('');
  const [originalListItems, setOriginalListItems] = useState({});
  const [newItemPriority, setNewItemPriority] = useState(3);
  // const [isPriorityEdit, setPriorityIsEdit] = useState([]);
  const [isEdit, setIsEdit] = useState([]);

  const [sortSelection, setSortSelection] = useState("Priority+Date");
  const [isCheckedTodayItems, setIsCheckedTodayItems] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);

  // USE EFFECTS

  // first render
  useEffect(() => {
    async function getInitialData() {
      try {
        const listId = await getAllTodosListId();

        setAllTodosListId(listId);
        setCurrentList(listId);

        const lists = await getAllLists();

        const l = await getAllTodosListItems();
        setData(l);

        l.items.map(item => setIsEdit(prev => [...prev, {id: item.id, priorityEdit: false, dateEdit: false}]))

      } catch (err) {console.log(err)}
    } 
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

  // EVENTS HANDLERS

  function handleUpdateItem(updatedItem, priority) {
    const itemsArray = data.items;
    const idx = itemsArray.findIndex((i) => i._id === updatedItem.id);
    const newItemsArray = [...itemsArray];
    newItemsArray[idx].name = updatedItem.name;
    if (priority != null) {
      newItemsArray[idx].priority = updatedItem.priority;
    }
    setData((prev) => ({ ...prev, items: newItemsArray.sort((a, b) => sortItems(a, b, sortSelection)) }));
  }

  function handleAddItem() {
    const item = newItem(newItemText, currentList, newItemPriority, selectedDate)
      .then((newTodo) => {
        const itemsArray = [...data.items];
        if (itemsArray != null) {
          const newItemsArray = [...itemsArray, newTodo];
          setData((prev) => ({ ...prev, items: newItemsArray.sort((a, b) => sortItems(a, b, sortSelection)) }))
        }
        // setIsPriorityEdit(prev => [...prev, { id: item.id, editable: false}])
        setIsEdit(prev => [...prev, { id: item.id, priotiyEdit: false, dateEdit: false}])
        setNewItemText('');
        setNewItemPriority(1);
      })
      .catch(err => console.log(err))

    return item;
  }

  function onClickDeleteItem(id) {
      const newItems = data.items.filter(i => i.id !== id);
    setData(prev => ({ ...prev, items: newItems }));
    // const newIsPriorityEdit = isPriorityEdit.filter(i => i.id !== id);
    // const newIsPriorityEdit = isEdit.filter(i => i.id !== id);
    const newIsEdit = isEdit.filter(i => i.id !== id);
    // setIsPriorityEdit(newIsPriorityEdit);
    setIsEdit(newIsEdit);
      return deleteItem(id);
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

    // params: id, name, priority, date
    const updatedItem = await updateItem(id, event.target.value, null, null);
    const returnItem = handleUpdateItem(updatedItem, null);
    return returnItem;

  }

  // PRIORITY

  // update hook for new item priority
  const onChangePriority = (event) => {
    setNewItemPriority(event.target.value);
  };

  // update hook for update item priority
  const onChangeUpdateItemPriority = async (event, id) => {
    try {
      toggleIsPriorityEdit(id);
      const idx = data.items.findIndex((i) => i.id === id);
      const newItemsArray = [...data.items];
      newItemsArray[idx].priority = event.target.value;
      setData((prev) => ({ ...prev, items: newItemsArray.sort((a, b) => sortItems(a, b, sortSelection)) }));
      // params: id, name, priority, date
      const updatedItem = await updateItem(id, null, event.target.value, null);
      return updatedItem;
    } catch (err) {console.log(err)}

  }

  // update hook for update item date
  const onChangeUpdateItemDate = async (date, id) => {
    console.log("**** onChangeUpdateItemDate() - date: ", date)
    console.log("**** onChangeUpdateItemDate() - id: ", id)
    setSelectedDate(date);
    try {
      toggleIsDateEdit(id);
      const idx = data.items.findIndex((i) => i.id === id);
      const newItemsArray = [...data.items];
      newItemsArray[idx].date = date;
      setData((prev) => ({ ...prev, items: newItemsArray.sort((a, b) => sortItems(a, b, sortSelection)) }));
      // params: id, name, priority, date
      const updatedItem = await updateItem(id, null, null, date);
      setSelectedDate(new Date());
      return updatedItem;
    } catch (err) { console.log(err) }

  }

  // function getPriorityId(id) {
  function getEditId(id) {
    // return isPriorityEdit.findIndex(i => i.id === id);
    return isEdit.findIndex(i => i.id === id);
  }

  function toggleIsPriorityEdit(id) {
    // const idx = getPriorityId(id);
    const idx = getEditId(id);
    // const newIsPriorityEdit = [...isPriorityEdit];
    const newIsEdit = [...isEdit];
    // newIsPriorityEdit[idx].editable = !newIsPriorityEdit[idx].editable;
    newIsEdit[idx].priorityEdit = !newIsEdit[idx].priorityEdit;
    const newData = { ...data };
    setData(newData)
  }

  function toggleIsDateEdit(id) {
    console.log("^^^^ toggleIsDateEdit() - id = ", id )
    // const idx = getPriorityId(id);
    const idx = getEditId(id);
    // const newIsPriorityEdit = [...isPriorityEdit];
    const newIsEdit = [...isEdit];
    // newIsPriorityEdit[idx].editable = !newIsPriorityEdit[idx].editable;
    newIsEdit[idx].dateEdit = !newIsEdit[idx].dateEdit;
    console.log("^^^^ toggleIsDateEdit() - newIsEdit = ", newIsEdit)
    
    const newData = { ...data };
    setData(newData)
  }

  // dates
  const handleDateChange = (date) => {
    console.log("+++handleDateChange() - date: ", date)
    setSelectedDate(date);
  };

  // sorting
  const onChangeSort = (event) => {
    console.log("onChangeSort() - event.target.value: ", event.target.value)
    setSortSelection(event.target.value);
    let newDataItems = [...data.items];
    if (newDataItems != null) {
      const sortedDataItems = newDataItems.sort((a, b) => sortItems(a, b, event.target.value));
      setData(prev => ({ ...prev, items: sortedDataItems }));
    }
  }

  // filtering today's items
  const onChangeTodayItems = async (event) => {
    setIsCheckedTodayItems(event.target.checked);
    if (event.target.checked && data.items != null) {
      // filter data items array
      const newDataItems = data.items.filter((item) => dayjs(item.date).format('DD/MM/YYYY') === dayjs(new Date()).format('DD/MM/YYYY'));
      setData((prev) => ({...prev, items: [...newDataItems]}))
    } else {
      // restore full data items array
      if (currentList != null && currentList !== allTodosListId) {
        const newList = await getListItems(currentList);
        setData( newList );
      } else {
        const newList = await getAllTodosListItems();
        setData( newList );
      }
    }
  }

  // item
  function getItemData(id) {
    return data.items?.find(item => item.id === id);
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
                  if (event.key === 'Enter') {
                    event.preventDefault();
                  }
                  onListUpdate(event);
                  
                }}
              />
            </Box>

            {/* Sorting and filtering */}
            <Grid container spacing={2}>
              <Grid xs={4}>
                {/* Sorting */}
                <SortRadioButtonGroup value={sortSelection || ''} onChange={onChangeSort} />
              </Grid>
              <Grid xs={4}>
                {/* Show Today items only */}
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isCheckedTodayItems}
                        onChange={onChangeTodayItems} />
                    }
                    label="Today's items" 
                    />
                </FormGroup>
              </Grid>
            </Grid>

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
                        onClick={() => onClickDeleteItem(id)}
                      >
                        <DeleteOutlineRounded />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      role={undefined}
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
                          // onKeyDown={(event) => {
                          //   if (event.key && event.key === 'Enter') {
                          //     event.preventDefault();
                          //   }
                          //   onListItemUpdate(id, event);
                          // }}
                          value={originalListItems[id] ?? ''}
                          size="small"
                          fullWidth
                          variant="standard"
                          sx={{pr: "10px"}}
                        />
                      </ListItemText>

                      {/* Show and edit Priority  */}
                      {/* {(!isPriorityEdit[getPriorityId(id)]?.editable) ? ( */}
                      {(!isEdit[getEditId(id)]?.priorityEdit) ? (
                        <Chip
                          label={priorityData.find(p => p.value === priority).name}
                          color={priorityData.find(p => p.value === priority).chipColor}
                          icon={priorityData.find(p => p.value === priority).icon}
                          size="small"
                          sx={{ marginRight: "5px" }}
                          onClick={() => toggleIsPriorityEdit(id)}
                        />
                      ) : (
                        <PrioritySelect
                          key={`priority-select-${id}`}
                          value={data.items.find(item => item.id === id).priority}
                          onChange={(event) => onChangeUpdateItemPriority(event, id)}
                          isLabelVisible={false} />
                      )}

                      {/* Show and edit date */}
                      {(!isEdit[getEditId(id)]?.dateEdit) ? (
                        <div >
                          {(dayjs(getItemData(id).date).format('DD/MM/YYYY') === dayjs(new Date()).format('DD/MM/YYYY')) ? (
                            <HighlightedText
                              onClick={() => toggleIsDateEdit(id)}
                              variant="body1">
                              {/* {dayjs((data.items?.find(item => item.id === id).date)).format('DD/MM/YYYY')} */}
                              {dayjs(getItemData(id).date).format('DD/MM/YYYY')}
                            </HighlightedText>
                          ) : (
                            <Typography
                              onClick={() => toggleIsDateEdit(id)}
                              variant="body1"
                              sx={{ mx: "20px", p: '4px 8px' }}>
                              {dayjs(getItemData(id).date).format('DD/MM/YYYY')}
                            </Typography>
                          )}
                        </div>
                      ) : (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Choose an expiring date"
                              value={selectedDate}
                              onChange={(date) => onChangeUpdateItemDate(date, id)}
                              // renderInput={(params) => <TextField {...params} />}
                              slotProps={{ textField: { variant: 'outlined' } }}
                            />
                          </LocalizationProvider>
                        )}

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
                    {/* New Item name and send button */}
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
                    <Grid container spacing={2}>
                      <Grid xs={4}>
                        {/* Add Priority */}
                        <PrioritySelect
                          key="priority-select"
                          value={newItemPriority}
                          onChange={(event) => onChangePriority(event)} />
                      </Grid>
                      <Grid xs={4}>
                        {/* Add date */}
                        <div>
                          {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Choose an expiring date"
                              value={selectedDate}
                              onChange={handleDateChange}
                              // renderInput={(params) => <TextField {...params} />}
                              slotProps={{ textField: { variant: 'outlined' } }}
                            />
                          </LocalizationProvider>
                        </div>
                      </Grid>
                    </Grid>
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
