import { useIntl } from '@umijs/max';
import { Card, Col, DatePicker, Row, Typography } from 'antd';
import { DatePickerProps } from 'antd/lib';
import dayjs from 'dayjs';
import { useState } from 'react';
import DonutChart from './component/DonutChart';
import PointContent from './component/PointChart';
import TotalVisitChart from './component/TotalVisitChart';
import styles from './style.less';

const { Title } = Typography;

const Dasboard = () => {
  const intl = useIntl();

  const currentMonth = new Date().toUTCString();
  const [month, setMonth] = useState<string>(currentMonth);

  const onChange: DatePickerProps['onChange'] = (_, dateString) => {
    setMonth(dateString);
  };

  return (
    <>
      <Title level={3}>
        {intl.formatMessage({
          id: 'menu.dashboard',
          defaultMessage: 'Dashboard',
        })}
      </Title>
      <Row gutter={{ xs: 8, sm: 16, md: 20, lg: 24 }}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card
            title={
              <Typography.Text className={styles.card_title}>
                {intl.formatMessage({
                  id: 'pages.dashboard.vote',
                  defaultMessage: 'Vote',
                })}
              </Typography.Text>
            }
            headStyle={{ borderBottom: '0' }}
            bordered={false}
            style={{ height: '282px' }}
          >
            <DonutChart />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card
            title={
              <Typography.Text className={styles.card_title}>
                {intl.formatMessage({
                  id: 'pages.dashboard.points',
                  defaultMessage: 'Points',
                })}
              </Typography.Text>
            }
            headStyle={{ borderBottom: '0' }}
            bordered={false}
            style={{ height: '282px' }}
          >
            <PointContent />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }} gutter={{ xs: 8, sm: 16, md: 20, lg: 24 }}>
        <Col xs={24} sm={24} md={12} lg={24}>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography.Text className={styles.card_title}>
                  {intl.formatMessage({
                    id: 'pages.dashboard.totalVisits',
                    defaultMessage: 'Total visits',
                  })}
                </Typography.Text>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  <div className={styles.slide_total_visit}></div>
                  <div className={styles.title_total_visit}>
                    {intl.formatMessage({
                      id: 'pages.dashboard.month',
                      defaultMessage: 'Month',
                    })}
                  </div>
                  <DatePicker
                    onChange={onChange}
                    picker="month"
                    format={'MMMM YYYY'}
                    defaultValue={dayjs(currentMonth)}
                  />
                </div>
              </div>
            }
            bordered={false}
            style={{ height: '412px', borderRadius: '20px' }}
            headStyle={{ borderBottom: '0' }}
          >
            <TotalVisitChart month={month} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dasboard;
