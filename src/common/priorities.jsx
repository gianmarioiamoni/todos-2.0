import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import DragHandleIcon from '@mui/icons-material/DragHandle';


export const priorityData = [
    { value: 1, name: "High", color: "error.main", chipColor: "error", icon: <PriorityHighIcon /> },
    { value: 2, name: "Medium", color: "warning.main", chipColor: "warning", icon: <DragHandleIcon /> },
    { value: 3, name: "Normal", color: "success.main", chipColor: "success", icon: <LowPriorityIcon /> }
];

export function sortItems(a, b) {
    return a.priority - b.priority;
}

