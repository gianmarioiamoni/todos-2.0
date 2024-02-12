import useSWR from 'swr';

import { APIs, fetcher, putter } from '../utils.js';

export function useTodoLists() {
  const { data = [], mutate } = useSWR({ url: APIs.TodoLists }, fetcher);

  return {
    data,
    async newList(newListName, icon) {
      console.log("newList - ")
      return await mutate(
        await putter({
          url: APIs.TodoLists,
          icon: icon || 'List', // note: not using default param since an empty string is the default and won't be falsy
          name: newListName,
        }),
        {
          populateCache: false,
          optimisticData: oldData => [
            ...oldData,
            { name: newListName, icon: icon || 'List', data: [] },
          ],

          // Update the local state immediately and fire the
          // request. Since the API will return the updated
          // data, there is no need to start a new revalidation
          // and we can directly populate the cache.
          // optimisticData: [...data, newTodo],
          // optimisticData: [...data, {name: newListName, icon: icon}],
          
        }
      );
    },
    
  // });
    async updateList(listToUpdate, newListName) {
      console.log("updateList -")
      await mutate(
        await putter({
          url: APIs.TodoListsUpdate,
          id: listToUpdate,
          name: newListName,
        }),
        {
          populateCache: false,
          optimisticData: oldData =>
            oldData.map(d => {
              if (d.id === listToUpdate) {
                return { ...d, name: newListName };
              }
              return d;
            }),
        }
      );
    },
  };
}
