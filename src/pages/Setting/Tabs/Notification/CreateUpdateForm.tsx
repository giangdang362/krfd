import { createNotification, updateNotification } from '@/services/setting/notification';
import { formItemRule } from '@/utils/ruleForm';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, Modal, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface CreateUpdateFormProps {
  showModal: boolean;
  setShowModal: (e: boolean) => void;
  curItem?: API.NotificationItem;
  setCurrentItem: (e?: API.NotificationItem) => void;
  showDrawer?: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValue: API.NotificationItem = {
  title: '',
  description: '',
};

const CreateUpdateForm: FC<CreateUpdateFormProps> = ({
  showModal,
  curItem,
  setShowModal,
  setCurrentItem,
  showDrawer,
  setReload,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<API.NotificationItem>();
  const handleCloseModal = () => {
    setShowModal(false);
    if (!showDrawer) {
      setCurrentItem();
    }
    setLoading(false);
    form?.resetFields();
    setReload((pre) => !pre);
  };

  const handleSubmit = (formItem: API.NotificationItem) => {
    setLoading(true);
    if (curItem?.id) {
      updateNotification(formItem, curItem?.id)
        .then(async () => {
          message.success(
            `${intl.formatMessage({
              id: 'pages.updateSuccess',
              defaultMessage: 'Update successfully!',
            })}`,
          );
          handleCloseModal();
          setCurrentItem({
            ...curItem,
            title: formItem.title,
            description: formItem.description,
            updatedDate: new Date().toString(),
          });
        })
        .catch(() => {
          message.error(
            `${intl.formatMessage({
              id: 'pages.wrong',
              defaultMessage: 'Something went wrong!',
            })}`,
          );
        });
    } else {
      createNotification(formItem as API.NotificationReq)
        .then(() => {
          message.success(
            `${intl.formatMessage({
              id: 'pages.createSuccess',
              defaultMessage: 'Create successfully!',
            })}`,
          );
          handleCloseModal();
        })
        .catch(() => {
          message.error(
            `${intl.formatMessage({
              id: 'pages.wrong',
              defaultMessage: 'Something went wrong!',
            })}`,
          );
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    form.setFieldValue('title', curItem?.title);
    form.setFieldValue('description', curItem?.description);
  }, [curItem]);

  return (
    <Modal
      title={
        !curItem
          ? `${intl.formatMessage({
              id: 'pages.settings.notification.form.titleAdd',
              defaultMessage: 'Create Notification',
            })}`
          : `${intl.formatMessage({
              id: 'pages.settings.notification.form.titleEdit',
              defaultMessage: 'Edit Notification',
            })}`
      }
      open={showModal}
      onCancel={handleCloseModal}
      confirmLoading={loading}
      onOk={() => {
        form.submit();
      }}
      okText={`${intl.formatMessage({
        id: 'pages.button.save',
        defaultMessage: 'Save',
      })}`}
      cancelText={`${intl.formatMessage({
        id: 'pages.button.cancel',
        defaultMessage: 'Cancel',
      })}`}
    >
      <Form
        form={form}
        layout="vertical"
        name="roleForm"
        onFinish={handleSubmit}
        initialValues={curItem || defaultValue}
        style={{
          padding: '12px 0px',
        }}
      >
        <ProFormText
          label={`${intl.formatMessage({
            id: 'pages.settings.notification.form.title',
            defaultMessage: 'Title',
          })}`}
          name={'title'}
          placeholder={''}
          rules={[formItemRule.required()]}
        />
        <ProFormTextArea
          label={`${intl.formatMessage({
            id: 'pages.settings.notification.form.description',
            defaultMessage: 'Description',
          })}`}
          name="description"
          rules={[formItemRule.required()]}
        />
      </Form>
    </Modal>
  );
};
export default CreateUpdateForm;
