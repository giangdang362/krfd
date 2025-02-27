import avatarDefault from '@/../public/images/avatar-default.png';
import { getUrlImage } from '@/utils/media';
import { getIntl } from '@umijs/max';
import { Progress } from 'antd';
import { ColumnsType } from 'antd/es/table';
// import styled from 'styled-components';

export const columns = (): ColumnsType<API.ChartIdol> => {
  const intl = getIntl();
  return [
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.id',
        defaultMessage: 'ID',
      })}`,
      dataIndex: 'idolId',
      key: 'idolId',
      width: '10%',
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.soloName',
        defaultMessage: 'Solo Name',
      })}`,
      dataIndex: 'idolName',
      key: 'idolName',
      width: '50%',
      render: (_, original) => (
        <div
          style={{
            fontSize: '13px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <img
            src={
              original.avatarFileName?.length ? getUrlImage(original.avatarFileName) : avatarDefault
            }
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '9999px',
            }}
          />
          <span>{original.idolName}</span>
        </div>
      ),
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.vote',
        defaultMessage: 'Vote',
      })}`,
      dataIndex: 'voteCount',
      key: 'voteCount',
      width: '20%',
      render: (_, original) => (
        <div>
          {original.dailyVoteAmount ? (
            <span>{original.dailyVoteAmount}</span>
          ) : (
            original.monthlyVoteAmount
          )}
        </div>
      ),
    },
    {
      title: `${intl.formatMessage({
        id: 'pages.table.columns.percent',
        defaultMessage: 'Percent',
      })}`,
      dataIndex: 'percent',
      key: 'percent',
      render: (_, original) => (
        <div>
          {original.dailyPercent ? (
            <Progress percent={original.dailyPercent} />
          ) : (
            <Progress percent={original.dailyPercent} />
          )}
        </div>
      ),
      width: '20%',
    },
  ];
};

// const StyledForm = styled(Progress)`
//   .ant-progress-line {
//     margin-bottom: 0px;
//   }
// `;
