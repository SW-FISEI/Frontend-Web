import React from 'react';
import '@/styles/dinamic-table.scss';

interface Column {
  title: string;
  dataField: string;
  type?: string;
  sortable?: boolean;
  sort_direction?: 'asc' | 'desc';
}

interface RowAction {
  label: string;
  actionToPerform: string;
  icon: string;
  permission: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  rowActions: RowAction[];
  onAction: (action: string, rowData: any) => void;
}

const DynamicTable: React.FC<TableProps> = ({ columns, data, rowActions, onAction }) => {
  const handleAction = (action: string, rowData: any) => {
    onAction(action, rowData);
  };

  return (
    <table className="dynamic-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.dataField}>{col.title}</th>
          ))}
          {rowActions.length > 0 && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) => (
              <td key={col.dataField}>{row[col.dataField]}</td>
            ))}
            {rowActions.length > 0 && (
              <td>
                {rowActions.map((action) => (
                  <button
                    key={action.actionToPerform}
                    onClick={() => handleAction(action.actionToPerform, row)}
                    className="action-button"
                  >
                    <i className={action.icon}></i> {action.label}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;
