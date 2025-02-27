import { VOTE_TYPE } from '@/constants/voteType';
import { getIdols } from '@/services/management/idols';
import { postVote, putVote } from '@/services/management/vote';
import { postImage } from '@/services/media';
import { getUrlImage } from '@/utils/media';
import { formItemRule } from '@/utils/ruleForm';
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, Modal, UploadFile, message } from 'antd';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FC, useEffect, useState } from 'react';

dayjs.extend(utc);

interface CreateUpdateFormProps {
  showModal: boolean;
  showDrawer: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curItem?: API.VoteItem;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setCurTopicVote: React.Dispatch<React.SetStateAction<API.VoteItem | undefined>>;
  curBannerFile: UploadFile<any>[];
  setCurBannerFile: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
}

const CreateUpdateForm: FC<CreateUpdateFormProps> = ({
  showModal,
  showDrawer,
  curItem,
  setShowModal,
  setReload,
  setCurTopicVote,
  curBannerFile,
  setCurBannerFile,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<FormData | undefined>();
  const [form] = Form.useForm();
  const [listSelectIdol, setListSelectIdol] = useState<API.IdolItem[]>([]);
  const [membersSelected, setMemberSelected] = useState<number[]>([]);
  const handleBannerChange = async (file: File | undefined) => {
    const formDataBanner = new FormData();
    if (file) {
      formDataBanner.append('file', file);
      setBannerFile(formDataBanner);
    } else {
      setBannerFile(undefined);
    }
  };

  const listIdolShowForm: API.IdolItem[] | undefined = curItem?.idols || curItem?.idolsToVote;

  const handleCloseModal = () => {
    setShowModal(false);
    if (showDrawer === false) {
      setCurTopicVote({});
      setCurBannerFile([]);
      setMemberSelected([]);
    }
    form.resetFields();
    setReload((pre) => !pre);
    setLoading(false);
  };

  const handleSave = async (formItem: API.VoteItem) => {
    setLoading(true);
    let nameBanner;
    if (bannerFile) {
      nameBanner = await postImage(bannerFile);
    }

    const payload: API.VotePayload = {
      voteName: formItem.voteName,
      voteTypeId: VOTE_TYPE.TOPIC_TYPE,
      startDate: dayjs(formItem.dateRange[0]).utc().format('YYYY-MM-DD HH:mm'),
      endDate: dayjs(formItem.dateRange[1]).utc().format('YYYY-MM-DD HH:mm'),
      reward: formItem.rewardDetail,
      bannerFileName: nameBanner ?? curItem?.bannerFileName,
      voteContent: formItem.voteContent,
      goalPoint: formItem.goalPoint ?? 0,
      idolIds: membersSelected.length
        ? membersSelected
        : listIdolShowForm?.map((item) => item.id ?? -1),
    };

    let curIdols: API.IdolItem[] = [];
    listSelectIdol.forEach((itemS) => {
      (payload.idolIds as number[]).forEach((id) => {
        if (itemS.id === id) {
          curIdols.push(itemS);
        }
      });
    });

    if (!curItem?.voteId) {
      postVote(payload)
        .then(() => {
          message.success(
            `${intl.formatMessage({
              id: 'pages.createSuccess',
              defaultMessage: 'Create successfully!',
            })}`,
          );
        })
        .then(() => {
          handleCloseModal();
        });
    } else {
      putVote(payload, curItem.voteId)
        .then(() => {
          message.success(
            `${intl.formatMessage({
              id: 'pages.updateSuccess',
              defaultMessage: 'Update successfully!',
            })}`,
          );
        })
        .then(() => {
          handleCloseModal();
        });
    }
    setLoading(false);
  };

  const handleGetListSolo = async () => {
    const res = await getIdols({ idolType: null, PageNumber: null, PageSize: null });
    if (res) {
      setListSelectIdol(res.data ?? []);
    }
  };

  useEffect(() => {
    if (curItem?.voteId)
      setCurBannerFile([
        {
          uid: '-1',
          name: curItem?.bannerFileName || '',
          status: 'done',
          url: getUrlImage(curItem?.bannerFileName ?? ''),
        },
      ]);
    form.setFieldValue('voteName', curItem?.voteName);
    if (curItem?.startDate && curItem?.endDate) {
      form.setFieldValue('dateRange', [
        format(parseISO(curItem?.startDate), 'yyyy-MM-dd HH:mm'),
        format(parseISO(curItem?.endDate), 'yyyy-MM-dd HH:mm'),
      ]);
    }
    form.setFieldValue(
      'idolVote',
      listIdolShowForm?.map((item) => item.id),
    );
    form.setFieldValue('status', curItem?.status);
    form.setFieldValue('voteContent', curItem?.voteContent);
    form.setFieldValue('rewardDetail', curItem?.rewardDetail);
    form.setFieldValue('bannerFileName', curItem?.bannerFileName);
    handleGetListSolo();
  }, [curItem]);

  return (
    <Modal
      title={
        !curItem?.voteId
          ? `${intl.formatMessage({
              id: 'pages.vote.topicVote.form.titleAdd',
              defaultMessage: 'Add Topic Vote',
            })}`
          : `${intl.formatMessage({
              id: 'pages.vote.topicVote.form.titleEdit',
              defaultMessage: 'Edit Topic Vote',
            })}`
      }
      open={showModal}
      onCancel={handleCloseModal}
      okText={`${intl.formatMessage({
        id: 'pages.button.save',
        defaultMessage: 'Save',
      })}`}
      cancelText={`${intl.formatMessage({
        id: 'pages.button.cancel',
        defaultMessage: 'Cancel',
      })}`}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        name="roleForm"
        onFinish={handleSave}
        style={{
          padding: '12px 0',
        }}
      >
        <ProFormText
          label={`${intl.formatMessage({
            id: 'pages.vote.topicVote.form.topicName',
            defaultMessage: 'Topic Name',
          })}`}
          name={'voteName'}
          placeholder={''}
          rules={[formItemRule.required()]}
        />
        <ProFormDateRangePicker
          allowClear
          name={'dateRange'}
          fieldProps={{
            showTime: { format: 'HH:mm' },
            format: 'YYYY-MM-DD HH:mm',
          }}
          placeholder={[
            `${intl.formatMessage({
              id: 'pages.vote.topicVote.form.placeholderStartDate',
              defaultMessage: 'Start Date',
            })}`,
            `${intl.formatMessage({
              id: 'pages.vote.topicVote.form.placeholderEndDate',
              defaultMessage: 'End Date',
            })}`,
          ]}
          label={`${intl.formatMessage({
            id: 'pages.vote.topicVote.form.date',
            defaultMessage: 'Start Date/ End Date',
          })}`}
          rules={[formItemRule.required()]}
        />
        <ProFormSelect
          label={`${intl.formatMessage({
            id: 'pages.vote.topicVote.form.idolVote',
            defaultMessage: 'Idol vote',
          })}`}
          name={'idolVote'}
          placeholder={`${intl.formatMessage({
            id: 'pages.vote.topicVote.form.placeholderSelectIdol',
            defaultMessage: 'Select Idol',
          })}`}
          options={listSelectIdol.map((op) => ({ label: op.idolName, value: op.id }))}
          mode="multiple"
          onChange={(e: number[]) => setMemberSelected(e)}
          rules={[formItemRule.required()]}
        />
        <ProFormText
          label={`${intl.formatMessage({
            id: 'pages.vote.topicVote.form.linkToReward',
            defaultMessage: 'Link to Reward',
          })}`}
          name={'rewardDetail'}
          placeholder={''}
          rules={[formItemRule.required()]}
        />
        <ProFormUploadButton
          label={`${intl.formatMessage({
            id: 'pages.vote.topicVote.form.banner',
            defaultMessage: 'Banner',
          })}`}
          title={`${intl.formatMessage({
            id: 'pages.button.upload',
            defaultMessage: 'Upload',
          })}`}
          name={'bannerFileName'}
          max={1}
          fieldProps={{
            onRemove: () => setCurBannerFile([]),
          }}
          fileList={curBannerFile}
          onChange={(e) => {
            if (e.fileList.length > 0) {
              handleBannerChange(e.fileList[0].originFileObj);
              setCurBannerFile(e.fileList);
            }
          }}
          rules={[formItemRule.required()]}
        />
        <ProFormTextArea
          label={`${intl.formatMessage({
            id: 'pages.vote.topicVote.form.content',
            defaultMessage: 'Content',
          })}`}
          name="voteContent"
          placeholder={`${intl.formatMessage({
            id: 'pages.vote.topicVote.form.placeholderContent',
            defaultMessage: 'Note',
          })}`}
          rules={[formItemRule.required()]}
        />
      </Form>
    </Modal>
  );
};

export default CreateUpdateForm;
