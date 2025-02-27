import avatarDefault from '@/../public/images/avatar-default.png';
import { getVoteById } from '@/services/management/vote';
import { getUrlImage } from '@/utils/media';
import { useIntl } from '@umijs/max';
import { Modal } from 'antd';
import { FC, useEffect, useState } from 'react';

interface RankingResultModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curTopicVote?: API.VoteItem;
}

const RankingResultModal: FC<RankingResultModalProps> = ({
  showModal,
  setShowModal,
  curTopicVote,
}) => {
  const intl = useIntl();
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [rankingResult, setRankingResult] = useState<API.VoteItem>();

  const handleGetRankResults = async () => {
    const res = await getVoteById(curTopicVote?.voteId ?? -1);
    setRankingResult(res);
  };

  useEffect(() => {
    if (curTopicVote?.voteId) {
      handleGetRankResults();
    }
  }, [curTopicVote]);

  return (
    <Modal
      title={`${intl.formatMessage({
        id: 'pages.vote.topicVote.rankingTitle',
        defaultMessage: 'Ranking Result',
      })}`}
      open={showModal}
      onCancel={handleCloseModal}
      style={{
        width: '500px',
      }}
      footer={<></>}
    >
      <div
        style={{
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {rankingResult?.idolsToVote?.map((item, index) => (
          <>
            {index < 5 && (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    backgroundColor: `
                  ${index === 0 ? '#F7D165' : ''}
                  ${index === 1 ? '#D1D1D1' : ''}
                  ${index === 2 ? '#FFBE84' : ''}
                  `,
                    border: `2px solid
                  ${index === 0 ? '#F4BA5C' : ''}
                  ${index === 1 ? '#BEBEBE' : ''}
                  ${index === 2 ? '#C87E3F' : ''}
                `,
                    borderRadius: '9999px',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#363636',
                  }}
                >
                  {index + 1}
                </div>
                <img
                  src={
                    item.avatarFileName?.length ? getUrlImage(item.avatarFileName) : avatarDefault
                  }
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '9999px',
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#363636',
                    }}
                  >
                    {item.idolName}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#737373',
                    }}
                  >{`${item.voteNumber} ${intl.formatMessage({
                    id: 'pages.vote.topicVote.rankingVote',
                    defaultMessage: 'vote',
                  })}`}</div>
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </Modal>
  );
};

export default RankingResultModal;
