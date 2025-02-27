import avatarDefault from '@/../public/images/avatar-default.png';
import { FormatNumber } from '@/utils/common';
import { getUrlImage } from '@/utils/media';
import { getIntl } from '@umijs/max';
import { ColumnsType } from 'antd/es/table';

export const columns = (): ColumnsType<API.CommunityItem> => {
  const intl = getIntl();

  return [
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.community',
        defaultMessage: 'Community',
      })}`,
      dataIndex: 'community',
      key: 'community',
      width: '60%',
      render: (_, original) => (
        <div
          style={{
            fontSize: '13px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <img
            src={
              original.avatarFileName?.length ? getUrlImage(original.avatarFileName) : avatarDefault
            }
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '9999px',
            }}
          />
          <span>{original.communityName}</span>
        </div>
      ),
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.dailyChart',
        defaultMessage: 'Daily Chart',
      })}`,
      dataIndex: 'dailyVoteAmount',
      key: 'dailyVoteAmount',
      width: '10%',
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.pds',
        defaultMessage: 'PDS',
      })}`,
      dataIndex: 'pDs',
      key: 'pDs',
      width: '10%',
      render: (_, original) => <div>{FormatNumber(original.pDs ?? 0)}</div>,
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.post',
        defaultMessage: 'Posts',
      })}`,
      dataIndex: 'totalPost',
      key: 'totalPost',
      width: '10%',
      render: (_, original) => <div>{FormatNumber(original.totalPost ?? 0)}</div>,
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.vote',
        defaultMessage: 'Vote',
      })}`,
      dataIndex: 'dailyVoteAmount',
      key: 'dailyVoteAmount',
      width: '10%',
      render: (_, original) => <div>{FormatNumber(original.dailyVoteAmount ?? 0)}</div>,
    },
  ];
};
