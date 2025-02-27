import { deleteNotification, getAllNotification } from '@/services/setting/notification';
import { FormatDateTime } from '@/utils/datetime';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Drawer, Modal, Table, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import '../../../Management/styles/styleTable.css';
import { configColumns } from './columns';

interface DataNotificationTableProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentNotification?: API.NotificationItem;
  setCurrentNotification: React.Dispatch<React.SetStateAction<API.NotificationItem | undefined>>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataNotificationTable: FC<DataNotificationTableProps> = ({
  setShowModal,
  currentNotification,
  setCurrentNotification,
  reload,
  setReload,
  loading,
  setLoading,
  showDrawer,
  setShowDrawer,
}) => {
  const intl = useIntl();
  const { confirm } = Modal;
  const [notificationData, setNotificationData] = useState<API.NotificationItem[]>([]);
  const handleClickRow = (x: API.NotificationItem) => {
    setCurrentNotification(x);
    setShowDrawer(true);
  };
  const showDeleteConfirm = (notificationId?: number) => {
    confirm({
      title: `${intl.formatMessage({
        id: 'pages.settings.notification.delete',
        defaultMessage: 'Delete this Notification vote',
      })}`,
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: `${intl.formatMessage({
        id: 'pages.settings.notification.deleteContent',
        defaultMessage: 'Do you really want to delete this item? This process can not be undone.',
      })}`,
      okText: `${intl.formatMessage({
        id: 'pages.button.delete',
        defaultMessage: 'Delete',
      })}`,
      okType: 'danger',
      cancelText: `${intl.formatMessage({
        id: 'pages.button.cancel',
        defaultMessage: 'Cancel',
      })}`,
      onOk() {
        deleteNotification(notificationId)
          .then(() => {
            message.success(
              `${intl.formatMessage({
                id: 'pages.deleteSuccess',
                defaultMessage: 'Delete successfully!',
              })}`,
            );
            setReload((pre) => !pre);
            setShowDrawer(false);
          })
          .catch(() => {
            message.error(
              `${intl.formatMessage({
                id: 'pages.wrong',
                defaultMessage: 'Something went wrong!',
              })}`,
            );
          });
      },
    });
  };
  const getNotifications = async () => {
    setLoading(true);
    await getAllNotification().then((data) => {
      setNotificationData(data);
    });
    setLoading(false);
  };

  useEffect(() => {
    getNotifications();
  }, [reload, currentNotification]);

  const FooterDrawerNoti = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          style={{
            display: 'flex',
            gap: '2px',
            alignItems: 'center',
            border: '1px solid #FFF',
          }}
          onClick={(e) => {
            e.stopPropagation();
            showDeleteConfirm(currentNotification?.id);
          }}
        >
          <DeleteOutlined style={{ color: 'red' }} />
          <span style={{ color: 'red' }}>
            {intl.formatMessage({
              id: 'pages.button.delete',
              defaultMessage: 'Delete',
            })}
          </span>
        </Button>
        <Button
          type="primary"
          style={{
            display: 'flex',
            gap: '2px',
            alignItems: 'center',
          }}
          onClick={() => setShowModal(true)}
        >
          <EditOutlined />
          <span>
            {intl.formatMessage({
              id: 'pages.button.edit',
              defaultMessage: 'Edit',
            })}
          </span>
        </Button>
      </div>
    );
  };

  return (
    <div className="wrapp-table">
      <Table
        loading={loading}
        columns={configColumns(showDeleteConfirm, setShowModal, setCurrentNotification)}
        dataSource={notificationData}
        onRow={(record) => {
          return {
            onClick: () => {
              handleClickRow(record);
            },
          };
        }}
      />
      <Drawer
        title={
          <div style={{ fontSize: '22px' }}>
            {intl.formatMessage({
              id: 'pages.settings.notification.titleDetail',
              defaultMessage: 'Notification Detail',
            })}
          </div>
        }
        placement="right"
        onClose={() => {
          setShowDrawer(false);
          setCurrentNotification({});
        }}
        open={showDrawer}
        width={500}
        footer={<FooterDrawerNoti />}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100px' }}>
              {intl.formatMessage({
                id: 'pages.settings.notification.form.title',
                defaultMessage: 'Title',
              })}
            </div>
            <div
              style={{
                fontSize: '15px',
                color: '#242424',
                maxWidth: '332px',
                lineBreak: 'anywhere',
              }}
            >
              {currentNotification?.title}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100px' }}>
              {intl.formatMessage({
                id: 'pages.settings.notification.updateOn',
                defaultMessage: 'Update on',
              })}
            </div>
            <div
              style={{
                fontSize: '15px',
                color: '#242424',
                maxWidth: '332px',
                lineBreak: 'anywhere',
              }}
            >
              {FormatDateTime(currentNotification?.updatedDate ?? '')}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100px' }}>
              {intl.formatMessage({
                id: 'pages.settings.notification.desc',
                defaultMessage: 'Description',
              })}
            </div>
            <div
              style={{
                fontSize: '15px',
                color: '#242424',
                maxWidth: '332px',
                lineBreak: 'anywhere',
              }}
            >
              {currentNotification?.description}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DataNotificationTable;
