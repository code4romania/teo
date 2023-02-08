import React, { useEffect, useState } from 'react';
import { OrderDirection } from '../common/enums/order-direction.enum';
import Divisions, { DivisionsTabs, DivisionType, IDivision } from '../components/Divisions';
import { useErrorToast } from '../hooks/useToast';
import PageLayout from '../layouts/PageLayout';
import i18n from '../common/config/i18n';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { useDivisionsQuery } from '../services/division/division.service';

const Organization = () => {
  const [divisionType, setDivisionType] = useState<DivisionType>(DivisionType.Branches);
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();

  const {
    data: division,
    isLoading,
    error,
    refetch,
  } = useDivisionsQuery(
    rowsPerPage as number,
    page as number,
    divisionType as DivisionType,
    orderByColumn as string,
    orderDirection as OrderDirection,
  );

  useEffect(() => {
    if (division?.meta) {
      setPage(division.meta.currentPage);
      setRowsPerPage(division.meta.itemsPerPage);
      setOrderByColumn(division.meta.orderByColumn);
      setOrderDirection(division.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) useErrorToast(i18n.t('general:error.load_entries'));
  }, [error]);

  const onTabClick = (id: DivisionType) => {
    setDivisionType(DivisionsTabs.find((tab) => tab.key === id)?.key as DivisionType);
  };

  const onRefetch = () => {
    refetch();
  };

  // pagination
  const onRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
  };

  const onChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const onSort = (column: TableColumn<IDivision>, direction: SortOrder) => {
    setOrderByColumn(column.id as string);
    setOrderDirection(
      direction.toLocaleUpperCase() === OrderDirection.ASC
        ? OrderDirection.ASC
        : OrderDirection.DESC,
    );
  };

  return (
    <PageLayout>
      <Divisions
        isLoading={isLoading}
        divisionType={divisionType}
        data={division}
        onTabChange={onTabClick}
        onSort={onSort}
        page={page as number}
        onChangePage={onChangePage}
        onRowsPerPageChange={onRowsPerPageChange}
        onRefetch={onRefetch}
      />
    </PageLayout>
  );
};

export default Organization;
