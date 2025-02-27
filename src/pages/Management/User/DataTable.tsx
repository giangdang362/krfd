import { getUsers } from '@/services/management/user';
import { Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import { IPagination } from '../ChartTopIdol/Tabs/Group/DataGroupTable';
import { configColumns } from './columns';

interface DataUserTableProps {
  handleSetCurUser: (x: API.User) => void;
  reload?: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  currentName: string | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataUserTable: FC<DataUserTableProps> = ({
  handleSetCurUser,
  reload,
  setReload,
  currentName,
  loading,
  setLoading,
}) => {
  const [resApi, setResApi] = useState<API.ResUser>();
  const [pagination, setPagination] = useState<IPagination>({
    pageNumber: 1,
    pageSize: 15,
  });

  const handleReload = () => {
    setReload((pre) => !pre);
  };
  const handleGetUsers = async (isFilterChange?: boolean) => {
    setLoading(true);
    if (isFilterChange) {
      setPagination({ ...pagination, pageNumber: 1 });
    }
    const res = await getUsers({
      userName: currentName,
      // isGetAllData: true,
      PageNumber: isFilterChange ? 1 : pagination.pageNumber ?? -1,
      PageSize: pagination.pageSize ?? -1,
    });
    setResApi(res);
    setLoading(false);
  };

  useEffect(() => {
    handleGetUsers(true);
  }, [reload, currentName]);

  useEffect(() => {
    handleGetUsers();
  }, [pagination?.pageNumber]);

  return (
    <div>
      <Table
        loading={loading}
        columns={configColumns(handleSetCurUser, handleReload)}
        dataSource={resApi?.data}
        pagination={{
          showQuickJumper: true,
          defaultCurrent: 1,
          current: pagination.pageNumber,
          pageSize: pagination.pageSize,
          total: resApi?.totalCount,
          onChange: (e: number) => {
            setPagination({ ...pagination, pageNumber: e });
          },
        }}
      />
    </div>
  );
};

export default DataUserTable;
