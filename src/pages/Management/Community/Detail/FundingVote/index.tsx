import { STATUS_TYPE } from '@/constants/statusType';
import { getIdols } from '@/services/management/idols';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Input, Select, UploadFile } from 'antd';
import { FC, useEffect, useState } from 'react';
import CreateUpdateForm from './CreateUpdateForm';
import DataFundingVoteTable from './DataTable';

export const listSelectStatus: SelectStatus[] = [
  { label: 'On going', value: STATUS_TYPE.ONGOING_TYPE },
  { label: 'Booking', value: STATUS_TYPE.BOOKING_TYPE },
  { label: 'Closed', value: STATUS_TYPE.CLOSE_TYPE },
];

interface FundingVoteDetailProps {
  communityDetail?: API.CommunityItem | undefined;
  reloadAllVote: boolean;
}

const FundingVoteDetail: FC<FundingVoteDetailProps> = ({ communityDetail, reloadAllVote }) => {
  const intl = useIntl();
  const [curFundingVote, setCurFundingVote] = useState<API.VoteItem>();

  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listSelectIdol, setListSelectIdol] = useState<API.IdolItem[]>([]);
  const [curBannerFile, setCurBannerFile] = useState<UploadFile<any>[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>();
  const [currentName, setCurrentName] = useState<string | null>(null);

  const handleStatusChange = (value: string) => {
    setCurrentStatus(value);
  };

  const handleNameChange = (x: string) => {
    setCurrentName(x);
  };

  const handleSetCurFundingVote = (x: API.VoteItem) => {
    setCurFundingVote(x);
    setShowModalForm(true);
  };
  const handleGetListSelectIdol = async () => {
    const res = await getIdols({ idolType: null, PageNumber: null, PageSize: null });
    if (res) {
      setListSelectIdol(res.data ?? []);
    }
  };

  useEffect(() => {
    handleGetListSelectIdol();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '12px',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: '10px',
          }}
        >
          <Input
            style={{
              width: '200px',
            }}
            placeholder={`${intl.formatMessage({
              id: 'pages.vote.fundingVote.placeholderSearch',
              defaultMessage: 'Search by Funding Name',
            })}`}
            prefix={<SearchOutlined />}
            onChange={(e) => handleNameChange(e.target.value)}
            allowClear
          />
          <Select
            allowClear
            placeholder={`${intl.formatMessage({
              id: 'pages.vote.topicVote.placeholderSelect',
              defaultMessage: 'Select status',
            })}`}
            style={{
              width: '200px',
            }}
            options={listSelectStatus.map((op) => ({ label: op.label, value: op.value }))}
            onChange={handleStatusChange}
            value={currentStatus}
          />
        </div>
        <Button
          type="primary"
          style={{
            display: 'flex',
            gap: '2px',
            alignItems: 'center',
          }}
          onClick={() => setShowModalForm(true)}
        >
          <PlusOutlined />
          <span>
            {intl.formatMessage({
              id: 'pages.button.add',
              defaultMessage: 'Add',
            })}
          </span>
        </Button>
      </div>
      <DataFundingVoteTable
        curFundingVote={curFundingVote}
        setCurFundingVote={setCurFundingVote}
        setShowModalForm={setShowModalForm}
        handleSetCurFundingVote={handleSetCurFundingVote}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        reload={reload}
        setReload={setReload}
        setCurBannerFile={setCurBannerFile}
        currentName={currentName}
        currentStatus={currentStatus}
        loading={loading}
        setLoading={setLoading}
        reloadAllVote={reloadAllVote}
      />
      <CreateUpdateForm
        showModal={showModalForm}
        setShowModal={setShowModalForm}
        curItem={curFundingVote}
        setCurFundingVote={setCurFundingVote}
        listSelectIdol={listSelectIdol}
        showDrawer={showDrawer}
        setReload={setReload}
        curBannerFile={curBannerFile}
        setCurBannerFile={setCurBannerFile}
        communityDetail={communityDetail}
      />
    </div>
  );
};

export default FundingVoteDetail;

type SelectStatus = {
  label: string;
  value: string;
};
