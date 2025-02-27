import { STATUS_TYPE } from '@/constants/statusType';
import { SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Input, Select, UploadFile } from 'antd';
import { FC, useState } from 'react';
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

interface RequestOpenVoteDetailProps {
  communityDetail?: API.CommunityItem | undefined;
  setReloadAllVote: React.Dispatch<React.SetStateAction<boolean>>;
}

const RequestOpenVoteDetail: FC<RequestOpenVoteDetailProps> = ({
  communityDetail,
  setReloadAllVote,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [curRequestOpenVote, setCurRequestOpenVote] = useState<API.VoteItem>();
  const [curBannerFile, setCurBannerFile] = useState<UploadFile<any>[]>([]);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string | null>(null);

  const [currentStatus, setCurrentStatus] = useState<string>();

  const handleStatusChange = (x: string) => {
    setCurrentStatus(x);
  };

  const handleNameChange = (x: string) => {
    setCurrentName(x);
  };

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
            value={currentStatus}
          />
        </div>
      </div>
      <DataRequestOpenVoteTable
        curRequestOpenVote={curRequestOpenVote}
        setCurRequestOpenVote={setCurRequestOpenVote}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        reload={reload}
        setReload={setReload}
        currentStatus={currentStatus}
        currentName={currentName}
        loading={loading}
        setLoading={setLoading}
        setShowModalForm={setShowModalForm}
      />
      <CreateUpdateForm
        showModal={showModalForm}
        setShowModal={setShowModalForm}
        curItem={curRequestOpenVote}
        setCurRequestOpenVote={setCurRequestOpenVote}
        setReload={setReload}
        setShowDrawer={setShowDrawer}
        communityDetail={communityDetail}
        curBannerFile={curBannerFile}
        setCurBannerFile={setCurBannerFile}
        setReloadAllVote={setReloadAllVote}
      />
    </div>
  );
};

export default RequestOpenVoteDetail;
