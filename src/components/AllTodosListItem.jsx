import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import * as Icons from '@mui/icons-material';

import { styled } from '@mui/system';
import { Typography } from '@mui/material';

import { theme } from "../common/themes";

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
                color: theme.palette.primary.main,
                fontWeight: 'bold'
                }
            ) : (
                    {
                        // color: 'blue',
                        color: theme.palette.secondary.main,
                        backgroundColor: theme.palette.primary.main,
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