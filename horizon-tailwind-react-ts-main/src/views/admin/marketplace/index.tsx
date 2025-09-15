import TableTopCreator from "./components/TableCreator";
import { useEffect, useState } from "react";
import { App } from 'antd';
import { IAdmin, fetchAdmins } from "api/admin";

const AdminAccount = () => {
  const { message } = App.useApp();
  const [tableData, setTableData] = useState<IAdmin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const reloadTable = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdmins();
      setTableData(data);

      if (data.length === 0) {
        message.info("No admins found in the system");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch admin data";
      setError(errorMessage);
      console.error("Error fetching admin data:", error);

      message.error({
        content: "Failed to load admin data. Please try again.",
        duration: 5
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadTable();
  }, []);

  return (
    <div className="col-span-1 h-full w-full rounded-xl">
      <TableTopCreator
        tableData={tableData}
        reloadTable={reloadTable}
        loading={loading}
      />
      <div className="mb-5" />
    </div>
  );
};

export default () => (
  <App>
    <AdminAccount />
  </App>
);