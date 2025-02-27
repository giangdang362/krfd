import { SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Input, Typography } from 'antd';
import debounce from 'lodash/debounce';
import { useState } from 'react';
import DataUserTable from './DataTable';
import UpdateForm from './UpdateForm';

const { Title } = Typography;

const UserManagement = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [curUser, setCurUser] = useState<API.User>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const handleSetCurUser = (x: API.User) => {
    setCurUser(x);
    setShowModal(true);
  };

  const handleNameChange = debounce((x: string) => {
    setCurrentName(x);
  }, 1000);

  return (
    <div>
      <Title level={3}>
        {intl.formatMessage({
          id: 'pages.user.title',
          defaultMessage: 'User Management',
        })}
      </Title>
      <Input
        style={{
          width: '200px',
          borderRadius: '4px',
          color: '#D9D9D9',
          marginBottom: '16px',
        }}
        placeholder={`${intl.formatMessage({
          id: 'pages.chartTopIdol.solo.placeholderSearch',
          defaultMessage: 'Search by name',
        })}`}
        prefix={<SearchOutlined />}
        onChange={(e) => handleNameChange(e.target.value)}
        allowClear
      />
      <DataUserTable
        handleSetCurUser={handleSetCurUser}
        reload={reload}
        setReload={setReload}
        currentName={currentName}
        loading={loading}
        setLoading={setLoading}
      />
      <UpdateForm
        showModal={showModal}
        setShowModal={setShowModal}
        curItem={curUser}
        setReload={setReload}
      />
    </div>
  );
};

export default UserManagement;
