import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Pagination,
  SortDescriptor,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import ConfirmModal from './modal-confirmacion';
import '@/styles/tabla-filtros.scss';

interface TablaProps<T> {
  columns: { uid: string; name: string; sortable?: boolean; filterable?: boolean }[];
  data: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onAddNew: () => void;
}

const getUniqueValues = <T,>(data: T[], key: string): { uid: string; name: string }[] => {
  const values = data.map(item => {
    const keys = key.split('.');
    return keys.reduce((acc, curr) => (acc && acc[curr as keyof typeof acc]) || '', item as any);
  });
  const uniqueValues = Array.from(new Set(values));
  return uniqueValues.map(value => ({ uid: String(value), name: String(value) }));
};

const TablaConFiltros = <T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onAddNew,
}: TablaProps<T>) => {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "id", direction: "ascending" });
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: Set<string> }>({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dynamicFilterOptions = useMemo(() => {
    const options: { [key: string]: { uid: string; name: string }[] } = {};
    columns.forEach(column => {
      if (column.filterable) {
        options[column.uid] = getUniqueValues(data, column.uid);
      }
    });
    return options;
  }, [columns, data]);

  const headerColumns = useMemo(() => {
    return [
      { uid: "n", name: "N" },
      ...columns.map(column =>
        column.uid === "actions" ? { ...column, name: "Acciones" } : column
      )
    ];
  }, [columns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (filterValue) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    Object.keys(columnFilters).forEach((key) => {
      const filterValues = columnFilters[key];
      if (filterValues && filterValues.size > 0) {
        filteredData = filteredData.filter((item) => {
          const keys = key.split('.');
          const itemValue = keys.reduce((acc, curr) => (acc && acc[curr as keyof typeof acc]) || '', item as any);
          return filterValues.has(String(itemValue));
        });
      }
    });

    return filteredData;
  }, [data, filterValue, columnFilters]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];

      const firstValue = typeof first === 'number' ? first : Number(first);
      const secondValue = typeof second === 'number' ? second : Number(second);

      const cmp = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleFilterChange = useCallback((columnUid: string, selectedKeys: Set<string>) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnUid]: selectedKeys,
    }));
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setColumnFilters({});
    setPage(1);
  }, []);

  const handleDeleteClick = useCallback((row: T) => {
    setSelectedRow(row);
    onOpen();
  }, [onOpen]);

  const renderCell = useCallback((item: T, columnKey: React.Key) => {
    const columnKeyStr = String(columnKey);

    const keys = columnKeyStr.split('.');
    const cellValue = keys.reduce((obj, key) => {
      return obj?.[key as keyof typeof obj];
    }, item as any);

    switch (columnKey) {
      case "n":
        return items.indexOf(item) + 1 + (page - 1) * rowsPerPage;
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Tooltip content="Editar" className="custom-edit-tooltip">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="custom-edit-button"
                onPress={() => onEdit(item)}
              >
                <Icon icon="lucide:edit" className="custom-icon" />
              </Button>
            </Tooltip>
            <Tooltip content="Eliminar" className="custom-delete-tooltip">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="custom-delete-button"
                onPress={() => handleDeleteClick(item)}
              >
                <Icon icon="lucide:trash" className="custom-icon" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return String(cellValue || '');
    }
  }, [onEdit, items, page, rowsPerPage, handleDeleteClick]);

  const handleConfirmDelete = useCallback(() => {
    if (selectedRow) {
      onDelete(selectedRow);
      setSelectedRow(null);
      onClose();
    }
  }, [selectedRow, onDelete, onClose]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="top-content">
        <Input
          isClearable
          className="search-input"
          placeholder="Busque por nombre o descripción..."
          startContent={<Icon icon="lucide:search" />}
          value={filterValue}
          onClear={onClear}
          onChange={onSearchChange}
        />
        <Button className="add-button" onPress={onAddNew}>
          <Icon icon="lucide:plus" width="26" height="26" />
          Agregar
        </Button>
      </div>
    );
  }, [filterValue, onSearchChange, onClear, onAddNew]);

  const bottomContent = useMemo(() => {
    return (
      <div className="bottom-content">
        <span className="text-default-400 text-small">
          Total de registros: {filteredItems.length}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          className="custom-paginator"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="pagination-controls">
          <Button isDisabled={page === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={page === pages} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [filteredItems.length, page, pages, onNextPage, onPreviousPage]);

  return (
    <div className="table-container">
      {topContent}
      <div className="contenedorTablaFiltros">
        <div className="tabla">
          <Table
            aria-label="Example table with client async pagination"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            className="dynamic-table"
            sortDescriptor={sortDescriptor}
            topContentPlacement="outside"
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={sortedItems}
              loadingContent={<Spinner />}
              emptyContent={"No items found"}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="filtros">
          <div className="encabezadoFiltros">
            <h3>Filtros</h3>
            <Tooltip content="Limpiar Filtros">
              <Button size="sm" onPress={handleClearFilters}>
                <Icon icon="lucide:filter-x" />
              </Button>
            </Tooltip>
          </div>
          {columns.map(column => (
            column.filterable && dynamicFilterOptions[column.uid] && column.uid !== "actions" && (
              <div key={column.uid} className="filtro-columna">
                <Dropdown className="filtro">
                  <DropdownTrigger className="filtroDropdown">
                    <Button endContent={<Icon icon="lucide:chevron-down" />} variant="flat">
                      {column.name}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label={`Filtrar por ${column.name}`}
                    closeOnSelect={false}
                    selectedKeys={columnFilters[column.uid] || new Set()}
                    selectionMode="multiple"
                    onSelectionChange={(keys) => handleFilterChange(column.uid, keys as Set<string>)}
                  >
                    {dynamicFilterOptions[column.uid].map((option) => (
                      <DropdownItem key={option.uid} className="capitalize">
                        {option.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            )
          ))}
        </div>
      </div>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
        message="¿Estás seguro que deseas eliminar este registro?"
      />
    </div>
  );
};

export default TablaConFiltros;
