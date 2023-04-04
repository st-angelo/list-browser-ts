import { useCallback, useState } from 'react';
import { TablePagination, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styles from './style';
import PaginationActions from './PaginationActions';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';

type PaginationProps = {
  loading: boolean;
  totalCount: number;
  pageSize: number;
  page: number;
  rowsPerPageOptions?: number[];
  onRefresh?: () => void;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (value: number) => void;
};

const useStyles = makeStyles(styles);

const Pagination = (props: PaginationProps) => {
  const { loading, totalCount, pageSize, page, rowsPerPageOptions } = props;
  const { onRefresh, onChangePage, onChangeRowsPerPage } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectProps] = useState({
    inputProps: { 'aria-label': 'Rows per page' },
    native: true
  });

  const displayedRows = useCallback(
    ({ from, to, count }) => {
      return `${from}-${to} ${t('RowsOf')} ${count}`;
    },
    [t]
  );

  const internalChangePage = useCallback(
    (_, page: number) => {
      onChangePage && onChangePage(page + 1);
    },
    [onChangePage]
  );

  const internalChangePageSize = useCallback(
    event => {
      onChangeRowsPerPage && onChangeRowsPerPage(parseInt(event.target.value));
    },
    [onChangeRowsPerPage]
  );

  const actualRowsPerPage = rowsPerPageOptions ? rowsPerPageOptions : [10, 25, 50, 100];

  return loading ? (
    <></>
  ) : (
    <div className={classes.paginationContainer}>
      <IconButton onClick={onRefresh}>
        <RefreshIcon />
      </IconButton>
      <TablePagination
        ActionsComponent={PaginationActions}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={page - 1}
        onPageChange={internalChangePage}
        onRowsPerPageChange={internalChangePageSize}
        labelRowsPerPage={t('RowsPerPage')}
        labelDisplayedRows={displayedRows}
        SelectProps={selectProps}
        rowsPerPageOptions={actualRowsPerPage}
      />
    </div>
  );
};

export default Pagination;
