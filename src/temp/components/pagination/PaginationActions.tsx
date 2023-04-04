import { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

type PaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
};

function PaginationActions({ count, page, rowsPerPage, onPageChange }: PaginationActionsProps) {
  const handleBackButtonClick = useCallback(
    event => {
      onPageChange(event, page - 1);
    },
    [onPageChange, page]
  );

  const handleNextButtonClick = useCallback(
    event => {
      onPageChange(event, page + 1);
    },
    [onPageChange, page]
  );

  return (
    <div style={{ display: 'flex' }}>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Next Page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </div>
  );
}

export default PaginationActions;
