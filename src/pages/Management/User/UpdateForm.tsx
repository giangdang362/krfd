import { IDOL_TYPE } from '@/constants/idolType';
import { getIdols } from '@/services/management/idols';
import { putUser } from '@/services/management/user';
import { formItemRule } from '@/utils/ruleForm';
import { ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, Input, Modal, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface UpdateFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curItem?: API.User;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export type SelectStatus = {
  label: string;
  value: boolean;
};
export const typeStatus: SelectStatus[] = [
  { label: 'Actived', value: true },
  { label: 'Not Activated', value: false },
];

const UpdateForm: FC<UpdateFormProps> = ({ showModal, curItem, setShowModal, setReload }) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [listSolo, setListSolo] = useState<API.IdolItem[]>();
  const [idolFollowsSelected, setIdolFollowsSelected] = useState<number[]>(
    curItem?.idolFollows?.map((e) => e?.id || 0) || [],
  );

  const [status, setStatus] = useState<boolean>();

  const [form] = Form.useForm();
  const handleCloseModal = () => {
    setShowModal(false);
    setReload((pre) => !pre);
    setLoading(false);
    form?.resetFields();
  };

  const handleSave = async (formItem: API.User) => {
    const payload: API.UserPayload = {
      isActive: status || formItem.isActive,
      idolIds: idolFollowsSelected,
    };

    await putUser(curItem?.id ?? -1, payload)
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
  };

  const handleGetListSolo = async () => {
    const res = await getIdols({ idolType: IDOL_TYPE.SOLO_TYPE, PageNumber: null, PageSize: null });
    if (res) {
      setListSolo(res.data);
    }
  };

  useEffect(() => {
    form.setFieldValue('userName', curItem?.userName);
    form.setFieldValue('lastLoginDate', curItem?.lastLoginDate);
    form.setFieldValue('honeyPoint', curItem?.honeyPoint);
    form.setFieldValue(
      'idolFollows',
      curItem?.idolFollows?.map((item) => ({ label: item.idolName, value: item.id })),
    );
    form.setFieldValue('isActive', curItem?.isActive);
    form.setFieldValue('userEmail', curItem?.userEmail);
    form.setFieldValue('password', curItem?.password);
    handleGetListSolo();
  }, [curItem]);

  return (
    <Modal
      title={`${intl.formatMessage({
        id: 'pages.user.form.title',
        defaultMessage: 'Edit Users',
      })}`}
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
        style={{ padding: '12px 0px' }}
      >
        <ProFormText
          label={`${intl.formatMessage({
            id: 'pages.user.form.userName',
            defaultMessage: 'User Name',
          })}`}
          placeholder=""
          name="userName"
          disabled
        />
        <div style={{ display: 'flex', gap: '15px' }}>
          <ProFormDatePicker
            label={`${intl.formatMessage({
              id: 'pages.user.form.startDate',
              defaultMessage: 'Start Date',
            })}`}
            name="lastLoginDate"
            disabled
          />
          <ProFormDatePicker
            label={`${intl.formatMessage({
              id: 'pages.user.form.lastDate',
              defaultMessage: 'Last Login Date',
            })}`}
            name="lastLoginDate"
            disabled
          />
        </div>
        <ProFormText
          label={`${intl.formatMessage({
            id: 'pages.user.form.email',
            defaultMessage: 'Email',
          })}`}
          placeholder=""
          name="userEmail"
          disabled
        />
        {/* <ProFormText.Password
          label={`${intl.formatMessage({
            id: 'pages.user.form.password',
            defaultMessage: 'Password',
          })}`}
          placeholder=""
          name="password"
        /> */}
        <ProFormSelect
          label={`${intl.formatMessage({
            id: 'pages.user.form.idolFollow',
            defaultMessage: 'Idol Follow',
          })}`}
          name={'idolFollows'}
          placeholder={`${intl.formatMessage({
            id: 'pages.idols.form.placeholderType',
            defaultMessage: 'Select Type',
          })}`}
          options={listSolo?.map((item) => ({ label: item.idolName, value: item.id }))}
          onChange={(e: number[]) => setIdolFollowsSelected(e)}
          mode="multiple"
          showSearch
          rules={[
            {
              validator: () => {
                if (idolFollowsSelected.length > 3) {
                  return Promise.reject(
                    `${intl.formatMessage({
                      id: 'pages.user.form.maximum',
                      defaultMessage: 'This field has a maximum of 3 items',
                    })}`,
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        />
        <div style={{ display: 'flex', gap: '15px' }}>
          <Form.Item
            label={`${intl.formatMessage({
              id: 'pages.user.form.point',
              defaultMessage: 'Point',
            })}`}
            name="honeyPoint"
            style={{
              maxWidth: '158px',
            }}
          >
            <Input
              suffix={`${intl.formatMessage({
                id: 'pages.user.form.point',
                defaultMessage: 'Point',
              })}`}
              disabled
              style={{ height: '34px' }}
            />
          </Form.Item>
          <ProFormSelect
            label={`${intl.formatMessage({
              id: 'pages.user.form.status',
              defaultMessage: 'Status',
            })}`}
            style={{
              minWidth: '124px',
            }}
            placeholder=""
            name="isActive"
            options={typeStatus}
            onChange={(e: boolean) => setStatus(e)}
            allowClear={false}
            rules={[formItemRule.required()]}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
