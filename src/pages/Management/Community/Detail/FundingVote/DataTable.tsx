import avatarDefault from '@/../public/images/avatar-default.png';
import pointLogo from '@/../public/images/point-logo.png';
import { STATUS_TYPE } from '@/constants/statusType';
import { VOTE_TYPE } from '@/constants/voteType';
import { IPagination } from '@/pages/Management/ChartTopIdol/Tabs/Group/DataGroupTable';
import { getFundingCommunity } from '@/services/management/community';
import { deleteVote, getVoteById } from '@/services/management/vote';
import { FormatNumber } from '@/utils/common';
import { FormatBirthday } from '@/utils/datetime';
import { getUrlImage } from '@/utils/media';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useIntl, useParams } from '@umijs/max';
import {
  Button,
  Drawer,
  Image,
  Modal,
  Progress,
  Spin,
  Table,
  Tag,
  Typography,
  UploadFile,
  message,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { configColumns } from './columns';

interface DataFundingVoteTableProps {
  curFundingVote?: API.VoteItem;
  setCurFundingVote: React.Dispatch<React.SetStateAction<API.VoteItem | undefined>>;
  setShowModalForm: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetCurFundingVote: (x: API.VoteItem) => void;
  showDrawer: boolean;
  reload: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setCurBannerFile: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  currentName: string | null;
  currentStatus?: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  reloadAllVote: boolean;
}

const DataFundingVoteTable: FC<DataFundingVoteTableProps> = ({
  curFundingVote,
  setCurFundingVote,
  setShowModalForm,
  handleSetCurFundingVote,
  showDrawer,
  setShowDrawer,
  reload,
  setReload,
  setCurBannerFile,
  currentName,
  currentStatus,
  loading,
  setLoading,
  reloadAllVote,
}) => {
  const paramUrl = useParams();
  const { Title } = Typography;
  const intl = useIntl();

  const [resApi, setResApi] = useState<API.ResCommunity>();
  const [pagination, setPagination] = useState<IPagination>({
    pageNumber: 1,
    pageSize: 15,
  });

  const [curDrawerFundingVote, setCurDrawerFundingVote] = useState<API.VoteItem>();

  const handleGetCurFundingVote = async () => {
    if (curFundingVote?.voteId) {
      const res = await getVoteById(curFundingVote?.voteId ?? -1);
      setCurDrawerFundingVote(res);
    }
  };

  const handleGetCurFundingVoteForm = async () => {
    setShowModalForm(true);
    if (curFundingVote?.voteId) {
      const res = await getVoteById(curFundingVote?.voteId ?? -1);
      setCurFundingVote(res);
    }
  };

  const { confirm } = Modal;
  const showDeleteConfirm = (id: number) => {
    confirm({
      title: `${intl.formatMessage({
        id: 'pages.vote.fundingVote.delete',
        defaultMessage: 'Delete this Funding vote',
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
          setReload((pre) => !pre);
          setShowDrawer(false);
          setCurFundingVote({});
          setCurBannerFile([]);
        } catch (error) {
          console.error('Error:', error);
        }
      },
    });
  };
  const handleClickRow = (x: API.VoteItem) => {
    setCurFundingVote(x);
    setShowDrawer(true);
  };

  const handleGetVoteData = async (isFilterChange?: boolean) => {
    setLoading(true);
    if (isFilterChange) {
      setPagination({ ...pagination, pageNumber: 1 });
    }
    const res = await getFundingCommunity({
      voteType: VOTE_TYPE.FUNDING_TYPE,
      communityId: Number(paramUrl.id),
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
    handleGetVoteData(true);
    handleGetCurFundingVote();
  }, [reload, currentName, currentStatus, curFundingVote, reloadAllVote]);

  useEffect(() => {
    handleGetVoteData();
    handleGetCurFundingVote();
  }, [pagination?.pageNumber]);

  return (
    <div className="wrapp-table">
      <Table
        loading={loading}
        columns={configColumns(handleSetCurFundingVote, showDeleteConfirm)}
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
          setCurFundingVote({});
          setCurBannerFile([]);
          setCurDrawerFundingVote({});
        }}
        width={500}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="default"
              onClick={(e) => {
                e.stopPropagation();
                showDeleteConfirm(curFundingVote?.voteId ?? -1);
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
            <Button type="primary" onClick={() => handleGetCurFundingVoteForm()}>
              <EditOutlined />
              <span>
                {intl.formatMessage({
                  id: 'pages.button.edit',
                  defaultMessage: 'Edit',
                })}
              </span>
            </Button>
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
            src={getUrlImage(curDrawerFundingVote?.bannerFileName ?? '')}
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
          {curDrawerFundingVote?.voteName}
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
                  ${curDrawerFundingVote?.status === STATUS_TYPE.ONGOING_TYPE ? '#5DC983' : ''}
                  ${curDrawerFundingVote?.status === STATUS_TYPE.BOOKING_TYPE ? '#E9B558' : ''}
                  ${curDrawerFundingVote?.status === STATUS_TYPE.CLOSE_TYPE ? '#848484' : ''}
                `,
                backgroundColor: `
                  ${curDrawerFundingVote?.status === STATUS_TYPE.ONGOING_TYPE ? '#E7F7EC' : ''}
                  ${curDrawerFundingVote?.status === STATUS_TYPE.BOOKING_TYPE ? '#FDF3E4' : ''}
                  ${curDrawerFundingVote?.status === STATUS_TYPE.CLOSE_TYPE ? '#F0F0F0' : ''}
                `,
                fontSize: '13px',
              }}
            >
              {curDrawerFundingVote?.status}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.user.form.startDate',
                defaultMessage: 'Start Date',
              })}
            </div>
            <div>{FormatBirthday(curDrawerFundingVote?.startDate ?? '')}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.topicVote.endDate',
                defaultMessage: 'End Date',
              })}
            </div>
            <div>{FormatBirthday(curDrawerFundingVote?.endDate ?? '')}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.fundingVote.form.reward',
                defaultMessage: 'Reward',
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
              {curDrawerFundingVote?.rewardDetail}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.fundingVote.goal',
                defaultMessage: 'Goal',
              })}
            </div>
            <div
              style={{
                display: 'flex',
                gap: '4px',
              }}
            >
              <img
                src={pointLogo}
                alt="point"
                style={{
                  height: '16px',
                }}
              />
              <span>
                {curDrawerFundingVote?.goalPoint
                  ? FormatNumber(curDrawerFundingVote?.goalPoint ?? 0)
                  : intl.formatMessage({
                      id: 'pages.vote.fundingVote.form.unlimited',
                      defaultMessage: 'Unlimited',
                    })}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.fundingVote.form.idolVote',
                defaultMessage: 'Idol Vote',
              })}
            </div>
            <div>
              <Tag
                style={{
                  fontSize: '13px',
                  display: 'flex',
                  gap: '4px',
                  padding: '4px 8px',
                }}
              >
                <img
                  src={
                    getUrlImage(curDrawerFundingVote?.idolsToVote?.[0]?.avatarFileName ?? '') ??
                    avatarDefault
                  }
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '9999px',
                  }}
                />
                <span>{curDrawerFundingVote?.idolsToVote?.[0]?.idolName}</span>
              </Tag>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.fundingVote.vote',
                defaultMessage: 'Vote',
              })}
            </div>
            <Progress style={{ width: '200px' }} percent={curDrawerFundingVote?.vote} />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '108px', fontSize: '14px', fontWeight: 400, color: '#616161' }}>
              {intl.formatMessage({
                id: 'pages.vote.topicVote.form.content',
                defaultMessage: 'Content',
              })}
            </div>
            <div style={{ maxWidth: '332px', lineBreak: 'anywhere' }}>
              {curDrawerFundingVote?.voteContent}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DataFundingVoteTable;
