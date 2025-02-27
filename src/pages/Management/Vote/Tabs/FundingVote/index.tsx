import { STATUS_TYPE } from '@/constants/statusType';
import { getIdols } from '@/services/management/idols';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Input, Select, UploadFile } from 'antd';
import { debounce } from 'lodash';
import { FC, useEffect, useState } from 'react';
import CreateUpdateForm from './CreateUpdateForm';
import DataFundingVoteTable from './DataTable';

export const listSelectStatus: SelectStatus[] = [
  { label: 'On going', value: STATUS_TYPE.ONGOING_TYPE },
  { label: 'Booking', value: STATUS_TYPE.BOOKING_TYPE },
  { label: 'Closed', value: STATUS_TYPE.CLOSE_TYPE },
];

interface FundingVoteProps {
  reloadAllVote: boolean;
}

const FundingVote: FC<FundingVoteProps> = ({ reloadAllVote }) => {
  const intl = useIntl();
  const [curFundingVote, setCurFundingVote] = useState<API.VoteItem>();
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [curBannerFile, setCurBannerFile] = useState<UploadFile<any>[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>();
  const [currentIdol, setCurrentIdol] = useState<number>();

  const [listSelectIdol, setListSelectIdol] = useState<API.IdolItem[]>([]);

  const handleStatusChange = (x: string) => {
    setCurrentStatus(x);
  };

  const handleNameChange = debounce((x: string) => {
    setCurrentName(x);
  }, 1000);

  const handleGetListSelectIdol = async () => {
    setOpLoading(true);
    const res = await getIdols({ idolType: null, PageNumber: null, PageSize: null });
    if (res) {
      setListSelectIdol(res.data ?? []);
    }
    setOpLoading(false);
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
              marginBottom: '24px',
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
          <ProFormSelect
            fieldProps={{
              loading: opLoading,
            }}
            allowClear
            placeholder={`${intl.formatMessage({
              id: 'pages.vote.fundingVote.placeholderSelect',
              defaultMessage: 'Select Idol Vote',
            })}`}
            options={listSelectIdol.map((op) => ({ label: op.idolName, value: op.id }))}
            onChange={(e: number) => setCurrentIdol(e)}
            showSearch
            width={200}
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
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        currentStatus={currentStatus}
        reload={reload}
        setReload={setReload}
        currentIdol={currentIdol}
        currentName={currentName}
        setCurBannerFile={setCurBannerFile}
        loading={loading}
        setLoading={setLoading}
        reloadAllVote={reloadAllVote}
      />
      <CreateUpdateForm
        showModal={showModalForm}
        showDrawer={showDrawer}
        setShowModal={setShowModalForm}
        curItem={curFundingVote}
        setReload={setReload}
        setCurFundingVote={setCurFundingVote}
        listSelectIdol={listSelectIdol}
        curBannerFile={curBannerFile}
        setCurBannerFile={setCurBannerFile}
      />
    </div>
  );
};

export default FundingVote;

type SelectStatus = {
  label: string;
  value: string;
};
