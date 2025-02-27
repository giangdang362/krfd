import { Button } from 'antd';
import { FC } from 'react';

interface SubmitBtnProps {
  onSubmit?: () => void;
}

const SubmitBtn: FC<SubmitBtnProps> = ({ onSubmit }) => {
  return (
    <Button type="primary" onClick={onSubmit}>
      Submit
    </Button>
  );
};

export default SubmitBtn;
