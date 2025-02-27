import { STATUS_TYPE } from '@/constants/statusType';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Input, Select, UploadFile } from 'antd';
import { debounce } from 'lodash';
import { useState } from 'react';
import CreateUpdateForm from './CreateUpdateForm';
import DataTopicVoteTable from './DataTable';

export type SelectStatus = {
  label: string;
  value: string;
};

export const listSelectStatus: SelectStatus[] = [
  { label: 'On going', value: STATUS_TYPE.ONGOING_TYPE },
  { label: 'Closed', value: STATUS_TYPE.CLOSE_TYPE },
];

const TopicVote = () => {
  const intl = useIntl();
  const [curTopicVote, setCurTopicVote] = useState<API.VoteItem>();
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showRankingResult, setShowRankingResult] = useState<boolean>(false);
  const [curBannerFile, setCurBannerFile] = useState<UploadFile<any>[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>();
  const [currentName, setCurrentName] = useState<string | null>(null);

  const handleStatusChange = (x: string) => {
    setCurrentStatus(x);
  };

  const handleNameChange = debounce((x: string) => {
    setCurrentName(x);
  }, 1000);

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
              id: 'pages.vote.topicVote.placeholderSearch',
              defaultMessage: 'Search by Topic Name',
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
      <DataTopicVoteTable
        curTopicVote={curTopicVote}
        setCurTopicVote={setCurTopicVote}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        setShowModalForm={setShowModalForm}
        showRankingResult={showRankingResult}
        setShowRankingResult={setShowRankingResult}
        currentStatus={currentStatus}
        reload={reload}
        setReload={setReload}
        currentName={currentName}
        setCurBannerFile={setCurBannerFile}
        loading={loading}
        setLoading={setLoading}
      />
      <CreateUpdateForm
        showModal={showModalForm}
        showDrawer={showDrawer}
        setShowModal={setShowModalForm}
        curItem={curTopicVote}
        setReload={setReload}
        setCurTopicVote={setCurTopicVote}
        curBannerFile={curBannerFile}
        setCurBannerFile={setCurBannerFile}
      />
    </div>
  );
};

export default TopicVote;
