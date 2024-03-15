import { Button } from "@mui/material"
import { Person } from "@mui/icons-material"

import { useAuth } from "../../../hooks/useAuth"

import LogoutButton from "./LogoutButton"

export default function LogoutSet({ handleLogout }) {
    const { user } = useAuth();


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
