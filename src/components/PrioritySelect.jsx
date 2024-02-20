import React from 'react';
import { Select, MenuItem, FormControl, FormHelperText, InputLabel, Box, Chip } from '@mui/material';

import { priorityData } from '../common/priorities';

export default function PrioritySelect({ value, onChange }) {
    return (
        <Box
            // sx={{ marginTop: "10px" }}
        >
        <FormControl >
            {/* <InputLabel id="severity-label" >Severity</InputLabel> */}
            <Select
                // labelId="severity-label"
                id="severity-select"
                value={value}
                onChange={onChange}
            >
                {priorityData.map((priorityObj, i) => {
                    
                    return <MenuItem
                        key={i}
                        value={priorityObj.value}
                    >
                        <Chip
                            label={priorityObj.name}
                            color={priorityObj.chipColor}
                            key={priorityObj.name}
                            icon={priorityObj.icon}
                            size="small"
                        />
                    </MenuItem>
                }
                )}
                </Select>
                <FormHelperText>Priority</FormHelperText>
            </FormControl>
            </Box>
    );
}
