import { Tooltip, IconButton } from '@mui/material';
import { ReactNode } from 'react';

type ActionProps = {
  icon: ReactNode;
  handler: (event: any) => void;
  tooltip: string;
  disabled?: boolean;
};

const Action = ({ icon, handler, tooltip, disabled = false }: ActionProps) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton color="primary" onClick={handler} disabled={disabled}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Action;
