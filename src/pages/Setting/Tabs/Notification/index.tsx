import { FC, useState } from 'react';
import CreateUpdateForm from './CreateUpdateForm';
import DataNotificationTable from './DataTable';

interface NotificationProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  currentNotification?: API.NotificationItem;
  setCurrentNotification: React.Dispatch<React.SetStateAction<API.NotificationItem | undefined>>;
}

const Notification: FC<NotificationProps> = ({
  showModal,
  setShowModal,
  setCurrentNotification,
  currentNotification,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  return (
    <div>
      <DataNotificationTable
        setShowModal={setShowModal}
        currentNotification={currentNotification}
        setCurrentNotification={setCurrentNotification}
        reload={reload}
        setReload={setReload}
        loading={loading}
        setLoading={setLoading}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
      />
      <CreateUpdateForm
        setCurrentItem={setCurrentNotification}
        showModal={showModal}
        setShowModal={setShowModal}
        curItem={currentNotification}
        showDrawer={showDrawer}
        setReload={setReload}
      />
    </div>
  );
};

export default Notification;
