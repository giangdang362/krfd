import { getIdolCommunityDetail } from '@/services/management/community';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useIntl, useNavigate, useParams } from '@umijs/max';
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import FundingVoteDetail from './FundingVote';
import RequestOpenVoteDetail from './RequestOpenVote';

const CommunityDetail = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paramUrl = useParams();
  const [communityDetail, setCommunityDetail] = useState<API.CommunityItem>();
  const [reloadAllVote, setReloadAllVote] = useState<boolean>(false);
  const listTabs = [
    {
      id: 1,
      label: `${intl.formatMessage({
        id: 'pages.community.fundingVote.title',
        defaultMessage: 'Funding Vote',
      })}`,
      children: (
        <FundingVoteDetail communityDetail={communityDetail} reloadAllVote={reloadAllVote} />
      ),
    },
    {
      id: 2,
      label: `${intl.formatMessage({
        id: 'pages.community.request.title',
        defaultMessage: 'Request Open Vote',
      })}`,
      children: (
        <RequestOpenVoteDetail
          communityDetail={communityDetail}
          setReloadAllVote={setReloadAllVote}
        />
      ),
    },
  ];

  const handleGetCommunityDetail = async () => {
    const res = await getIdolCommunityDetail({ idolCommunityId: Number(paramUrl.id) });
    setCommunityDetail(res);
  };

  useEffect(() => {
    handleGetCommunityDetail();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          height: '24px',
          alignItems: 'center',
          marginBottom: '4px',
        }}
      >
        <Button
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            boxShadow: 'unset',
            padding: '0',
          }}
          onClick={() => navigate('/management/community')}
        >
          <ArrowLeftOutlined />
        </Button>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 600,
            lineHeight: '24px',
          }}
        >
          {communityDetail?.communityName}
        </div>
      </div>
      <Tabs
        tabPosition="top"
        items={listTabs.map((item, index) => {
          const id = String(index + 1);
          return {
            label: item.label,
            key: id,
            children: item.children,
          };
        })}
      />
    </div>
  );
};

export default CommunityDetail;
