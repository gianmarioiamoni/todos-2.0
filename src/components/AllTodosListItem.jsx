import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import * as Icons from '@mui/icons-material';

export function AllTodosListItem({id, name, setCurrentList, currentList }) {
    return (
        <ListItem
            key={id}
            sx={{
                color: 'blue',
            }}
            
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