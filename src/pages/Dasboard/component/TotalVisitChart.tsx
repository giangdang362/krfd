import { getChartTotalVisit } from '@/services/dashboard';
import { FormatNumber } from '@/utils/common';
import { Area } from '@ant-design/plots';
import { useIntl } from '@umijs/max';
import { FC, useEffect, useState } from 'react';

interface TotalVisitChartProps {
  month: string;
}
const TotalVisitChart: FC<TotalVisitChartProps> = ({ month }) => {
  const intl = useIntl();
  const [dataChartTotalVisit, setDataChartTotalVisit] = useState<API.VisitItem[]>([]);

  const hanldeGetResChartTotalVisit = async () => {
    const res = await getChartTotalVisit({ queryDate: month });
    if (res) {
      setDataChartTotalVisit(res);
    }
  };

  useEffect(() => {
    if (month) {
      hanldeGetResChartTotalVisit();
    }
  }, [month]);

  return (
    <div>
      <Area
        data={dataChartTotalVisit.length ? dataChartTotalVisit : []}
        xField="label"
        yField="value"
        xAxis={{
          range: [0, 1],
          label: {
            formatter: (value: string) => {
              return value.split(',')[0];
            },
          },
        }}
        yAxis={{
          range: [0, 1],
          label: {
            formatter: (value: string | number) => {
              return `${value}`;
            },
          },
        }}
        style={{
          height: 300,
        }}
        areaStyle={{
          fill: 'l(360) 0:#FFFFFF 1:#F95BE9',
        }}
        line={{
          color: '#ef488e',
        }}
        color="#ef488e"
        interactions={[]}
        tooltip={{
          showMarkers: true,
          customContent: (title, items) => {
            return (
              <div style={{ padding: '8px 0', minWidth: '100px' }}>
                <div style={{ fontSize: '13px', lineHeight: '20px' }}>{title}</div>
                {items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: '18px',
                      lineHeight: '26px',
                      fontWeight: 600,
                      color: '#C8467C',
                    }}
                  >
                    {FormatNumber(item.value)}
                  </div>
                ))}
                <div style={{ marginTop: '4px' }}>
                  {intl.formatMessage({
                    id: 'pages.dashboard.users',
                    defaultMessage: 'Users',
                  })}
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default TotalVisitChart;
