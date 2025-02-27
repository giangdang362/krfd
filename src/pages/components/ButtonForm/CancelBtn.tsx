import { Button } from 'antd';
import { FC } from 'react';

interface CancelBtnProps {
  onClick?: () => void;
}

const CancelBtn: FC<CancelBtnProps> = ({ onClick }) => {
  return <Button onClick={onClick}>Cancel</Button>;
};

export default CancelBtn;
