import { useIntl } from '@umijs/max';
import { Tabs, Typography } from 'antd';
import Banner from './Tabs/Banner';
import FandomService from './Tabs/FandomService';
import FundingVote from './Tabs/FundingVote';
import PopupAds from './Tabs/PopupAds';
import TopicVote from './Tabs/TopicVote';

const { Title } = Typography;

const MainPageManagement = () => {
  const intl = useIntl();
  const listTabsManagement = [
    {
      id: 1,
      label: `${intl.formatMessage({
        id: 'pages.mainPage.banner.title',
        defaultMessage: 'Banner',
      })}`,
      children: <Banner />,
    },
    {
      id: 2,
      label: `${intl.formatMessage({
        id: 'pages.mainPage.popupAds.title',
        defaultMessage: 'Popup Ads',
      })}`,
      children: <PopupAds />,
    },
    {
      id: 3,
      label: `${intl.formatMessage({
        id: 'pages.mainPage.topicVote.title',
        defaultMessage: 'Topic Vote',
      })}`,
      children: <TopicVote />,
    },
    {
      id: 4,
      label: `${intl.formatMessage({
        id: 'pages.mainPage.fundingVote.title',
        defaultMessage: 'Funding Vote',
      })}`,
      children: <FundingVote />,
    },
    {
      id: 5,
      label: `${intl.formatMessage({
        id: 'pages.mainPage.fandomService.title',
        defaultMessage: 'Fandom service',
      })}`,
      children: <FandomService />,
    },
  ];
  return (
    <div>
      <Title level={3}>
        {intl.formatMessage({
          id: 'pages.mainPage.title',
          defaultMessage: 'Main Page Management',
        })}
      </Title>
      <Tabs
        tabPosition="left"
        items={listTabsManagement.map((item, index) => {
          const id = String(index + 1);
          return {
            label: item.label,
            key: id,
            children: <>{item.children}</>,
          };
        })}
      />
    </div>
  );
};

export default MainPageManagement;
