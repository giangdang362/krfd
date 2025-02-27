import { FormatDateTime } from '@/utils/datetime';
import { useIntl } from '@umijs/max';
import { FC } from 'react';

interface FooterTableProps {
  dateValue: string;
}
const FooterTable: FC<FooterTableProps> = ({ dateValue }) => {
  const intl = useIntl();
  return (
    <div style={{ color: '#616161' }}>
      {intl.formatMessage({
        id: 'pages.footer',
        defaultMessage: 'Update later ',
      })}
      {FormatDateTime(dateValue)}
    </div>
  );
};

export default FooterTable;
