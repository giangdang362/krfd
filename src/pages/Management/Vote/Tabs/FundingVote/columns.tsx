import { STATUS_TYPE } from '@/constants/statusType';
import { FormatBirthday } from '@/utils/datetime';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getIntl } from '@umijs/max';
import { Button, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const configColumns = (
  showDeleteConfirm: (id: number) => void,
  setShowModalForm: React.Dispatch<React.SetStateAction<boolean>>,
  setCurFundingVote: React.Dispatch<React.SetStateAction<API.VoteItem | undefined>>,
): ColumnsType<API.VoteItem> => {
  const handleClickEdit = (x: API.VoteItem) => {
    setCurFundingVote(x);
    setShowModalForm(true);
  };

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>, x: API.VoteItem) => {
    e.stopPropagation();
    showDeleteConfirm(x.voteId ?? -1);
  };

  const intl = getIntl();

  return [
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.voteTitle',
        defaultMessage: 'Vote Title',
      })}`,
      dataIndex: 'voteName',
      key: 'voteName',
      width: '35%',
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.startDate',
        defaultMessage: 'Start Date',
      })}`,
      dataIndex: 'startDate',
      key: 'startDate',
      width: '10%',
      render: (_, original) => {
        return <div>{FormatBirthday(original.startDate ?? '')}</div>;
      },
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.endDate',
        defaultMessage: 'End Date',
      })}`,
      dataIndex: 'endDate',
      key: 'endDate',
      width: '10%',
      render: (_, original) => {
        return <div>{FormatBirthday(original.endDate ?? '')}</div>;
      },
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.reward',
        defaultMessage: 'Reward',
      })}`,
      dataIndex: 'rewardDetail',
      key: 'rewardDetail',
      width: '15%',
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.idolVote',
        defaultMessage: 'Idol Vote',
      })}`,
      dataIndex: 'idolVote',
      key: 'idolVote',
      width: '10%',
      render: (_, original) => (
        <Tag style={{ fontSize: '13px' }}>{original?.idols?.[0]?.idolName}</Tag>
      ),
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.status',
        defaultMessage: 'Status',
      })}`,
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (_, original) => (
        <div
          style={{
            display: 'flex',
            fontWeight: 600,
            width: 'fit-content',
            padding: '4px 12px',
            borderRadius: '30px',
            color: `
              ${original.status === STATUS_TYPE.ONGOING_TYPE ? '#5DC983' : ''}
              ${original.status === STATUS_TYPE.BOOKING_TYPE ? '#E9B558' : ''}
              ${original.status === STATUS_TYPE.CLOSE_TYPE ? '#848484' : ''}
            `,
            backgroundColor: `
              ${original.status === STATUS_TYPE.ONGOING_TYPE ? '#E7F7EC' : ''}
              ${original.status === STATUS_TYPE.BOOKING_TYPE ? '#FDF3E4' : ''}
              ${original.status === STATUS_TYPE.CLOSE_TYPE ? '#F0F0F0' : ''}
            `,
            fontSize: '13px',
          }}
        >
          {original.status}
        </div>
      ),
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.action',
        defaultMessage: 'Action',
      })}`,
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (_, original) => (
        <div
          style={{
            display: 'flex',
            gap: '6px',
          }}
        >
          <Button
            style={{ padding: '2px 6px', border: 'none' }}
            onClick={(e) => {
              e.stopPropagation();
              handleClickEdit(original);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            style={{ padding: '2px 6px', border: 'none' }}
            onClick={(e) => handleDelete(e, original)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];
};
