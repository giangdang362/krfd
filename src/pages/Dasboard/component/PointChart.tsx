import { getChartPoint } from '@/services/dashboard';
import { formatNumberWithComma } from '@/utils/number';
import { useIntl } from '@umijs/max';
import { Col, Row, Statistic, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import styles from '../style.less';

const PointContent = () => {
  const intl = useIntl();
  const [dataPoint, setDataPoint] = useState<API.ResChartPoint>();

  const totalPoint = (dataPoint?.newUserPoint ?? 0) + (dataPoint?.oldUserPoint ?? 0);
  const point = useMemo(() => {
    return {
      old: ((dataPoint?.oldUserPoint || 0) / totalPoint) * 100,
      new: ((dataPoint?.newUserPoint || 0) / totalPoint) * 100,
    };
  }, [dataPoint]);

  const handleGetChartPoint = async () => {
    const res = await getChartPoint();
    if (res) {
      setDataPoint(res);
    }
  };

  useEffect(() => {
    handleGetChartPoint();
  }, []);

  return (
    <div className={styles.point_wrapper}>
      <div className={styles.point_number}>
        <h2>{formatNumberWithComma(totalPoint)}</h2>
        <p>
          {intl.formatMessage({
            id: 'pages.dashboard.totalPoints',
            defaultMessage: 'Total points gain',
          })}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div style={{ width: `${point.new}%` }} className={styles.range_active}></div>
        <div style={{ width: `${point.old}%` }} className={styles.range_unactive}></div>
      </div>
      <div>
        <Row
          style={{
            marginTop: '20px',
          }}
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        >
          <Col xs={24} sm={24} md={12} lg={12}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <div className={styles.btn_active}></div>
              <Statistic
                title={
                  <Typography.Text className={styles.user_active}>
                    {intl.formatMessage({
                      id: 'pages.dashboard.newUsers',
                      defaultMessage: 'New Users',
                    })}
                  </Typography.Text>
                }
                value={` ${formatNumberWithComma(
                  dataPoint?.newUserPoint ?? 0,
                )} ${intl.formatMessage({
                  id: 'pages.dashboard.pointChart',
                  defaultMessage: 'points',
                })}`}
                valueStyle={{
                  color: '#242424',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '22px',
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <div className={styles.btn_unactive}></div>
              <Statistic
                title={
                  <Typography.Text className={styles.user_active}>
                    {intl.formatMessage({
                      id: 'pages.dashboard.oldUsers',
                      defaultMessage: 'Old Users',
                    })}
                  </Typography.Text>
                }
                value={` ${formatNumberWithComma(
                  dataPoint?.oldUserPoint ?? 0,
                )} ${intl.formatMessage({
                  id: 'pages.dashboard.pointChart',
                  defaultMessage: 'points',
                })}`}
                valueStyle={{
                  color: '#242424',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '22px',
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PointContent;
