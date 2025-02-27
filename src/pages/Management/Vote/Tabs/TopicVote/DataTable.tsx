import avatarDefault from '@/../public/images/avatar-default.png';
import { STATUS_TYPE } from '@/constants/statusType';
import { VOTE_TYPE } from '@/constants/voteType';
import { IPagination } from '@/pages/Management/ChartTopIdol/Tabs/Group/DataGroupTable';
import { deleteVote, getVote, getVoteById } from '@/services/management/vote';
import { FormatBirthday } from '@/utils/datetime';
import { getUrlImage } from '@/utils/media';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import {
  Button,
  Drawer,
  Image,
  Modal,
  Spin,
  Table,
  Tag,
  Typography,
  UploadFile,
  message,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import RankingResultModal from './RankingResultModal';
import { configColumns } from './columns';

interface DataTopicVoteTableProps {
  curTopicVote?: API.VoteItem;
  setCurTopicVote: React.Dispatch<React.SetStateAction<API.VoteItem | undefined>>;
  setShowModalForm: React.Dispatch<React.SetStateAction<boolean>>;
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  showRankingResult: boolean;
  setShowRankingResult: React.Dispatch<React.SetStateAction<boolean>>;
  currentStatus?: string;
  reload?: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  currentName: string | null;
  setCurBannerFile: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTopicVoteTable: FC<DataTopicVoteTableProps> = ({
  showDrawer,
  setShowDrawer,
  setShowModalForm,
  curTopicVote,
  setCurTopicVote,
  showRankingResult,
  setShowRankingResult,
  currentStatus,
  reload,
  setReload,
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
  const [curDrawerTopicVote, setCurDrawerTopicVote] = useState<API.VoteItem>();

  const handleGetCurTopicVote = async () => {
    if (curTopicVote?.voteId) {
      const res = await getVoteById(curTopicVote?.voteId ?? -1);
      setCurDrawerTopicVote(res);
    }
  };

  const handleGetCurTopicVoteForm = async () => {
    setShowModalForm(true);
    if (curTopicVote?.voteId) {
      const res = await getVoteById(curTopicVote?.voteId ?? -1);
      setCurTopicVote(res);
    }
  };

  const { confirm } = Modal;
  const showDeleteConfirm = (id: number) => {
    confirm({
      title: `${intl.formatMessage({
        id: 'pages.vote.topicVote.delete',
        defaultMessage: 'Delete this Topic Vote',
      })}`,
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: `${intl.formatMessage({
        id: 'pages.vote.topicVote.deleteContent',
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
          setCurTopicVote({});
          setCurBannerFile([]);
        } catch (error) {
          console.error('Error:', error);
        }
      },
    });
  };
  const handleClickRow = (x: API.VoteItem) => {
    setCurTopicVote(x);
    setShowDrawer(true);
  };

  const handleGetTopicVote = async (isFilterChange?: boolean) => {
    setLoading(true);
    if (isFilterChange) {
      setPagination({ ...pagination, pageNumber: 1 });
    }
    const res = await getVote({
      voteType: VOTE_TYPE.TOPIC_TYPE,
      idolId: undefined,
      keyWords: currentName,
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
  useEffect(() => {
    handleGetTopicVote(true);
    handleGetCurTopicVote();
  }, [curTopicVote, currentStatus, reload, currentName]);

  useEffect(() => {
    handleGetTopicVote();
    handleGetCurTopicVote();
  }, [pagination?.pageNumber]);

  return (
    <div className="wrapp-table">
      <Table
        loading={loading}
        columns={configColumns(showDeleteConfirm, setShowModalForm, setCurTopicVote)}
        dataSource={resApi?.data}
        pagination={{
          showQuickJumper: true,
          defaultCurrent: 1,
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
          setShowDrawer(false);
          setCurDrawerTopicVote({});
          setCurBannerFile([]);
          setCurTopicVote({});
        }}
        width={500}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="default"
              onClick={(e) => {
                e.stopPropagation();
                showDeleteConfirm(curDrawerTopicVote?.voteId ?? -1);
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
            <>
              {curDrawerTopicVote?.status !== STATUS_TYPE.CLOSE_TYPE ? (
                <Button type="primary" onClick={() => handleGetCurTopicVoteForm()}>
                  <EditOutlined />
                  <span>
                    {intl.formatMessage({
                      id: 'pages.button.edit',
                      defaultMessage: 'Edit',
                    })}
                  </span>
                </Button>
              ) : (
                <Button type="primary" onClick={() => setShowRankingResult(true)}>
                  <EyeOutlined />
                  <span>
                    {intl.formatMessage({
                      id: 'pages.button.view',
                      defaultMessage: 'View Result',
                    })}
                  </span>
                </Button>
              )}
            </>
          </div>
        }
      >
        <Image
          src={getUrlImage(curDrawerTopicVote?.bannerFileName ?? '')}
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
        <Title
          level={4}
          style={{ padding: '16px 0', borderBottom: '1px dash #E0E0E0', textAlign: 'center' }}
        >
          {curDrawerTopicVote?.voteName}
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
                color: `${
                  curDrawerTopicVote?.status === STATUS_TYPE.ONGOING_TYPE ? '#5DC983' : '#848484'
                }`,
                backgroundColor: `${
                  curDrawerTopicVote?.status === STATUS_TYPE.ONGOING_TYPE ? '#E7F7EC' : '#F0F0F0'
                }`,
                fontSize: '13px',
              }}
            >
              {curDrawerTopicVote?.status}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.user.form.startDate',
                defaultMessage: 'Start Date',
              })}
            </div>
            <div>{FormatBirthday(curDrawerTopicVote?.startDate ?? '')}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.topicVote.endDate',
                defaultMessage: 'End Date',
              })}
            </div>
            <div>{FormatBirthday(curDrawerTopicVote?.endDate ?? '')}</div>
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
              {curDrawerTopicVote?.idolsToVote?.map((item, index) => (
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
          {curDrawerTopicVote?.status === STATUS_TYPE.CLOSE_TYPE && (
            <div style={{ display: 'flex' }}>
              <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
                {intl.formatMessage({
                  id: 'pages.vote.topicVote.form.linkToReward',
                  defaultMessage: 'Link to Reward',
                })}
              </div>
              <div style={{ maxWidth: '332px', lineBreak: 'anywhere' }}>
                {curDrawerTopicVote?.rewardDetail}
              </div>
            </div>
          )}
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.topicVote.form.content',
                defaultMessage: 'Content',
              })}
            </div>
            <div style={{ maxWidth: '332px', lineBreak: 'anywhere' }}>
              {curDrawerTopicVote?.voteContent}
            </div>
          </div>
        </div>
        <RankingResultModal
          showModal={showRankingResult}
          setShowModal={setShowRankingResult}
          curTopicVote={curDrawerTopicVote}
        />
      </Drawer>
    </div>
  );
};

export default DataTopicVoteTable;
