import { FC } from 'react';
import CancelBtn from './CancelBtn';
import SubmitBtn from './SubmitBtn';

interface ButtonFormProps {
  onCancel?: () => void;
  onSubmit?: () => void;
}

const ButtonForm: FC<ButtonFormProps> = ({ onCancel, onSubmit }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
      }}
    >
      <CancelBtn onClick={onCancel} />
      <SubmitBtn onSubmit={onSubmit} />
    </div>
  );
};

export default ButtonForm;
