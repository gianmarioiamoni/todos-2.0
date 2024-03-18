import { Button } from "@mui/material"
import { Person, Logout } from "@mui/icons-material"

import { useAuth } from "../../../hooks/useAuth"

export default function LogoutSet({ handleLogout, dir }) {
    const { user } = useAuth();

        return (

            <div style={dir == null ? ({ display: 'inline-flex' }) : ({ display: 'flex', flexDirection: 'column' })}>
                <Button
                    startIcon={<Person />}
                    color="inherit"
                    sx={{ mr: 1 }}
                >
                    {user.username}
                </Button>
                <Button
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    color="inherit"
                    sx={{ mr: 1 }}
                >
                    Logout
                </Button>
            </div>
        )
}
