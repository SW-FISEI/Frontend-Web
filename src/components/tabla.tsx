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
  Input,
  Spinner,
  useDisclosure
} from "@nextui-org/react";
import { Icon } from '@iconify/react';
import ConfirmModal from './modal-confirmacion';  // Importa el componente del modal
import '@/styles/tabla.scss'; // Asegúrate de importar tus estilos CSS

interface TablaProps<T> {
  columns: { uid: string; name: string; sortable?: boolean; }[];
  data: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onAddNew: () => void;
}

const Tabla = <T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onAddNew,
}: TablaProps<T>) => {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "id", direction: "ascending" });
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return [
      { uid: "n", name: "N" }, // Columna autoincrementable
      ...columns.map(column =>
        column.uid === "actions" ? { ...column, name: "Acciones" } : column
      )
    ];
  }, [columns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    return filteredData;
  }, [data, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = String(a[sortDescriptor.column as keyof T]);
      const second = String(b[sortDescriptor.column as keyof T]);
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((item: T, columnKey: React.Key) => {
    const columnKeyStr = String(columnKey);
    const keys = columnKeyStr.split('.');
  
    // Reduce el objeto item para acceder a la propiedad anidada
    const cellValue = keys.reduce((obj, key) => {
      // Usa 'as' para afirmar que el objeto tiene esta clave
      return obj?.[key as keyof typeof obj];
    }, item as any);  // 'any' para evitar problemas de tipado dinámico
  
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
  }, [onEdit, items, page, rowsPerPage]);
  
  const handleDeleteClick = (row: T) => {
    setSelectedRow(row);
    onOpen();  // Abre el modal
  };

  const handleConfirmDelete = () => {
    if (selectedRow) {
      onDelete(selectedRow);
      setSelectedRow(null);
      onClose(); // Cierra el modal después de confirmar
    }
  };

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
          placeholder="Busque por cualquier campo..."
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
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [filteredItems.length, page, pages]);

  return (
    <div className="table-container">
      {topContent}
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
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
        message="¿Estás seguro que deseas eliminar este registro?"
      />
    </div>
  );
};

export default Tabla;
