import React, { useRef, useState } from "react";
import Card from "components/card";
import { message, Modal } from "antd";
import ModalAdmin from "./modal.admin";
import { ActionType } from "@ant-design/pro-components";
import { IAdmin, deleteAdmin } from "api/admin";
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface TableTopCreatorsProps {
  tableData: IAdmin[];
  reloadTable: () => void;
  loading?: boolean;
}

const TableTopCreators: React.FC<TableTopCreatorsProps> = ({
  tableData,
  reloadTable,
  loading = false
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IAdmin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const tableRef = useRef<ActionType>();

  const handleEdit = (row: IAdmin) => {
    setDataInit(row);
    setOpenModal(true);
    tableRef.current?.reset();
  };

  const handleCreate = () => {
    tableRef.current?.reset();
    setDataInit(null);
    setOpenModal(true);
  };

  const handleDelete = async (admin: IAdmin) => {
    if (!admin.id) return;

    Modal.confirm({
      title: 'Confirm Delete',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete admin "${admin.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setDeleteLoading(admin.id!);
        try {
          await deleteAdmin(admin.id!);
          message.success("Delete admin successfully");
          reloadTable();
        } catch (error) {
          message.error(error instanceof Error ? error.message : "Failed to delete admin");
        } finally {
          setDeleteLoading(null);
        }
      },
    });
  };

  const getFieldDisplay = (field: string) => {
    const fieldMap: Record<string, string> = {
      'IT': 'Information Technology',
      'CONSTRUCTION': 'Construction',
      'ECONOMIC': 'Economics',
      'ELECTRICITY': 'Electrical Engineering'
    };
    return fieldMap[field] || field;
  };

  return (
    <Card extra={"w-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Admin Management
          {loading && (
            <span className="ml-2 text-sm text-gray-500">Loading...</span>
          )}
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Create Admin
        </button>
      </header>

      <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Name
                </div>
              </th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Email
                </div>
              </th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Field
                </div>
              </th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Role
                </div>
              </th>
              <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span>Loading admins...</span>
                  </div>
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border-b border-gray-200 py-3 pr-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {row.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="ml-3 font-medium text-gray-900">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-gray-200 py-3 pr-4">
                    <span className="text-gray-700">{row.email}</span>
                  </td>
                  <td className="border-b border-gray-200 py-3 pr-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getFieldDisplay(row.field || '')}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 py-3 pr-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {row.role?.name || 'No Role'}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 py-3 pr-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(row)}
                        disabled={loading}
                        className="text-yellow-600 hover:text-yellow-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDelete(row)}
                        disabled={loading || deleteLoading === row.id}
                        className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deleteLoading === row.id ? (
                          <span className="flex items-center space-x-1">
                            <div className="animate-spin h-3 w-3 border border-red-600 border-t-transparent rounded-full"></div>
                            <span>Deleting...</span>
                          </span>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalAdmin
        openModal={openModal}
        setOpenModal={setOpenModal}
        dataInit={dataInit}
        setDataInit={setDataInit}
        reloadTable={reloadTable}
      />
    </Card>
  );
};

export default TableTopCreators;