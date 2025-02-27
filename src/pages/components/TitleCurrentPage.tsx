import { theme } from 'antd';
import { FC } from 'react';

interface TitleCurrentPageProps {
  title?: string;
  header?: React.JSX.Element;
}

const TitleCurrentPage: FC<TitleCurrentPageProps> = ({ title, header }) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <div
      style={{
        fontSize: '20px',
        color: token.colorTextHeading,
      }}
    >
      {title}
      {header}
    </div>
  );
};

export default TitleCurrentPage;
