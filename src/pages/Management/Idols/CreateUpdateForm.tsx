import { IDOL_TYPE } from '@/constants/idolType';
import { getIdols, postIdol, putIdol } from '@/services/management/idols';
import { postImage } from '@/services/media';
import { FormatEsalisday } from '@/utils/datetime';
import { getUrlImage } from '@/utils/media';
import { formItemRule } from '@/utils/ruleForm';
import {
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, Modal, UploadFile, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { typeSelect } from '.';

interface CreateUpdateFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curItem?: API.IdolItem;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setCurIdol: React.Dispatch<React.SetStateAction<API.IdolItem>>;
}

const CreateUpdateForm: FC<CreateUpdateFormProps> = ({
  showModal,
  setShowModal,
  curItem,
  setReload,
  setCurIdol,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<FormData | undefined>();
  const [bannerFile, setBannerFile] = useState<FormData | undefined>();
  const [listSolo, setListSolo] = useState<API.IdolItem[]>();
  const [curAvatarFile, setCurAvatarFile] = useState<UploadFile<any>[]>([]);
  const [curBannerFile, setCurBannerFile] = useState<UploadFile<any>[]>([]);
  const [typeIdol, setTypeIdol] = useState<number | undefined>();

  const [membersSelected, setMemberSelected] = useState<number[]>(
    curItem?.members?.map((e) => e?.id || 0) || [],
  );

  const handleCloseModal = () => {
    setShowModal(false);
    setCurIdol({});
    setCurAvatarFile([]);
    setCurBannerFile([]);
    setTypeIdol(undefined);
    setReload((pre) => !pre);
    setLoading(false);
    form?.resetFields();
  };
  const handleAvatarChange = async (file: File | undefined) => {
    const formDataAvatar = new FormData();
    if (file) {
      formDataAvatar.append('file', file);
      setAvatarFile(formDataAvatar);
    } else {
      setAvatarFile(undefined);
    }
  };

  const handleBannerChange = async (file: File | undefined) => {
    const formDataBanner = new FormData();
    if (file) {
      formDataBanner.append('file', file);
      setBannerFile(formDataBanner);
    } else {
      setBannerFile(undefined);
    }
  };

  const handleSave = async (formItem: API.IdolItem) => {
    setLoading(true);
    let nameAvatar;
    let nameBanner;
    if (avatarFile) {
      nameAvatar = await postImage(avatarFile);
    }
    if (bannerFile) {
      nameBanner = await postImage(bannerFile);
    }

    const payload: API.PayloadIdol = {
      idolTypeId: typeIdol || curItem?.idolTypeId,
      avatarFileName: nameAvatar || curItem?.avatarFileName,
      bannerFileName: nameBanner || curItem?.bannerFileName,
      idolName: formItem.idolName,
      anniversaryDay: FormatEsalisday(formItem.anniversaryDay ?? ''),
      memberIds: typeIdol === IDOL_TYPE.GROUP_TYPE ? membersSelected : [],
    };

    if (!curItem?.id) {
      postIdol(payload)
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
      putIdol({
        ...payload,
        id: curItem.id,
      })
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
    const res = await getIdols({ idolType: IDOL_TYPE.SOLO_TYPE, PageNumber: null, PageSize: null });
    if (res) {
      setListSolo(res.data);
    }
  };

  useEffect(() => {
    form.setFieldValue('idolTypeId', curItem?.idolTypeId);
    form.setFieldValue('idolName', curItem?.idolName);
    form.setFieldValue('anniversaryDay', curItem?.anniversaryDay);
    form.setFieldValue(
      'memberIds',
      curItem?.members?.map((item) => ({ label: item.idolName, value: item.id })),
    );
    form.setFieldValue('avatarFileName', curItem?.avatarFileName);
    form.setFieldValue('bannerFileName', curItem?.bannerFileName);

    handleGetListSolo();

    if (curItem?.id)
      setCurAvatarFile([
        {
          uid: '-1',
          name: curItem?.avatarFileName || '',
          status: 'done',
          url: getUrlImage(curItem?.avatarFileName ?? ''),
        },
      ]);
    if (curItem?.id && curItem?.bannerFileName)
      setCurBannerFile([
        {
          uid: '-1',
          name: curItem?.bannerFileName || '',
          status: 'done',
          url: getUrlImage(curItem?.bannerFileName ?? ''),
        },
      ]);
    if (curItem) {
      setTypeIdol(curItem.idolTypeId);
    }
  }, [curItem]);

  return (
    <Modal
      title={
        !curItem?.id
          ? `${intl.formatMessage({
              id: 'pages.idols.form.titleAdd',
              defaultMessage: 'Add Idol',
            })}`
          : `${intl.formatMessage({
              id: 'pages.idols.form.titleEdit',
              defaultMessage: 'Edit Idol',
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
      confirmLoading={loading}
      onOk={() => form.submit()}
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
        <ProFormSelect
          allowClear
          label={`${intl.formatMessage({
            id: 'pages.idols.form.type',
            defaultMessage: 'Type',
          })}`}
          name={'idolTypeId'}
          placeholder={`${intl.formatMessage({
            id: 'pages.button.placeholderType',
            defaultMessage: 'Select Type',
          })}`}
          options={typeSelect}
          onChange={(e: number) => setTypeIdol(e)}
          rules={[formItemRule.required()]}
          mode="single"
        />
        <ProFormUploadButton
          label={`${intl.formatMessage({
            id: 'pages.idols.form.avatar',
            defaultMessage: 'Avatar',
          })}`}
          title={`${intl.formatMessage({
            id: 'pages.button.titleUpload',
            defaultMessage: 'Upload',
          })}`}
          name={'avatarFileName'}
          max={1}
          fieldProps={{ onRemove: () => setCurAvatarFile([]) }}
          fileList={curAvatarFile}
          onChange={(e) => {
            if (e.fileList.length > 0) {
              handleAvatarChange(e.fileList[0].originFileObj);
              setCurAvatarFile(e.fileList);
            }
          }}
          rules={[formItemRule.required()]}
        />
        <ProFormUploadButton
          label={`${intl.formatMessage({
            id: 'pages.idols.form.banner',
            defaultMessage: 'Banner',
          })}`}
          title={`${intl.formatMessage({
            id: 'pages.button.titleUpload',
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
        <ProFormText
          label={`${intl.formatMessage({
            id: 'pages.idols.form.idolName',
            defaultMessage: 'Idol Name',
          })}`}
          placeholder={''}
          name={'idolName'}
          rules={[formItemRule.required()]}
        />
        <ProFormDatePicker
          name={'anniversaryDay'}
          placeholder={`${intl.formatMessage({
            id: 'pages.idols.form.placeholderBirth',
            defaultMessage: 'Select Date',
          })}`}
          label={`${intl.formatMessage({
            id: 'pages.idols.form.birthday',
            defaultMessage: 'Birthday/Estalisday',
          })}`}
          rules={[formItemRule.required()]}
        />
        {typeIdol === IDOL_TYPE.GROUP_TYPE && (
          <ProFormSelect
            label="Members"
            name={'memberIds'}
            placeholder={'Select member'}
            options={listSolo?.map((item) => ({ label: item.idolName, value: item.id }))}
            mode="multiple"
            onChange={(e: number[]) => setMemberSelected(e)}
          />
        )}
      </Form>
    </Modal>
  );
};

export default CreateUpdateForm;
