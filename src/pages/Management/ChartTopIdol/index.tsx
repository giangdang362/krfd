import { useIntl } from '@umijs/max';
import { Tabs, Typography } from 'antd';
import GroupChartTopIdol from './Tabs/Group';
import SoloChartTopIdol from './Tabs/Solo';

const { Title } = Typography;

const ChartTopIdol = () => {
  const intl = useIntl();

  const listTabs = [
    {
      id: 1,
      label: `${intl.formatMessage({
        id: 'pages.chartTopIdol.solo.title',
        defaultMessage: 'Solo',
      })}`,
      children: <SoloChartTopIdol />,
    },
    {
      id: 2,
      label: `${intl.formatMessage({
        id: 'pages.chartTopIdol.group.title',
        defaultMessage: 'Group',
      })}`,
      children: <GroupChartTopIdol />,
    },
  ];
  return (
    <div>
      <Title level={3}>
        {intl.formatMessage({
          id: 'pages.chartTopIdol.title',
          defaultMessage: 'Chart Top Idol',
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

export default ChartTopIdol;
