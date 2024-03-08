import { Button } from "@mui/material"
import { Logout } from "@mui/icons-material"

export default function LogoutButton({onClick}) {
    
    return (
        <Button
            onClick={onClick}
            startIcon={<Logout />}
            color="inherit"
            sx={{ mr: 1 }}
        > 
            Logout
        </Button>
    )
}