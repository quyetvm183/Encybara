import React from 'react';
import { animations } from 'utils/animations';

export type TableColumnType<T> = {
  title: string;
  key: keyof T | 'actions';
  render?: (value: any, record: T) => React.ReactNode;
  responsive?: boolean; // New prop to control column visibility on mobile
};

interface DataTableProps<T> {
  title?: string;
  columns: TableColumnType<T>[];
  data: T[];
  loading?: boolean;
  actionButtons?: React.ReactNode;
  emptyMessage?: React.ReactNode;
}

function DataTable<T extends Record<string, any>>({
  title,
  columns,
  data,
  loading = false,
  actionButtons,
  emptyMessage
}: DataTableProps<T>) {
  const renderCellContent = (column: TableColumnType<T>, item: T) => {
    if (column.render) {
      return column.render(
        column.key === 'actions' ? undefined : item[column.key as keyof T],
        item
      );
    }
    return column.key === 'actions' ? null : item[column.key as keyof T];
  };

  return (
    <div className={`w-full bg-white dark:bg-gray-800 shadow rounded-lg ${animations.fade.enter}`}>
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700">
        {title && (
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4 sm:mb-0">
            {title}
          </h3>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          {actionButtons}
        </div>
      </div>

      {/* Table Container with horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className={`
                      px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 
                      uppercase tracking-wider whitespace-nowrap
                      ${column.responsive === false ? 'hidden sm:table-cell' : ''}
                    `}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <div className="flex justify-center items-center">
                      <div className={`h-8 w-8 border-b-2 border-blue-500 ${animations.loading.spin}`} />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    {emptyMessage || 'No data available'}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr 
                    key={index}
                    className={`
                      transition-colors duration-200
                      hover:bg-gray-50 dark:hover:bg-gray-700
                    `}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300
                          ${column.responsive === false ? 'hidden sm:table-cell' : ''}
                        `}
                      >
                        {renderCellContent(column, item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-friendly pagination controls can be added here */}
      {/* <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        // Pagination component
      </div> */}
    </div>
  );
}

export default DataTable;