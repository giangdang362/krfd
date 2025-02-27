import { VOTE_TYPE } from '@/constants/voteType';
import ButtonForm from '@/pages/components/ButtonForm/ButtonForm';
import TitleCurrentPage from '@/pages/components/TitleCurrentPage';
import {
  getTopicFundingVoteMainPage,
  putTopicFundingVoteMainPage,
} from '@/services/management/main-page';
import { getVote } from '@/services/management/vote';
import { formItemRule } from '@/utils/ruleForm';
import { ProFormSelect } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, message } from 'antd';
import { useEffect, useState } from 'react';

const keyLabel = ['fundingvote1', 'fundingvote2', 'fundingvote3', 'fundingvote4', 'fundingvote5'];

const FundingVote = () => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const [reload, setReload] = useState<boolean>(false);
  const [listOptionsFunding, setListOptionsFunding] = useState<API.VoteItem[]>([]);
  const [listFundingVoteMainPage, setListFundingVoteMainPage] = useState<API.TopicFundingVote[]>(
    [],
  );

  const [id1, setId1] = useState<number>();
  const [id2, setId2] = useState<number>();
  const [id3, setId3] = useState<number>();
  const [id4, setId4] = useState<number>();
  const [id5, setId5] = useState<number>();

  const handleGetTopicVote = async () => {
    const res = await getVote({
      voteType: VOTE_TYPE.FUNDING_TYPE,
      idolId: undefined,
      PageNumber: null,
      PageSize: null,
    });
    setListOptionsFunding(res.data ?? []);
  };

  const handleSubmitFundingVoteMainPage = async () => {
    const listIds: number[] = listFundingVoteMainPage.map((item) => item.voteId ?? -1);

    if (id1) {
      listIds[0] = id1;
    }
    if (id2) {
      listIds[1] = id2;
    }
    if (id3) {
      listIds[2] = id3;
    }
    if (id4) {
      listIds[3] = id4;
    }
    if (id5) {
      listIds[4] = id5;
    }

    const payload: API.TopicFundingVotePayload = {
      voteType: VOTE_TYPE.FUNDING_TYPE,
      voteIds: listIds.filter((_, index) => index < 5),
    };

    await putTopicFundingVoteMainPage(payload).then(() =>
      message.success(
        `${intl.formatMessage({
          id: 'pages.updateSuccess',
          defaultMessage: 'Update successfully!',
        })}`,
      ),
    );
    setReload(!reload);
  };

  const checkDuplicateItem = (numberId: number, key: string) => {
    const otherInputValue = form.getFieldsValue();

    let hasDuplicate = false;
    let message = '';
    for (const k of Object.keys(otherInputValue)) {
      if (k !== key && otherInputValue?.[k] === numberId && numberId) {
        hasDuplicate = true;
        message = `${intl.formatMessage({
          id: 'pages.duplicated',
          defaultMessage: 'This item is duplicated!',
        })}`;
      }
    }
    if (hasDuplicate) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  };

  const handleGetListTopicVote = async () => {
    const res = await getTopicFundingVoteMainPage({ voteType: VOTE_TYPE.FUNDING_TYPE });
    if (res) {
      setListFundingVoteMainPage(res);
    }
    setReload(true);
  };

  useEffect(() => {
    if (listFundingVoteMainPage) {
      form.setFieldValue('fundingvote1', listFundingVoteMainPage?.[0]?.voteId);
      form.setFieldValue('fundingvote2', listFundingVoteMainPage?.[1]?.voteId);
      form.setFieldValue('fundingvote3', listFundingVoteMainPage?.[2]?.voteId);
      form.setFieldValue('fundingvote4', listFundingVoteMainPage?.[3]?.voteId);
      form.setFieldValue('fundingvote5', listFundingVoteMainPage?.[4]?.voteId);
    }
    handleGetListTopicVote();
    handleGetTopicVote();
  }, [reload]);

  return (
    <div
      style={{
        maxWidth: '800px',
      }}
    >
      <TitleCurrentPage
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ color: '#C8467C', fontWeight: '600', marginBottom: '0px' }}>
              {intl.formatMessage({
                id: 'pages.mainPage.fundingVote.title',
                defaultMessage: 'Funding Vote',
              })}
            </p>
            <ButtonForm
              onCancel={() => {
                form.resetFields();
                setReload(!reload);
              }}
              onSubmit={() => form.submit()}
            />
          </div>
        }
      />
      <Form
        style={{ marginTop: '16px' }}
        form={form}
        layout="vertical"
        name="roleForm"
        onFinish={handleSubmitFundingVoteMainPage}
      >
        <ProFormSelect
          name={'fundingvote1'}
          label={`${intl.formatMessage({
            id: 'pages.mainPage.fundingVote.fundingVote1',
            defaultMessage: 'Funding Vote 1',
          })}`}
          options={listOptionsFunding.map((item) => ({ label: item.voteName, value: item.voteId }))}
          onChange={(e: number) => setId1(e)}
          placeholder={intl.formatMessage({
            id: 'pages.mainPage.topicVote.placholder',
            defaultMessage: 'Please select a status',
          })}
          showSearch
          rules={[
            { validator: (_, value) => checkDuplicateItem(value, keyLabel[0]) },
            formItemRule.required(),
          ]}
        />
        <ProFormSelect
          name={'fundingvote2'}
          label={`${intl.formatMessage({
            id: 'pages.mainPage.fundingVote.fundingVote2',
            defaultMessage: 'Funding Vote 2',
          })}`}
          options={listOptionsFunding.map((item) => ({ label: item.voteName, value: item.voteId }))}
          onChange={(e: number) => setId2(e)}
          placeholder={intl.formatMessage({
            id: 'pages.mainPage.topicVote.placholder',
            defaultMessage: 'Please select a status',
          })}
          showSearch
          rules={[
            { validator: (_, value) => checkDuplicateItem(value, keyLabel[1]) },
            formItemRule.required(),
          ]}
        />
        <ProFormSelect
          name={'fundingvote3'}
          label={`${intl.formatMessage({
            id: 'pages.mainPage.fundingVote.fundingVote3',
            defaultMessage: 'Funding Vote 3',
          })}`}
          options={listOptionsFunding.map((item) => ({ label: item.voteName, value: item.voteId }))}
          onChange={(e: number) => setId3(e)}
          placeholder={intl.formatMessage({
            id: 'pages.mainPage.topicVote.placholder',
            defaultMessage: 'Please select a status',
          })}
          showSearch
          rules={[
            { validator: (_, value) => checkDuplicateItem(value, keyLabel[2]) },
            formItemRule.required(),
          ]}
        />
        <ProFormSelect
          name={'fundingvote4'}
          label={`${intl.formatMessage({
            id: 'pages.mainPage.fundingVote.fundingVote4',
            defaultMessage: 'Funding Vote 4',
          })}`}
          options={listOptionsFunding.map((item) => ({ label: item.voteName, value: item.voteId }))}
          onChange={(e: number) => setId4(e)}
          placeholder={intl.formatMessage({
            id: 'pages.mainPage.topicVote.placholder',
            defaultMessage: 'Please select a status',
          })}
          showSearch
          rules={[{ validator: (_, value) => checkDuplicateItem(value, keyLabel[3]) }]}
        />
        <ProFormSelect
          name={'fundingvote5'}
          label={`${intl.formatMessage({
            id: 'pages.mainPage.fundingVote.fundingVote5',
            defaultMessage: 'Funding Vote 5',
          })}`}
          options={listOptionsFunding.map((item) => ({ label: item.voteName, value: item.voteId }))}
          onChange={(e: number) => setId5(e)}
          placeholder={intl.formatMessage({
            id: 'pages.mainPage.topicVote.placholder',
            defaultMessage: 'Please select a status',
          })}
          showSearch
          rules={[{ validator: (_, value) => checkDuplicateItem(value, keyLabel[4]) }]}
        />
      </Form>
    </div>
  );
};

export default FundingVote;
