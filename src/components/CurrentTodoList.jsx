import { DeleteOutlineRounded } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';

import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

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

import SortingAndFilteringTool from './listitems/SortingAndFilteringTool.jsx';
import ShowAndEditPriority from './listitems/ShowAndEditPriority.jsx';
import ShowAndEditDate from './listitems/ShowAndEditDate.jsx';
import NewItemNameSubmit from './listitems/NewItemNameSubmit.jsx';
import NewItemPriorityAndDate from './listitems/NewItemPriorityAndDate.jsx';
import CurrentListNameAndIcon from './list/CurrentListNameAndIcon.jsx';

import { sortItems } from '../common/priorities.jsx';

import { useAuth } from '../hooks/useAuth.jsx';


export function CurrentTodoList({ isListDeleted, setIsListDeleted, handleListUpdated }) {
  const { currentList, setCurrentList } = useAppState();

  const [data, setData] = useState({});
  // const [allTodosListId, setAllTodosListId] = useState();

  const [newItemText, setNewItemText] = useState('');
  const [originalListName, setOriginalListName] = useState('');
  const [originalListItems, setOriginalListItems] = useState({});
  const [newItemPriority, setNewItemPriority] = useState(3);
  const [isEdit, setIsEdit] = useState([]);

  const [sortSelection, setSortSelection] = useState("Priority+Date");
  const [isCheckedTodayItems, setIsCheckedTodayItems] = useState(false);

  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));

  const { user } = useAuth();

  let allTodosListId;


  // USE EFFECTS

  // first render
  useEffect(() => {
    async function getInitialData() {
      try {
        const listId = await getAllTodosListId();

        // setAllTodosListId(listId);
        allTodosListId = listId;
        setCurrentList(listId);

        console.log("CurrentTodoList() - useEffect([]) - listId: ", listId)
        console.log("CurrentTodoList() - useEffect([]) - allTodoslistId ", allTodosListId)

        const lists = await getAllLists(user);

        const l = await getAllTodosListItems(user);
        setData(l);

        l.items.map(item => setIsEdit(prev => [...prev, { id: item.id, priorityEdit: false, dateEdit: false }]))

      } catch (err) { console.log(err) }
    }
    getInitialData();

  }, []);

  // isListDeleted
  useEffect(() => {
    if (isListDeleted) {

      async function setListDeleted() {
        const lists = await getAllLists(user);
        setCurrentList(lists[0]?.id);

        if (currentList != null && currentList === allTodosListId) {
          const newList = await getAllTodosListItems(user);
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
          const listItems = await getAllTodosListItems(user);
          setData(listItems);
        } else {
          const listItems = await getListItems(currentList);
          setData(listItems);
        }
      }
      setCurrentListChange();
    }
    console.log("§§§§ CurrentTodoList() - useEffect([currentList]) - currentList: ", currentList)
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
    const item = newItem(newItemText, currentList, user._id, newItemPriority, selectedDate)
      .then((newTodo) => {
        const itemsArray = [...data.items];
        if (itemsArray != null) {
          const newItemsArray = [...itemsArray, newTodo];
          setData((prev) => ({ ...prev, items: newItemsArray.sort((a, b) => sortItems(a, b, sortSelection)) }))
        }
        setIsEdit(prev => [...prev, { id: item.id, priotiyEdit: false, dateEdit: false }])
        setNewItemText('');
        setNewItemPriority(3);
        setSelectedDate(dayjs(new Date()))
      })
      .catch(err => console.log(err))

    return item;
  }

  function onClickDeleteItem(id) {
    const newItems = data.items.filter(i => i.id !== id);
    setData(prev => ({ ...prev, items: newItems }));
    const newIsEdit = isEdit.filter(i => i.id !== id);
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
    } catch (err) { console.log(err) }

  }

  // update hook for update item date
  const onChangeUpdateItemDate = async (date, id) => {
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

  function getEditId(id) {
    return isEdit.findIndex(i => i.id === id);
  }

  function toggleIsPriorityEdit(id) {
    const idx = getEditId(id);
    const newIsEdit = [...isEdit];
    newIsEdit[idx].priorityEdit = !newIsEdit[idx].priorityEdit;
    const newData = { ...data };
    setData(newData)
  }

  function toggleIsDateEdit(id) {
    const idx = getEditId(id);
    const newIsEdit = [...isEdit];
    newIsEdit[idx].dateEdit = !newIsEdit[idx].dateEdit;

    const newData = { ...data };
    setData(newData)
  }

  // dates
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // sorting
  const onChangeSort = (event) => {
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
      setData((prev) => ({ ...prev, items: [...newDataItems] }))
    } else {
      // restore full data items array
      if (currentList != null && currentList !== allTodosListId) {
        const newList = await getListItems(currentList);
        setData(newList);
      } else {
        const newList = await getAllTodosListItems(user);
        setData(newList);
      }
    }
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ flex: 1 }}>
        {data ? (
          <>
            {/* List name show and edit, plus icon */}
            <CurrentListNameAndIcon 
              originalListName={originalListName}
              setOriginalListName={setOriginalListName}
              onListUpdate={onListUpdate}
              icon={data.icon}
            />

            {/* Sorting and filtering */}
            <SortingAndFilteringTool
              sortSelection={sortSelection}
              onChangeSort={onChangeSort}
              isCheckedTodayItems={isCheckedTodayItems || false}
              onChangeTodayItems={onChangeTodayItems}
            />

            <Divider />

            {/* Current Todos list */}
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

                // list item
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
                          value={originalListItems[id] ?? ''}
                          size="small"
                          fullWidth
                          variant="standard"
                          sx={{ pr: "10px" }}
                        />
                      </ListItemText>

                      {/* Show and edit Priority  */}
                      <ShowAndEditPriority 
                        id={id}
                        priority={priority}
                        data={data}
                        isEdit={isEdit}
                        toggleIsPriorityEdit={toggleIsPriorityEdit}
                        onChangeUpdateItemPriority={onChangeUpdateItemPriority}
                      />

                      {/* Show and edit date */}
                      <ShowAndEditDate
                        id={id}
                        data={data}
                        isEdit={isEdit}
                        toggleIsDateEdit={toggleIsDateEdit}
                        selectedDate={selectedDate}
                        onChangeUpdateItemDate={onChangeUpdateItemDate}
                      />

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
                    {/* New Item name and submit button */}
                    <NewItemNameSubmit 
                      setNewItemText={setNewItemText}
                      newItemText={newItemText}
                      handleAddItem={handleAddItem}
                    />

                    {/* New item priority and date */}
                    <NewItemPriorityAndDate 
                      newItemPriority={newItemPriority}
                      onChangePriority={onChangePriority}
                      selectedDate={selectedDate}
                      handleDateChange={handleDateChange}
                    />
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
