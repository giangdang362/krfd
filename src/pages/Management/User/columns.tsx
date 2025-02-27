import avatarDefault from '@/../public/images/avatar-default.png';
import { STATUS_TYPE } from '@/constants/statusType';
import { FormatBirthday } from '@/utils/datetime';
import { getUrlImage } from '@/utils/media';
import { EditOutlined } from '@ant-design/icons';
import { getIntl } from '@umijs/max';
import { Button, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import pointIcon from '../../../../public/images/point-icon.png';

export const configColumns = (
  handleSetCurUser: (x: API.User) => void,
  handleReload: () => void,
): ColumnsType<API.User> => {
  const handleClickEdit = (x: API.User) => {
    handleSetCurUser(x);
    handleReload();
  };

  const intl = getIntl();

  return [
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.id',
        defaultMessage: 'ID',
      })}`,
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.userName',
        defaultMessage: 'Use Name',
      })}`,
      dataIndex: 'userName',
      key: 'userName',
      width: '21%',
      render: (_, original) => (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <img
            style={{ borderRadius: '9999px', width: '26px', height: '26px' }}
            src={
              original.avatarFileName?.length ? getUrlImage(original.avatarFileName) : avatarDefault
            }
          />
          <div>{original.userName}</div>
        </div>
      ),
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.lastDate',
        defaultMessage: 'Last login Date',
      })}`,
      dataIndex: 'lastLoginDate',
      key: 'lastLoginDate',
      width: '12%',
      render: (_, original) => {
        return <div>{FormatBirthday(original.lastLoginDate ?? '')}</div>;
      },
    },
    {
      title: (
        <div style={{ display: 'flex', gap: '4px' }}>
          <img src={pointIcon} style={{ width: '16px', height: '16px', marginTop: '3px' }} />
          <p style={{ margin: '0px' }}>
            {intl.formatMessage({
              id: 'pages.table.columns.point',
              defaultMessage: 'Point',
            })}
          </p>
        </div>
      ),
      dataIndex: 'honeyPoint',
      key: 'honeyPoint',
      width: '12%',
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.idolFollow',
        defaultMessage: 'Idol Follow',
      })}`,
      dataIndex: 'idolFollow',
      key: 'idolFollow',
      width: '24%',
      render: (_, original) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {!original.idolFollows?.length && ' - '}
          {original.idolFollows?.map((item, indexI) => {
            return (
              <>
                {indexI <= 4 && (
                  <Tag style={{ fontSize: '13px', margin: '0' }}>{item.idolName}</Tag>
                )}
              </>
            );
          })}
          {original.idolFollows && original.idolFollows?.length > 5 && (
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
                  }}
                >
                  {original.idolFollows?.map((item, indexI) => {
                    return (
                      <>{indexI > 4 && <Tag style={{ fontSize: '13px' }}>{item.idolName}</Tag>}</>
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
            color: `${original.isActive ? '#5DC983' : '#EB5769'}`,
            backgroundColor: `${original.isActive ? '#E7F7EC' : '#FCE6E9'}`,
            fontSize: '13px',
          }}
        >
          {original.isActive ? STATUS_TYPE.ACTIVED : STATUS_TYPE.NOT_ACTIVATED}
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
      width: '8%',
      render: (_, original) => (
        <Button
          style={{ padding: '2px 6px', border: 'none' }}
          onClick={() => handleClickEdit(original)}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ];
};
