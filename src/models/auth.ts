import { useState } from 'react';

export default () => {
  const [user, setUser] = useState<API.User | undefined>();

  return { user, setUser };
};
