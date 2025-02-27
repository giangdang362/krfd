import { STATUS_TYPE } from '@/constants/statusType';
import { getAllIdolCommunity } from '@/services/management/community';
import { SearchOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Input, Select, UploadFile } from 'antd';
import { debounce } from 'lodash';
import { FC, useEffect, useState } from 'react';
import CreateUpdateForm from './CreateUpdateForm';
import DataRequestOpenVoteTable from './DataTable';

type SelectType = {
  label: string;
  value: string;
};

export const listSelectStatus: SelectType[] = [
  { label: 'Waiting Approve', value: STATUS_TYPE.WAITING_APPROVE_TYPE },
  { label: 'Rejected', value: STATUS_TYPE.REJECT_TYPE },
];

interface RequestOpenVoteProps {
  setReloadAllVote: React.Dispatch<React.SetStateAction<boolean>>;
}

const RequestOpenVote: FC<RequestOpenVoteProps> = ({ setReloadAllVote }) => {
  const intl = useIntl();
  const [curRequestOpenVote, setCurRequestOpenVote] = useState<API.VoteItem>();
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [opLoading, setOpLoading] = useState<boolean>(false);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [curBannerFile, setCurBannerFile] = useState<UploadFile<any>[]>([]);

  const [currentStatus, setCurrentStatus] = useState<string>();
  const [currentCommunity, setCurrentCommunity] = useState<number>();
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [listSelectIdol, setListSelectIdol] = useState<API.CommunityItem[]>([]);

  const handleGetListOptionSelect = async () => {
    setOpLoading(true);
    const res = await getAllIdolCommunity({
      PageNumber: null,
      PageSize: null,
    });
    if (res) {
      setListSelectIdol(res.data ?? []);
    }
    setOpLoading(false);
  };

  const handleStatusChange = (x: string) => {
    setCurrentStatus(x);
  };

  const handleNameChange = debounce((x: string) => {
    setCurrentName(x);
  }, 1000);

  useEffect(() => {
    handleGetListOptionSelect();
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
              id: 'pages.vote.request.placeholderSearch',
              defaultMessage: 'Search by Vote Title',
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
          />
          <ProFormSelect
            fieldProps={{
              loading: opLoading,
            }}
            allowClear
            placeholder={`${intl.formatMessage({
              id: 'pages.vote.request.placeholderCommunity',
              defaultMessage: 'Search Community',
            })}`}
            options={listSelectIdol.map((op) => ({ label: op.communityName, value: op.id }))}
            onChange={(e: number) => setCurrentCommunity(e)}
            showSearch
            width={200}
          />
        </div>
      </div>
      <DataRequestOpenVoteTable
        curRequestOpenVote={curRequestOpenVote}
        setCurRequestOpenVote={setCurRequestOpenVote}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        setShowModalForm={setShowModalForm}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        currentStatus={currentStatus}
        reload={reload}
        setReload={setReload}
        currentName={currentName}
        currentCommunity={currentCommunity}
        setCurBannerFile={setCurBannerFile}
        loading={loading}
        setLoading={setLoading}
      />
      <CreateUpdateForm
        showModal={showModalForm}
        setShowModal={setShowModalForm}
        curItem={curRequestOpenVote}
        setReload={setReload}
        setShowDrawer={setShowDrawer}
        setCurRequestOpenVote={setCurRequestOpenVote}
        curBannerFile={curBannerFile}
        setCurBannerFile={setCurBannerFile}
        setReloadAllVote={setReloadAllVote}
      />
    </div>
  );
};

export default RequestOpenVote;
