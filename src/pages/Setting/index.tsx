import ButtonForm from '@/pages/components/ButtonForm/ButtonForm';
import TitleCurrentPage from '@/pages/components/TitleCurrentPage';
import { useIntl } from '@umijs/max';
import { Button, Form, Tabs, Typography } from 'antd';
import { useState } from 'react';
import Notification from './Tabs/Notification';
import Point from './Tabs/Point';

const { Title } = Typography;
const Setting = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentNotification, setCurrentNotification] = useState<API.NotificationItem>();
  const [reload, setReload] = useState<boolean>(false);
  const listTabsSetting = [
    {
      id: 1,
      label: `${intl.formatMessage({
        id: 'pages.settings.point',
        defaultMessage: 'Point',
      })}`,
      children: <Point form={form} reload={reload} setReload={setReload} />,
    },
    {
      id: 2,
      label: `${intl.formatMessage({
        id: 'pages.settings.noti',
        defaultMessage: 'Notification',
      })}`,
      children: (
        <Notification
          showModal={showModal}
          setShowModal={setShowModal}
          currentNotification={currentNotification}
          setCurrentNotification={setCurrentNotification}
        />
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>
        {intl.formatMessage({
          id: 'pages.settings.title',
          defaultMessage: 'Settings',
        })}
      </Title>
      <Tabs
        tabPosition="left"
        items={listTabsSetting.map((item, index) => {
          const id = String(index + 1);
          return {
            label: item.label,
            key: id,
            children: (
              <>
                <TitleCurrentPage
                  header={
                    item.label === 'Point' ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <p style={{ color: '#C8467C', fontWeight: '600', marginBottom: '0px' }}>
                          {intl.formatMessage({
                            id: 'pages.settings.pointSetting.title',
                            defaultMessage: 'Point Setting',
                          })}
                        </p>
                        <ButtonForm
                          onCancel={() => setReload(!reload)}
                          onSubmit={() => form.submit()}
                        />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ color: '#C8467C', fontWeight: '600' }}>
                          {intl.formatMessage({
                            id: 'pages.settings.notification.title',
                            defaultMessage: 'Notification',
                          })}
                        </p>
                        <Button
                          type="primary"
                          style={{
                            display: 'flex',
                            gap: '2px',
                            alignItems: 'center',
                          }}
                          onClick={() => setShowModal(true)}
                        >
                          <span>
                            {intl.formatMessage({
                              id: 'pages.button.create',
                              defaultMessage: 'Create',
                            })}
                          </span>
                        </Button>
                      </div>
                    )
                  }
                />
                <div style={{ marginTop: '16px' }}>{item.children}</div>
              </>
            ),
          };
        })}
      />
    </div>
  );
};

export default Setting;
