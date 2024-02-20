// import Dexie from 'dexie';
// import axios from 'axios';

// const dbUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_DB_URL : import.meta.env.VITE_LOCAL_DB_URL;

// export const db = new Dexie('todo-list-db');
// db.version(2).stores({
//   lists: '++id, name', // Primary key and indexed props
//   listItems: '++id, name, checked, listId', // Primary key and indexed props
// });

// export const APIs = {
//   TodoLists: 'todo-lists',
//   TodoListsUpdate: 'todo-lists-update',
//   TodoList: 'todo-list',
//   TodoListDelete: 'todo-list-delete',
//   TodoListUpdate: 'todo-list-update',
// };

// // fetcher
// export async function fetcher({ url, ...variables }) {
//   switch (url) {
//     //
//     // lists
//     //
    
//     // GET
//     case APIs.TodoLists: {
//       // const data = db.lists.toArray();
//       console.log("fetcher - APIs.TodoLists: ", data);

//       try {
//         const fetchedData = await axios.get(`${import.meta.env.VITE_SERVER_URL}/lists`);
//         const returnData = fetchedData.data.map((d) => ({ ...d, id: d._id }));
//         console.log("returnData = ", returnData);
//       } catch (err) { console.log(err) }
          

//       // return db.lists.toArray();
//       // return data;
//       return returnData;
//     }
    
    
//     //
//     // lists, listItems
//     //
    
//     // GET
//     case APIs.TodoList: {
//       // {name: "list name", icon: "icon name", items: [{listItams1}, ...]}
//       // const data = {
//       //   ...(await db.lists.get(variables.id)),
//       //   items:
//       //     (await db.listItems.where({ listId: variables.id }).toArray()) ?? [],
//       // };
//       try {
//         const fetchedListData = await axios.get(`${import.meta.env.VITE_SERVER_URL}/lists:${variables.id}`);
//         const fetchedListItemsData = await axios.get(`${import.meta.env.VITE_SERVER_URL}/lists:${variables.id}/listitems`);
//         const returnData = { ...fetchedListData.data[0], items: fetchedListItemsData };
//         console.log("returnData = ", returnData);
//       } catch (err) { console.log(err) }

//       console.log("fetcher - APIs.TodoList: ", data);
//       // return data;
//       return returnData;
//     }
//       // return {
//       //   ...(await db.lists.get(variables.id)),
//       //   items:
//       //     (await db.listItems.where({ listId: variables.id }).toArray()) ?? [],
//       // };
//     default:
//       throw new Error(`Unknown API ${url}`);
//   }
// }

// // putter
// export async function putter({ url, id, ...variables }) {
//   switch (url) {
//     //
//     // lists
//     //
    
//     // POST
//     case APIs.TodoLists: {
//       const inputData = { name: variables.name, icon: variables.icon }; 
//       const data = db.lists.add(inputData);
//       try {
//         let payload = inputData;
//         let resData = await axios.post(`${import.meta.env.VITE_SERVER_URL}/lists`, payload);

//         resData = { ...prev, id: res.data.id };

//       } catch(err) {console.log(err)}
//       console.log("putter - APIs.TodoLists data:", data);
//       console.log("resData: ", resData);
//       // return data;
//       return resData;
//     }

//       // return db.lists.add({ name: variables.name, icon: variables.icon });
    
//     // PUT
//     case APIs.TodoListsUpdate: {
//       const inputData = { name: variables.name };
//       const data = db.lists.update(id, inputData); 
//       console.log("putter - APIs.TodoListsUpdate: ", data);
//       console.log("inputData: ", inputData)
//       return data;  
//     }
//       // return db.lists.update(id, { name: variables.name });
    
    
//     //
//     // listItems
//     //
    
//     // POST
//     case APIs.TodoList: {
//       const inputData = { listId: id, name: variables.name };
//       const data = db.listItems.add(inputData); 
//       console.log("putter - APIs.TodoList: ", data);
//       console.log("inputData: ", inputData)
//       return data; 
//     }
//       // return db.listItems.add({ listId: id, name: variables.name });
    
//     // DELETE
//     case APIs.TodoListDelete: {
//       const data = db.listItems.delete(id); 
//       console.log("putter - APIs.TodoListDelete: ", data);
//       return data; 
//     }
//       // return db.listItems.delete(id);
    
//     // PUT
//     case APIs.TodoListUpdate: {
//       const inputData = variables;
//       const data = db.listItems.update(id, inputData); 
//       console.log("putter - APIs.TodoListUpdate - variables: ", variables);
//       console.log("inputData: ", inputData)
//       return data; 
//     }
//       // return db.listItems.update(id, variables);
//     default:
//       throw new Error(`Unknown API ${url}`);
//   }
// }
