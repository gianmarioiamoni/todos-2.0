import Dexie from 'dexie';

export const db = new Dexie('todo-list-db');
db.version(2).stores({
  lists: '++id, name', // Primary key and indexed props
  listItems: '++id, name, checked, listId', // Primary key and indexed props
});

export const APIs = {
  TodoLists: 'todo-lists',
  TodoListsUpdate: 'todo-lists-update',
  TodoList: 'todo-list',
  TodoListDelete: 'todo-list-delete',
  TodoListUpdate: 'todo-list-update',
};

export async function fetcher({ url, ...variables }) {
  switch (url) {
    case APIs.TodoLists: {
      const data = db.lists.toArray();
      console.log("fetcher - APIs.TodoLists: ", data);
      // return db.lists.toArray();
      return data;
    }
    case APIs.TodoList: {
      const data = {
        ...(await db.lists.get(variables.id)),
        items:
          (await db.listItems.where({ listId: variables.id }).toArray()) ?? [],
      };
      console.log("fetcher - APIs.TodoList: ", data);
      return data;
    }
      // return {
      //   ...(await db.lists.get(variables.id)),
      //   items:
      //     (await db.listItems.where({ listId: variables.id }).toArray()) ?? [],
      // };
    default:
      throw new Error(`Unknown API ${url}`);
  }
}

export async function putter({ url, id, ...variables }) {
  switch (url) {
    case APIs.TodoLists: {
      const data = db.lists.add({ name: variables.name, icon: variables.icon });
      console.log("putter - APIs.TodoLists: ", data);
      return data;
    }

      // return db.lists.add({ name: variables.name, icon: variables.icon });
    case APIs.TodoListsUpdate: {
      const data = db.lists.update(id, { name: variables.name }); 
      console.log("putter - APIs.TodoListsUpdate: ", data);
      return data;  
    }
      // return db.lists.update(id, { name: variables.name });
    case APIs.TodoList: {
      const data = db.listItems.add({ listId: id, name: variables.name }); 
      console.log("putter - APIs.TodoList: ", data);
      return data; 
    }
      // return db.listItems.add({ listId: id, name: variables.name });
    case APIs.TodoListDelete: {
      const data = db.listItems.delete(id); 
      console.log("putter - APIs.TodoListDelete: ", data);
      return data; 
    }
      // return db.listItems.delete(id);
    case APIs.TodoListUpdate: {
      const data = db.listItems.update(id, variables); 
      console.log("putter - APIs.TodoListUpdate - variables: ", variables);
      return data; 
    }
      // return db.listItems.update(id, variables);
    default:
      throw new Error(`Unknown API ${url}`);
  }
}
