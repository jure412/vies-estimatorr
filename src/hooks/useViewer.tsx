import { useAuth } from 'AuthProvider';

type Contact = {
  name?: string;
  email?: string;
  phone?: string;
};

type Viewer = {
  email: string;
  company: {
    name: string;
    address?: string;
    city?: string;
    vat?: string;
  };
  contact?: Contact;
  financeContact?: Contact;
};

export const useViewer = (): Viewer => {
  const { user } = useAuth();

  if (!user) {
    throw new Error('Missing logged in user.');
  }

  return {
    email: user.email,
    ...(user.user_metadata || {}),
  };
};
