import { getChartVote } from '@/services/dashboard';
import { Pie, measureTextWidth } from '@ant-design/plots';
import { useIntl } from '@umijs/max';
import { memo, useEffect, useState } from 'react';
import styles from '../style.less';

const color = ['#EF488E', '#e9e3fa'];

const DonutChart = memo(() => {
  const intl = useIntl();
  const [dataChart, setDataChart] = useState<API.ResChartVote>();
  function renderStatistic(containerWidth: number, text: string, style: any) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
    const R = containerWidth / 2;

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`;
  }
  const data = [
    {
      type: `${intl.formatMessage({
        id: 'pages.dashboard.topicVotes',
        defaultMessage: 'Topic Votes',
      })}`,
      value: dataChart?.topicVotes,
    },
    {
      type: `${intl.formatMessage({
        id: 'pages.dashboard.fundingVotes',
        defaultMessage: 'Funding Votes',
      })}`,
      value: dataChart?.fundingVotes,
    },
  ];
  const config = {
    appendPadding: 0,
    data,
    angleField: 'value',
    colorField: 'type',
    color,
    width: 200,
    height: 200,
    innerRadius: 0.7,
    statistic: {
      title: {
        offsetY: 30,
        style: {
          fontSize: '16px',
        },
        customHtml: (container: any, view: any, datum: any) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum
            ? datum.type
            : `${intl.formatMessage({
                id: 'pages.dashboard.post',
                defaultMessage: 'Posts',
              })}`;
          return renderStatistic(d, text, {
            fontSize: '20px',
          });
        },
      },
      content: {
        offsetY: -30,
        style: {
          fontSize: '30px',
        },
      },
    },
    label: {
      content: '',
    },
    legend: {
      offsetX: -120,
      offsetY: -30,
    },
    interactions: [{ type: 'tooltip', enable: false }],
    renderer: 'svg' as 'svg',
  };

  const handleGetChartVote = async () => {
    const res = await getChartVote();
    if (res) {
      setDataChart(res);
    }
  };

  useEffect(() => {
    handleGetChartVote();
  }, []);

  useEffect(() => {
    //Disable icon when clicked
    const topicVoteRadio = document.getElementById('-legend-item-Topic Votes-radio');
    if (topicVoteRadio) {
      topicVoteRadio.style.display = 'none';
    }
    const fundingVoteRadio = document.getElementById('-legend-item-Funding Votes-radio');
    if (fundingVoteRadio) {
      fundingVoteRadio.style.display = 'none';
    }

    //Add element text for Topic Votes
    const topicVoteIcon = document.getElementById('-legend-item-Topic Votes-marker');
    if (topicVoteIcon) {
      topicVoteIcon.addEventListener('click', (event) => {
        event.preventDefault();
      });
    }
    const topicVoteText = document.getElementById('-legend-item-Topic Votes-name');
    if (topicVoteText) {
      topicVoteText.addEventListener('click', (event) => {
        event.preventDefault();
      });
      const newTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      newTextElement.setAttribute('x', '17');
      newTextElement.setAttribute('y', '30');
      newTextElement.setAttribute('font-size', '12');
      newTextElement.setAttribute('fill', '#595959');
      newTextElement.textContent = `${dataChart?.topicVotes} ${intl.formatMessage({
        id: 'pages.dashboard.post',
        defaultMessage: 'Posts',
      })}`;
      newTextElement.setAttribute('font-weight', 'bold');
      if (topicVoteText.parentNode)
        topicVoteText.parentNode.insertBefore(newTextElement, topicVoteText.nextSibling);
    }

    //Add element text for Funding Votes
    const fundingVoteIcon = document.getElementById('-legend-item-Funding Votes-marker');
    if (fundingVoteIcon) {
      fundingVoteIcon.addEventListener('click', (event) => {
        event.preventDefault();
      });
      fundingVoteIcon.setAttribute('transform', 'translate(0, 30)');
    }
    const fundingVoteText = document.getElementById('-legend-item-Funding Votes-name');
    if (fundingVoteText) {
      fundingVoteText.addEventListener('click', (event) => {
        event.preventDefault();
      });
      fundingVoteText.setAttribute('transform', 'translate(0, 30)');
      const newTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      newTextElement.setAttribute('x', '17');
      newTextElement.setAttribute('y', '59');
      newTextElement.setAttribute('font-size', '12');
      newTextElement.setAttribute('fill', '#595959');
      newTextElement.textContent = `${dataChart?.fundingVotes} ${intl.formatMessage({
        id: 'pages.dashboard.post',
        defaultMessage: 'Posts',
      })}`;
      newTextElement.setAttribute('font-weight', 'bold');
      if (fundingVoteText.parentNode)
        fundingVoteText.parentNode.insertBefore(newTextElement, fundingVoteText.nextSibling);
    }
  });

  return (
    <div className={styles.pie_container}>
      <Pie {...config} />
    </div>
  );
});

export default DonutChart;
