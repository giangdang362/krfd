import { VOTE_TYPE } from '@/constants/voteType';
import { postVote, putVote } from '@/services/management/vote';
import { postImage } from '@/services/media';
import { getUrlImage } from '@/utils/media';
import { formItemRule } from '@/utils/ruleForm';
import {
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useIntl, useParams } from '@umijs/max';
import { Checkbox, Form, Modal, UploadFile, message } from 'antd';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';

interface CreateUpdateFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curItem?: API.VoteItem;
  setCurFundingVote: React.Dispatch<React.SetStateAction<API.VoteItem | undefined>>;
  listSelectIdol?: API.IdolItem[];
  showDrawer?: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  curBannerFile: UploadFile<any>[];
  setCurBannerFile: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  communityDetail?: API.CommunityItem | undefined;
}

const CreateUpdateForm: FC<CreateUpdateFormProps> = ({
  showModal,
  curItem,
  setShowModal,
  listSelectIdol,
  showDrawer,
  setCurFundingVote,
  setReload,
  curBannerFile,
  setCurBannerFile,
  communityDetail,
}) => {
  const paramUrl = useParams();
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(false);
  const [bannerFile, setBannerFile] = useState<FormData | undefined>();

  const handleBannerChange = async (file: File | undefined) => {
    const formDataBanner = new FormData();
    if (file) {
      formDataBanner.append('file', file);
      setBannerFile(formDataBanner);
    } else {
      setBannerFile(undefined);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (showDrawer === false) {
      setCurFundingVote({});
      setCurBannerFile([]);
      setIsUnlimited(false);
    }
    form?.resetFields();
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
      voteTypeId: VOTE_TYPE.FUNDING_TYPE,
      startDate: moment(formItem.dateRange[0]).format('YYYY-MM-DD'),
      endDate: moment(formItem.dateRange[1]).format('YYYY-MM-DD'),
      bannerFileName: nameBanner ?? curItem?.bannerFileName,
      voteContent: formItem.voteContent ?? '',
      goalPoint: formItem.goalPoint,
      isUnlimited: isUnlimited,
      reward: formItem.rewardDetail ?? '',
      idolIds: [communityDetail?.idolId ?? -1],
    };

    if (!curItem?.voteId) {
      await postVote({ ...payload, communityId: Number(paramUrl.id) })
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
      await putVote(payload, curItem.voteId)
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

  useEffect(() => {
    form.setFieldValue('voteName', curItem?.voteName);
    form.setFieldValue('dateRange', [curItem?.startDate, curItem?.endDate]);
    form.setFieldValue('reward', curItem?.reward);
    form.setFieldValue('goalPoint', curItem?.goalPoint);
    form.setFieldValue('vote', curItem?.vote);
    form.setFieldValue('status', curItem?.status);
    form.setFieldValue('voteContent', curItem?.voteContent);
    form.setFieldValue('rewardDetail', curItem?.rewardDetail);
    form.setFieldValue('rewardUrl', curItem?.rewardUrl);
    form.setFieldValue('bannerFileName', curItem?.bannerFileName);
    if (curItem?.voteId && curItem?.bannerFileName) {
      setCurBannerFile([
        {
          uid: '-1',
          name: curItem?.bannerFileName || '',
          status: 'done',
          url: getUrlImage(curItem?.bannerFileName ?? ''),
        },
      ]);
    }
    if (curItem?.isUnlimited) {
      setIsUnlimited(true);
    } else setIsUnlimited(false);
  }, [curItem]);

  return (
    <Modal
      title={
        !curItem?.voteId
          ? `${intl.formatMessage({
              id: 'pages.vote.fundingVote.form.titleAdd',
              defaultMessage: 'Add Funding Vote',
            })}`
          : `${intl.formatMessage({
              id: 'pages.vote.fundingVote.form.titleEdit',
              defaultMessage: 'Edit Funding Vote',
            })}`
      }
      open={showModal}
      onCancel={handleCloseModal}
      onOk={() => form.submit()}
      okText={`${intl.formatMessage({
        id: 'pages.button.save',
        defaultMessage: 'Save',
      })}`}
      cancelText={`${intl.formatMessage({
        id: 'pages.button.cancel',
        defaultMessage: 'Cancel',
      })}`}
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
          allowClear
          label={`${intl.formatMessage({
            id: 'pages.vote.fundingVote.form.voteTitle',
            defaultMessage: 'Vote Title',
          })}`}
          name={'voteName'}
          placeholder={''}
          rules={[formItemRule.required()]}
        />
        <ProFormDateRangePicker
          allowClear
          name={'dateRange'}
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
            id: 'pages.vote.fundingVote.form.date',
            defaultMessage: 'Start Date - End Date',
          })}`}
          rules={[formItemRule.required()]}
        />
        <ProFormText
          label={`${intl.formatMessage({
            id: 'pages.vote.fundingVote.form.reward',
            defaultMessage: 'Reward',
          })}`}
          name={'rewardDetail'}
          placeholder={`${intl.formatMessage({
            id: 'pages.vote.fundingVote.form.reward',
            defaultMessage: 'Reward',
          })}`}
          rules={[formItemRule.required()]}
        />
        <div
          style={{
            display: 'flex',
            gap: '30px',
          }}
        >
          <ProFormDigit
            label={`${intl.formatMessage({
              id: 'pages.vote.fundingVote.form.goal',
              defaultMessage: 'Goal (point)',
            })}`}
            style={{
              minWidth: '242px',
            }}
            name={'goalPoint'}
            placeholder={
              isUnlimited
                ? intl.formatMessage({
                    id: 'pages.vote.fundingVote.form.unlimited',
                    defaultMessage: 'Unlimited',
                  })
                : intl.formatMessage({
                    id: 'pages.vote.fundingVote.form.placeHoder.enterPoint',
                    defaultMessage: 'Enter point',
                  })
            }
            rules={[
              formItemRule.required(),
              {
                validator: (_, value) => {
                  if (value < 100 && isUnlimited === false) {
                    return Promise.reject(
                      `${intl.formatMessage({
                        id: 'pages.vote.fundingVote.form.minPoint',
                        defaultMessage: 'This field has a min value is 100 points',
                      })}`,
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            disabled={isUnlimited ? true : false}
          />
          <Checkbox
            name="isUnlimited"
            style={{ alignItems: 'center' }}
            onChange={(e) => {
              form.setFieldValue('goalPoint', 0);
              setIsUnlimited(e.target.checked);
            }}
            checked={isUnlimited}
          >
            {intl.formatMessage({
              id: 'pages.vote.fundingVote.form.unlimitedPoint',
              defaultMessage: 'Unlimited point',
            })}
          </Checkbox>
        </div>
        <ProFormSelect
          allowClear
          label={`${intl.formatMessage({
            id: 'pages.vote.fundingVote.form.idolVote',
            defaultMessage: 'Idol Vote',
          })}`}
          name={'idolIds'}
          placeholder={`${intl.formatMessage({
            id: 'pages.vote.fundingVote.form.placeholderIdolVote',
            defaultMessage: 'Select Idol Vote',
          })}`}
          options={listSelectIdol?.map((op) => ({ label: op.idolName, value: op.id }))}
          rules={[formItemRule.required()]}
          initialValue={communityDetail?.communityName}
          disabled
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
