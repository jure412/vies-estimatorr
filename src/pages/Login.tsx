import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from 'components/Box';
import { Flex } from 'components/Flex';
import { Heading } from 'components/Heading';
import { Form, Data } from 'components/Form';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import { Link } from 'components/Link';
import { Error } from 'components/Error';
import { Loader } from 'components/Loader';
import { useAuth } from '../AuthProvider';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const [error, setError] = useState<Maybe<string>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleSubmit({ data }: { data: Data }) {
    const email = data.email as string;
    const password = data.password as string;

    setIsLoading(true);
    setError(undefined);

    login(email, password, true)
      .then(() => history.push('/'))
      .catch(error => {
        const responseError = error.json?.error_description;
        const message = responseError || 'There was a problem logging in';
        setError(message);
        setIsLoading(false);
      });
  }

  return (
    <Flex
      as={'main'}
      background={'primary'}
      align={'center'}
      justify={'center'}
      minHeight="100vh"
    >
      {error && <Error>{error}</Error>}
      <Heading size="xlarge" color="textOnPrimary">
        Welcome back
      </Heading>
      <Form action="/" onSubmit={handleSubmit} hasEnterSubmit>
        <Flex
          padding={['large']}
          background={'background'}
          spacing={['small']}
          rounded={true}
          maxWidth={380}
        >
          <Input type="email" name="email" placeholder="Your Email" required />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Button type="submit">{isLoading ? <Loader /> : <>Sign in</>}</Button>
        </Flex>
      </Form>
      <Box as="p" weight="medium" color="textOnPrimary">
        Need an account? <Link to="/signup">Sign up</Link>
      </Box>
    </Flex>
  );
};
