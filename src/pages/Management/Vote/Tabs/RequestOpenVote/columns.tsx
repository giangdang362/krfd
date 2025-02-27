import avatarDefault from '@/../public/images/avatar-default.png';
import { STATUS_TYPE } from '@/constants/statusType';
import { FormatBirthday } from '@/utils/datetime';
import { getUrlImage } from '@/utils/media';
import { DeleteOutlined } from '@ant-design/icons';
import { getIntl } from '@umijs/max';
import { Button, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const configColumns = (
  showDeleteConfirm: (id: number) => void,
): ColumnsType<API.VoteItem> => {
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
      width: '45%',
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.community',
        defaultMessage: 'Community',
      })}`,
      dataIndex: 'community',
      key: 'community',
      width: '20%',
      render: (_, original) => (
        <div
          style={{
            fontSize: '13px',
            display: 'flex',
            gap: '4px',
          }}
        >
          {!original.idols?.length && ' - '}
          {original.idols?.map((item, index) => {
            return (
              <>
                {index <= 4 && (
                  <Tag
                    style={{
                      fontSize: '13px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '25px',
                      gap: '5px',
                      padding: '0 3px',
                      margin: '0px',
                    }}
                  >
                    <img
                      src={
                        item.avatarFileName?.length
                          ? getUrlImage(item.avatarFileName)
                          : avatarDefault
                      }
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                      }}
                    />
                    <span>{item.idolName}</span>
                  </Tag>
                )}
              </>
            );
          })}
          {original.idols && original.idols.length > 5 && (
            <Tooltip
              color="#FFF"
              placement="bottom"
              title={
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    rowGap: '6px',
                    backgroundColor: '#FFF',
                    padding: '0 3px',
                    margin: '0px',
                  }}
                >
                  {original.idols?.map((item, index) => {
                    return (
                      <>
                        {index > 4 && (
                          <Tag
                            style={{
                              fontSize: '13px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '25px',
                              gap: '5px',
                            }}
                          >
                            <img
                              src={
                                item.avatarFileName?.length
                                  ? getUrlImage(item.avatarFileName)
                                  : avatarDefault
                              }
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '9999px',
                              }}
                            />
                            <span>{item.idolName}</span>
                          </Tag>
                        )}
                      </>
                    );
                  })}
                </div>
              }
            >
              <Tag style={{ cursor: 'pointer' }}>...</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.requestDate',
        defaultMessage: 'Request Date',
      })}`,
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: '10%',
      render: (_, original) => {
        return <div>{FormatBirthday(original.requestDate ?? '')}</div>;
      },
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.status',
        defaultMessage: 'Status',
      })}`,
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (_, original) => (
        <div
          style={{
            display: 'flex',
            fontWeight: 600,
            width: 'fit-content',
            padding: '4px 12px',
            borderRadius: '30px',
            color: `
              ${original.status === STATUS_TYPE.APPROVE_TYPE ? '#5DC983' : ''}
              ${original.status === STATUS_TYPE.WAITING_APPROVE_TYPE ? '#E9B558' : ''}
              ${original.status === STATUS_TYPE.REJECT_TYPE ? '#848484' : ''}
            `,
            backgroundColor: `
              ${original.status === STATUS_TYPE.APPROVE_TYPE ? '#E7F7EC' : ''}
              ${original.status === STATUS_TYPE.WAITING_APPROVE_TYPE ? '#FDF3E4' : ''}
              ${original.status === STATUS_TYPE.REJECT_TYPE ? '#F0F0F0' : ''}
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
            onClick={(e) => handleDelete(e, original)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];
};
