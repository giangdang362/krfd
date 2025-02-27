import { getPointSetting, putPointSetting } from '@/services/setting/notification';
import { ProFormDigit } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, message } from 'antd';
import { FormInstance } from 'antd/lib';
import { FC, useEffect, useState } from 'react';

interface PointProps {
  form: FormInstance<any>;
  reload?: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}
const Point: FC<PointProps> = ({ form, reload, setReload }) => {
  const intl = useIntl();
  const [pointData, setPointData] = useState<API.PointSetting>({});
  const handleGetPoint = async () => {
    const res = await getPointSetting();
    if (res) {
      setPointData(res);
    }
    setReload(true);
  };
  const handleSubmitPoint = async (formItem: API.PointSetting) => {
    const payload: API.PointSetting = {
      attendancePoint: formItem.attendancePoint,
      giveFriendPoint: formItem.giveFriendPoint,
      receivedEventPoint: formItem.receivedEventPoint,
      refererPoint: formItem.refererPoint,
    };
    await putPointSetting(payload).then(() =>
      message.success(
        `${intl.formatMessage({
          id: 'pages.updateSuccess',
          defaultMessage: 'Update successfully!',
        })}`,
      ),
    );
  };

  useEffect(() => {
    if (pointData) {
      form.setFieldValue('refererPoint', pointData.refererPoint);
      form.setFieldValue('receivedEventPoint', pointData.receivedEventPoint);
      form.setFieldValue('giveFriendPoint', pointData.giveFriendPoint);
      form.setFieldValue('attendancePoint', pointData.attendancePoint);
    }
    handleGetPoint();
  }, [reload]);

  return (
    <div>
      <Form form={form} layout="vertical" name="roleForm" onFinish={handleSubmitPoint}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 0',
            borderBottom: '1px dashed #e0e0e0',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {intl.formatMessage({
                id: 'pages.settings.pointSetting.referrer',
                defaultMessage: 'Referrer',
              })}
            </div>
            <div style={{ color: '#ababab' }}>
              {intl.formatMessage({
                id: 'pages.settings.pointSetting.referrerDesc',
                defaultMessage: 'Points received when entering referrer ID',
              })}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="margin-none-form-item">
              <ProFormDigit name={'refererPoint'} style={{ width: '100px' }} />
            </div>
            <div>
              {intl.formatMessage({
                id: 'pages.user.form.point',
                defaultMessage: 'Point',
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 0',
            borderBottom: '1px dashed #e0e0e0',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {intl.formatMessage({
                id: 'pages.settings.pointSetting.recevie',
                defaultMessage: 'Receive event Honey points',
              })}
            </div>
            <div style={{ color: '#ababab' }}>
              {intl.formatMessage({
                id: 'pages.settings.pointSetting.recevieDesc',
                defaultMessage: 'Points received when voting in chart',
              })}
            </div>
          </div>
          <div
            className="margin-none-form-item"
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ProFormDigit name={'receivedEventPoint'} style={{ width: '100px' }} />
            <div>
              {intl.formatMessage({
                id: 'pages.user.form.point',
                defaultMessage: 'Point',
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 0',
            borderBottom: '1px dashed #e0e0e0',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '24px',
              }}
            >
              {intl.formatMessage({
                id: 'pages.settings.pointSetting.giveFriend',
                defaultMessage: 'Give Friend points',
              })}
            </div>
            <div style={{ color: '#ababab', lineHeight: '22px' }}>
              {intl.formatMessage({
                id: 'pages.settings.pointSetting.giveFriendDesc',
                defaultMessage: 'Share points with friend each time',
              })}
            </div>
          </div>
          <div
            className="margin-none-form-item"
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ProFormDigit name={'giveFriendPoint'} style={{ width: '100px' }} />
            <div>
              {intl.formatMessage({
                id: 'pages.user.form.point',
                defaultMessage: 'Point',
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 0',
            borderBottom: '1px dashed #e0e0e0',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '24px',
              }}
            >
              {intl.formatMessage({
                id: 'pages.settings.pointSetting.attendance',
                defaultMessage: 'Attendance',
              })}
            </div>
            <div style={{ color: '#ababab' }}>
              {intl.formatMessage({
                id: 'pages.settings.pointSetting.attendanceDesc',
                defaultMessage: 'Number of points received daily attendance',
              })}
            </div>
          </div>
          <div
            className="margin-none-form-item"
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ProFormDigit name={'attendancePoint'} style={{ width: '100px' }} />
            <div>
              {intl.formatMessage({
                id: 'pages.user.form.point',
                defaultMessage: 'Point',
              })}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Point;
