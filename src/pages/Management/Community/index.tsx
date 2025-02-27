import { getAllIdolCommunity } from '@/services/management/community';
import { SearchOutlined } from '@ant-design/icons';
import { useIntl, useNavigate } from '@umijs/max';
import { Input, Table, Typography } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { IPagination } from '../ChartTopIdol/Tabs/Group/DataGroupTable';
import '../styles/styleTable.css';
import { columns } from './columns';

const { Title } = Typography;

const CommunityManagement = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [resApi, setResApi] = useState<API.ResCommunity>();
  const [pagination, setPagination] = useState<IPagination>({
    pageNumber: 1,
    pageSize: 15,
  });
  const [curCommunityName, setCurCommunityName] = useState<string | null>(null);

  const handleCommunityNameChange = debounce((x: string) => {
    setCurCommunityName(x);
  }, 1000);

  const handleGetCommunity = async (isFilterChange?: boolean) => {
    setLoading(true);
    if (isFilterChange) {
      setPagination({ ...pagination, pageNumber: 1 });
    }
    const res = await getAllIdolCommunity({
      communityName: curCommunityName,
      PageNumber: pagination.pageNumber ?? -1,
      PageSize: pagination.pageSize ?? -1,
    });
    if (res) setResApi(res);
    setLoading(false);
  };

  useEffect(() => {
    handleGetCommunity(true);
  }, [curCommunityName]);

  useEffect(() => {
    handleGetCommunity();
  }, [pagination.pageNumber]);
  return (
    <div>
      <Title level={3}>
        {intl.formatMessage({
          id: 'pages.community.title',
          defaultMessage: 'Community Management',
        })}
      </Title>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '12px',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: '10px',
          }}
        >
          <Input
            style={{
              width: '200px',
            }}
            placeholder={`${intl.formatMessage({
              id: 'pages.chartTopIdol.solo.placeholderSearch',
              defaultMessage: 'Search by name',
            })}`}
            prefix={<SearchOutlined />}
            onChange={(e) => handleCommunityNameChange(e.target.value)}
            allowClear
          />
        </div>
      </div>
      <div className="wrapp-table">
        <Table
          loading={loading}
          columns={columns()}
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
          onRow={(e) => {
            return {
              onClick: () => {
                navigate(`detail/${e.id}`);
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default CommunityManagement;
