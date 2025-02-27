import { VOTE_TYPE } from '@/constants/voteType';
import { getIdols } from '@/services/management/idols';
import { postApproveOpenVote, putVote } from '@/services/management/vote';
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
import { useIntl } from '@umijs/max';
import { Form, Modal, UploadFile, message } from 'antd';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FC, useEffect, useState } from 'react';

dayjs.extend(utc);

interface CreateUpdateFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curItem?: API.VoteItem;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setCurRequestOpenVote: React.Dispatch<React.SetStateAction<API.VoteItem | undefined>>;
  curBannerFile: UploadFile<any>[];
  setCurBannerFile: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  setReloadAllVote: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateUpdateForm: FC<CreateUpdateFormProps> = ({
  showModal,
  curItem,
  setShowModal,
  setReload,
  setShowDrawer,
  setCurRequestOpenVote,
  curBannerFile,
  setCurBannerFile,
  setReloadAllVote,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [listSelectIdol, setListSelectIdol] = useState<API.IdolItem[]>([]);
  const [membersSelected, setMemberSelected] = useState<number[] | undefined>();
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
    setShowDrawer(false);
    setReload((pre) => !pre);
    setCurRequestOpenVote({});
    setMemberSelected([]);
    setCurBannerFile([]);
    setLoading(false);
    form.resetFields();
  };
  const handleSave = async (formItem: API.VoteItem) => {
    setLoading(true);
    let nameBanner;
    if (bannerFile) {
      nameBanner = await postImage(bannerFile);
    }
    const payload: API.VotePayload = {
      voteName: formItem.voteName,
      voteTypeId: VOTE_TYPE.REQUEST_OPEN_TYPE,
      startDate: dayjs(formItem.dateRange[0]).utc().format('YYYY-MM-DD HH:mm'),
      endDate: dayjs(formItem.dateRange[1]).utc().format('YYYY-MM-DD HH:mm'),
      bannerFileName: nameBanner ?? curItem?.bannerFileName,
      voteContent: formItem.voteContent ?? '',
      goalPoint: formItem.goalPoint ?? 0,
      reward: formItem.reward ?? '',
      idolIds: membersSelected,
    };

    await putVote(payload, curItem?.voteId ?? -1).then(() => {
      message.success(
        `${intl.formatMessage({
          id: 'pages.createSuccess',
          defaultMessage: 'Create successfully!',
        })}`,
      );
    });
    await postApproveOpenVote(curItem?.voteId ?? -1)
      .then(() => {
        message.success(
          `${intl.formatMessage({
            id: 'pages.approveSuccess',
            defaultMessage: 'Approve successfully!',
          })}`,
        );
        setReloadAllVote((pre) => !pre);
      })
      .then(() => {
        handleCloseModal();
      });
    setLoading(false);
  };

  const handleGetListSolo = async () => {
    const res = await getIdols({ idolType: null, PageNumber: null, PageSize: null });
    if (res) {
      setListSelectIdol(res.data ?? []);
    }
  };

  console.log('curItem', curItem);

  useEffect(() => {
    form.setFieldValue('voteName', curItem?.voteName);
    if (curItem?.startDate && curItem?.endDate) {
      form.setFieldValue('dateRange', [
        format(parseISO(curItem?.startDate), 'yyyy-MM-dd HH:mm'),
        format(parseISO(curItem?.endDate), 'yyyy-MM-dd HH:mm'),
      ]);
    }
    form.setFieldValue('community', curItem?.community);
    form.setFieldValue('status', curItem?.status);
    form.setFieldValue('voteContent', curItem?.voteContent);
    form.setFieldValue('goalPoint', curItem?.goalPoint);
    form.setFieldValue(
      'idols',
      curItem?.idols?.map((item) => item.id),
    );
    form.setFieldValue('bannerFileName', curItem?.bannerFileName);
    if (curItem?.voteId && curItem?.bannerFileName)
      setCurBannerFile([
        {
          uid: '-1',
          name: curItem?.bannerFileName || '',
          status: 'done',
          url: getUrlImage(curItem?.bannerFileName ?? ''),
        },
      ]);

    if (curItem?.voteId) {
      let x: number[] = [];
      x.push(curItem.idols?.[0]?.id ?? -1);
      setMemberSelected(x);
    }

    handleGetListSolo();
  }, [curItem]);

  return (
    <Modal
      title={`${intl.formatMessage({
        id: 'pages.vote.request.form.titleEdits',
        defaultMessage: 'Create Vote',
      })}`}
      open={showModal}
      onCancel={() => {
        setShowDrawer(true);
        setShowModal(false);
      }}
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
            id: 'pages.vote.fundingVote.form.date',
            defaultMessage: 'Start Date - End Date',
          })}`}
          rules={[formItemRule.required()]}
        />
        <div style={{ display: 'flex', gap: '15px' }}>
          <ProFormDigit
            label={`${intl.formatMessage({
              id: 'pages.vote.fundingVote.goal',
              defaultMessage: 'Goal',
            })}`}
            name={'goalPoint'}
            placeholder=""
            rules={[
              formItemRule.required(),
              {
                validator: (_, value) => {
                  if (value < 100) {
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
          />
          <ProFormSelect
            label={`${intl.formatMessage({
              id: 'pages.vote.fundingVote.form.idolVote',
              defaultMessage: 'Idol Vote',
            })}`}
            name={'idols'}
            placeholder={`${intl.formatMessage({
              id: 'pages.vote.topicVote.form.placeholderSelectIdol',
              defaultMessage: 'Select Idol',
            })}`}
            options={listSelectIdol.map((op) => ({ label: op.idolName, value: op.id }))}
            mode="single"
            onChange={(e: number) => {
              let x: number[] = [];
              x.push(e);
              setMemberSelected(x);
            }}
            rules={[formItemRule.required()]}
            showSearch
          />
        </div>
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
