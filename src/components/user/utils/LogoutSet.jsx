import { Button } from "@mui/material"
import { Person } from "@mui/icons-material"

import LogoutButton from "./LogoutButton"

export default function LogoutSet({ user, handleLogout }) {
    return (
        <div sx={{ display: 'inline-flex' }}>
            <Button
                startIcon={<Person />}
                color="inherit"
                sx={{ mr: 1 }}
            >
                {user.username}
            </Button>
            <LogoutButton onClick={handleLogout} />
        </div>
    )
}