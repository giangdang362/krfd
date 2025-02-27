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
import { FC, useEffect, useState } from 'react';

const keyLabel = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5'];

const TopicVote: FC = () => {
  const intl = useIntl();
  const [reload, setReload] = useState<boolean>(false);
  const [listOptionsTopic, setListOptionsTopic] = useState<API.VoteItem[]>([]);
  const [listTopicVoteMainPage, setListTopicVoteMainPage] = useState<API.TopicFundingVote[]>([]);

  const [form] = Form.useForm();

  const [id1, setId1] = useState<number>();
  const [id2, setId2] = useState<number>();
  const [id3, setId3] = useState<number>();
  const [id4, setId4] = useState<number>();
  const [id5, setId5] = useState<number>();

  const handleGetListOptionsTopicVote = async () => {
    const res = await getVote({
      voteType: VOTE_TYPE.TOPIC_TYPE,
      idolId: undefined,
      PageNumber: null,
      PageSize: null,
    });
    setListOptionsTopic(res.data ?? []);
  };

  const handleGetListTopicVoteMainPage = async () => {
    const res = await getTopicFundingVoteMainPage({ voteType: VOTE_TYPE.TOPIC_TYPE });
    setListTopicVoteMainPage(res);
  };

  const handleSubmitTopicVoteMainPage = async () => {
    const listIds: number[] = listTopicVoteMainPage.map((item) => item.voteId ?? -1);

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
      voteType: VOTE_TYPE.TOPIC_TYPE,
      voteIds: listIds.filter((_, index) => index < 5),
    };

    await putTopicFundingVoteMainPage(payload).then(() => {
      message.success(
        `${intl.formatMessage({
          id: 'pages.updateSuccess',
          defaultMessage: 'Update successfully!',
        })}`,
      );
    });

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

  useEffect(() => {
    if (listTopicVoteMainPage.length) {
      form.setFieldValue('topic1', listTopicVoteMainPage?.[0]?.voteId);
      form.setFieldValue('topic2', listTopicVoteMainPage?.[1]?.voteId);
      form.setFieldValue('topic3', listTopicVoteMainPage?.[2]?.voteId);
      form.setFieldValue('topic4', listTopicVoteMainPage?.[3]?.voteId);
      form.setFieldValue('topic5', listTopicVoteMainPage?.[4]?.voteId);
    }
  }, [listTopicVoteMainPage]);

  useEffect(() => {
    handleGetListTopicVoteMainPage();
    handleGetListOptionsTopicVote();
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
                id: 'pages.mainPage.topicVote.title',
                defaultMessage: 'Topic Vote',
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
      <div style={{ marginTop: '16px' }}>
        <Form
          form={form}
          layout="vertical"
          name="roleForm"
          onFinish={handleSubmitTopicVoteMainPage}
        >
          <ProFormSelect
            name={'topic1'}
            label={`${intl.formatMessage({
              id: 'pages.mainPage.fundingVote.fundingVote1',
              defaultMessage: 'Topic 1',
            })}`}
            options={listOptionsTopic.map((item) => ({ label: item.voteName, value: item.voteId }))}
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
            name={'topic2'}
            label={`${intl.formatMessage({
              id: 'pages.mainPage.fundingVote.fundingVote2',
              defaultMessage: 'Topic 2',
            })}`}
            options={listOptionsTopic.map((item) => ({ label: item.voteName, value: item.voteId }))}
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
            name={'topic3'}
            label={`${intl.formatMessage({
              id: 'pages.mainPage.fundingVote.fundingVote3',
              defaultMessage: 'Topic 3',
            })}`}
            options={listOptionsTopic.map((item) => ({ label: item.voteName, value: item.voteId }))}
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
            name={'topic4'}
            label={`${intl.formatMessage({
              id: 'pages.mainPage.fundingVote.fundingVote4',
              defaultMessage: 'Topic 4',
            })}`}
            options={listOptionsTopic.map((item) => ({ label: item.voteName, value: item.voteId }))}
            onChange={(e: number) => setId4(e)}
            placeholder={intl.formatMessage({
              id: 'pages.mainPage.topicVote.placholder',
              defaultMessage: 'Please select a status',
            })}
            showSearch
            rules={[{ validator: (_, value) => checkDuplicateItem(value, keyLabel[3]) }]}
          />
          <ProFormSelect
            name={'topic5'}
            label={`${intl.formatMessage({
              id: 'pages.mainPage.fundingVote.fundingVote5',
              defaultMessage: 'Topic 5',
            })}`}
            options={listOptionsTopic.map((item) => ({ label: item.voteName, value: item.voteId }))}
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
    </div>
  );
};

export default TopicVote;
