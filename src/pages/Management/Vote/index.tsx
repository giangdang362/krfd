import { useIntl } from '@umijs/max';
import { Tabs, Typography } from 'antd';
import { useState } from 'react';
import FundingVote from './Tabs/FundingVote';
import RequestOpenVote from './Tabs/RequestOpenVote';
import TopicVote from './Tabs/TopicVote';

const { Title } = Typography;

const VoteManagement = () => {
  const intl = useIntl();
  const [reloadAllVote, setReloadAllVote] = useState<boolean>(false);
  const listTabs = [
    {
      id: 1,
      label: `${intl.formatMessage({
        id: 'pages.vote.topicVote.title',
        defaultMessage: 'Topic Vote',
      })}`,
      children: <TopicVote />,
    },
    {
      id: 2,
      label: `${intl.formatMessage({
        id: 'pages.vote.fundingVote.title',
        defaultMessage: 'Funding Vote',
      })}`,
      children: <FundingVote reloadAllVote={reloadAllVote} />,
    },
    {
      id: 3,
      label: `${intl.formatMessage({
        id: 'pages.vote.reuest.title',
        defaultMessage: 'Request Open Vote',
      })}`,
      children: <RequestOpenVote setReloadAllVote={setReloadAllVote} />,
    },
  ];
  return (
    <div>
      <Title level={3}>
        {intl.formatMessage({
          id: 'pages.vote.title',
          defaultMessage: 'Vote Management',
        })}
      </Title>
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

export default VoteManagement;
