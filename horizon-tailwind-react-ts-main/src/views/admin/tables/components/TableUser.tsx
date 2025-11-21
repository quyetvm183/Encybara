import React, { useEffect, useState } from "react";
import Card from "components/card";
import { useAuth } from "hooks/useAuth"; // Import useAuth hook
import { useNavigate } from "react-router-dom";
import Access from "views/admin/access";
import { message } from "antd";
import { userApiService, User } from "api/user"; // Import user API service and types

const TableUser: React.FC = () => {
    const { token } = useAuth(); // Lấy token từ context
    const [tableData, setTableData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;

            setLoading(true);
            try {
                const users = await userApiService.getUsers();
                setTableData(users);
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]); // Chạy lại khi token thay đổi

    const handleView = (userId: number) => {
        navigate(`/admin/profile/${userId}`); // Điều hướng đến trang profile
    };

    const handleDelete = async (id: number) => {
        if (!id) return;

        try {
            await userApiService.deleteUser(id);
            setTableData(tableData.filter(row => row.id !== id));
            message.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error("Failed to delete user");
        }
    };


    return (
        <Card extra={"w-full sm:overflow-auto px-6"}>
            <header className="relative flex items-center justify-between pt-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    User Table
                </div>
            </header>

            <div className="mt-0 overflow-x-scroll xl:overflow-x-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="text-gray-500">Loading users...</div>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Name</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Email</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Phone</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Field</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">English Level</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                tableData.map((row, index) => (
                                    <tr key={row.id || index}>
                                        <td className="border-b border-gray-200 py-3 pr-4">{row.name}</td>
                                        <td className="border-b border-gray-200 py-3 pr-4">{row.email}</td>
                                        <td className="border-b border-gray-200 py-3 pr-4">{row.phone}</td>
                                        <td className="border-b border-gray-200 py-3 pr-4">{row.speciField}</td>
                                        <td className="border-b border-gray-200 py-3 pr-4">{row.englishlevel}</td>
                                        <td className="border-b border-gray-200 py-3 pr-4">
                                            <button
                                                onClick={() => handleView(row.id)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                View
                                            </button>
                                            <Access
                                                permission={{ module: "SYSTEM_MANAGEMENT" }}
                                                hideChildren={true}
                                            >
                                                <button
                                                    onClick={() => handleDelete(row.id)}
                                                    className="text-red-500 hover:underline ml-2"
                                                >
                                                    Delete
                                                </button>
                                            </Access>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>


        </Card>
    );
};

export default TableUser;