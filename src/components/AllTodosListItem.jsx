import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import * as Icons from '@mui/icons-material';

import { themeSelection,  } from "../common/themes";

export function AllTodosListItem({ id, name, setCurrentList, currentList }) {
    function isSelected() {
        return currentList === id;
    }

    return (
        <ListItem
            key={id}
            sx={ !isSelected() ? (
                {
                // color: 'blue',
                color: themeSelection.palette.primary.main,
                fontWeight: 'bold'
                }
            ) : (
                    {
                        color: themeSelection.palette.secondary.main,
                        backgroundColor: themeSelection.palette.primary.main,
                        fontWeight: 'bold'
                    }    
            )
            }
            
            disablePadding>
            <ListItemButton
                onClick={() => {
                    setCurrentList(id);
                }}
                selected={currentList === id}
            >
                {<Icons.List />}
                    <ListItemText sx={{ ml: 0.5 }} primary={name} />
            </ListItemButton>
        </ListItem>
    )
}