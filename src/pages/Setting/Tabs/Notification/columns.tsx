import { FormatDateTime } from '@/utils/datetime';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getIntl } from '@umijs/max';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const configColumns = (
  showDeleteConfirm: (id: number) => void,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentNotification: React.Dispatch<React.SetStateAction<API.NotificationItem | undefined>>,
): ColumnsType<API.NotificationItem> => {
  const handleClickEdit = (x: API.NotificationItem) => {
    setCurrentNotification(x);
    setShowModal(true);
  };

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>, x: API.NotificationItem) => {
    e.stopPropagation();
    showDeleteConfirm(x.id ?? -1);
  };

  const intl = getIntl();

  return [
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.updatedDate',
        defaultMessage: 'Updated Date',
      })}`,
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      width: '15%',
      render: (_, original) => {
        return <div>{FormatDateTime(original.updatedDate ?? '')}</div>;
      },
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.title',
        defaultMessage: 'Title',
      })}`,
      dataIndex: 'title',
      key: 'title',
      width: '61%',
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.action',
        defaultMessage: 'Action',
      })}`,
      dataIndex: 'action',
      key: 'action',
      width: '9%',
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
