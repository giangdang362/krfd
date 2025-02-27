import avatarDefault from '@/../public/images/avatar-default.png';
import { STATUS_TYPE } from '@/constants/statusType';
import { IPagination } from '@/pages/Management/ChartTopIdol/Tabs/Group/DataGroupTable';
import { deleteVote, getRequestOpenVote, postRejectOpenVote } from '@/services/management/vote';
import { FormatBirthday } from '@/utils/datetime';
import { getUrlImage } from '@/utils/media';
import { DeleteOutlined, ExclamationCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import {
  Button,
  Drawer,
  Image,
  Modal,
  Popover,
  Spin,
  Table,
  Tag,
  Typography,
  UploadFile,
  message,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { configColumns } from './columns';

interface DataRequestOpenVoteTableProps {
  curRequestOpenVote?: API.VoteItem;
  setCurRequestOpenVote: React.Dispatch<React.SetStateAction<API.VoteItem | undefined>>;
  setShowModalForm: React.Dispatch<React.SetStateAction<boolean>>;
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  showRejectModal: boolean;
  setShowRejectModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentStatus?: string;
  reload?: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  currentCommunity: number | undefined;
  currentName: string | null;
  setCurBannerFile: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataRequestOpenVoteTable: FC<DataRequestOpenVoteTableProps> = ({
  curRequestOpenVote,
  setCurRequestOpenVote,
  setShowModalForm,
  showDrawer,
  setShowDrawer,
  showRejectModal,
  setShowRejectModal,
  currentStatus,
  reload,
  setReload,
  currentCommunity,
  currentName,
  setCurBannerFile,
  loading,
  setLoading,
}) => {
  const { Title } = Typography;
  const intl = useIntl();

  const [resApi, setResApi] = useState<API.ResVote>();
  const [pagination, setPagination] = useState<IPagination>({
    pageNumber: 1,
    pageSize: 15,
  });

  const handleReload = () => {
    setReload((pre) => !pre);
  };
  const { confirm } = Modal;
  const showDeleteConfirm = (id: number) => {
    confirm({
      title: `${intl.formatMessage({
        id: 'pages.vote.request.delete',
        defaultMessage: 'Delete this Request vote',
      })}`,
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: `${intl.formatMessage({
        id: 'pages.vote.request.deleteContent',
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
      onOk: async () => {
        try {
          await deleteVote(id).then(() => {
            message.success(
              `${intl.formatMessage({
                id: 'pages.deleteSuccess',
                defaultMessage: 'Delete successfully!',
              })}`,
            );
          });
          handleReload();
          setShowDrawer(false);
        } catch (error) {
          console.error('Error:', error);
        }
      },
    });
  };

  const handleClickRow = (x: API.VoteItem) => {
    setCurRequestOpenVote(x);
    setShowDrawer(true);
  };

  const handleClickReject = () => {
    setShowRejectModal(true);
  };
  const handClickConfirmReject = async () => {
    await postRejectOpenVote(curRequestOpenVote?.voteId ?? -1)
      .then(() => {
        message.success(
          `${intl.formatMessage({
            id: 'pages.rejectSuccess',
            defaultMessage: 'Reject successfully!',
          })}`,
        );
      })
      .then(() => {
        setShowRejectModal(false);
        setShowDrawer(false);
        setReload((pre) => !pre);
      });
  };
  const handleOpenChange = (newOpen: boolean) => {
    setShowRejectModal(newOpen);
  };

  const handleGetRequestVote = async (isFilterChange?: boolean) => {
    setLoading(true);
    if (isFilterChange) {
      setPagination({ ...pagination, pageNumber: 1 });
    }
    const res = await getRequestOpenVote({
      voteName: currentName,
      communityId: currentCommunity,
      PageNumber: isFilterChange ? 1 : pagination.pageNumber ?? -1,
      PageSize: pagination.pageSize ?? -1,
    });
    if (!currentStatus) {
      setResApi(res);
    } else {
      const newRes = res.data?.filter((item) => item.status === currentStatus);
      if (newRes) {
        setResApi({ ...resApi, data: newRes });
      }
    }
    setLoading(false);
  };
  const handleClickEdit = (x: API.VoteItem) => {
    setCurRequestOpenVote(x);
    setShowModalForm(true);
  };

  useEffect(() => {
    handleGetRequestVote(true);
  }, [curRequestOpenVote, currentStatus, reload, currentName, currentCommunity]);

  useEffect(() => {
    handleGetRequestVote();
  }, [pagination.pageNumber]);

  return (
    <div className="wrapp-table">
      <Table
        loading={loading}
        columns={configColumns(showDeleteConfirm)}
        dataSource={resApi?.data}
        pagination={{
          showQuickJumper: true,
          current: pagination.pageNumber,
          pageSize: pagination.pageSize,
          total: resApi?.totalCount,
          onChange: (e: number) => {
            setPagination({ ...pagination, pageNumber: e });
          },
        }}
        onRow={(record) => {
          return {
            onClick: () => handleClickRow(record),
          };
        }}
      />
      <Drawer
        placement="right"
        open={showDrawer}
        onClose={() => {
          setCurRequestOpenVote({});
          setCurBannerFile([]);
          setShowDrawer(false);
        }}
        width={500}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="default"
              onClick={(e) => {
                e.stopPropagation();
                showDeleteConfirm(curRequestOpenVote?.voteId ?? -1);
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
            {curRequestOpenVote?.status === STATUS_TYPE.WAITING_APPROVE_TYPE && (
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Popover
                  trigger="click"
                  open={showRejectModal}
                  onOpenChange={handleOpenChange}
                  content={() => (
                    <div
                      style={{
                        width: '270px',
                        padding: '4px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                        }}
                      >
                        <InfoCircleOutlined style={{ color: '#FAAD14' }} />
                        <span>
                          {intl.formatMessage({
                            id: 'pages.vote.request.reject',
                            defaultMessage:
                              'Are you sure you want to reject this Open Vote Request ?',
                          })}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '8px',
                        }}
                      >
                        <Button onClick={() => setShowRejectModal(false)}>
                          {intl.formatMessage({
                            id: 'pages.button.reject.no',
                            defaultMessage: 'No',
                          })}
                        </Button>
                        <Button type="primary" onClick={() => handClickConfirmReject()}>
                          {intl.formatMessage({
                            id: 'pages.button.reject.yes',
                            defaultMessage: 'Yes',
                          })}
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  <Button onClick={() => handleClickReject}>
                    {intl.formatMessage({
                      id: 'pages.button.reject',
                      defaultMessage: 'Reject',
                    })}
                  </Button>
                </Popover>
                <Button type="primary" onClick={() => handleClickEdit(curRequestOpenVote)}>
                  {intl.formatMessage({
                    id: 'pages.button.approve',
                    defaultMessage: 'Approve',
                  })}
                </Button>
              </div>
            )}
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            src={getUrlImage(curRequestOpenVote?.bannerFileName ?? '')}
            alt="Banner"
            style={{
              width: '440px',
              height: '220px',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
            placeholder={
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                }}
              >
                <Spin size="small" />
              </div>
            }
          />
        </div>
        <Title
          level={4}
          style={{ padding: '16px 0', borderBottom: '1px dash #E0E0E0', textAlign: 'center' }}
        >
          {curRequestOpenVote?.voteName}
        </Title>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '20px',
          }}
        >
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '108px',
                fontSize: '14px',
                fontWeight: 400,
                color: '#616161',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {intl.formatMessage({
                id: 'pages.user.form.status',
                defaultMessage: 'Status',
              })}
            </div>
            <div
              style={{
                display: 'flex',
                fontWeight: 600,
                width: 'fit-content',
                padding: '8px 12px',
                borderRadius: '30px',
                color: `
                  ${curRequestOpenVote?.status === STATUS_TYPE.APPROVE_TYPE ? '#5DC983' : ''}
                  ${
                    curRequestOpenVote?.status === STATUS_TYPE.WAITING_APPROVE_TYPE ? '#E9B558' : ''
                  }
                  ${curRequestOpenVote?.status === STATUS_TYPE.REJECT_TYPE ? '#848484' : ''}
                `,
                backgroundColor: `
                  ${curRequestOpenVote?.status === STATUS_TYPE.APPROVE_TYPE ? '#E7F7EC' : ''}
                  ${
                    curRequestOpenVote?.status === STATUS_TYPE.WAITING_APPROVE_TYPE ? '#FDF3E4' : ''
                  }
                  ${curRequestOpenVote?.status === STATUS_TYPE.REJECT_TYPE ? '#F0F0F0' : ''}
                `,
                fontSize: '13px',
              }}
            >
              {curRequestOpenVote?.status}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.fundingVote.form.idolVote',
                defaultMessage: 'Idol vote',
              })}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                rowGap: '6px',
                columnGap: '6px',
                maxWidth: '332px',
              }}
            >
              {curRequestOpenVote?.idols?.map((item, index) => (
                <Tag
                  key={index}
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
                      item.avatarFileName?.length ? getUrlImage(item.avatarFileName) : avatarDefault
                    }
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '9999px',
                    }}
                  />
                  <span>{item.idolName}</span>
                </Tag>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.table.columns.requestDate',
                defaultMessage: 'Request Date',
              })}
            </div>
            <div>{FormatBirthday(curRequestOpenVote?.requestDate ?? '')}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.topicVote.form.content',
                defaultMessage: 'Content',
              })}
            </div>
            <div style={{ maxWidth: '332px', lineBreak: 'anywhere' }}>
              {curRequestOpenVote?.voteContent}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DataRequestOpenVoteTable;
