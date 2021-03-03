import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Box } from 'components/Box';
import { Flex } from 'components/Flex';
import { Heading } from 'components/Heading';
import { Form, Data } from 'components/Form';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import { Link } from 'components/Link';
import { Label } from 'components/Label';
import { Error } from 'components/Error';
import { Loader } from 'components/Loader';
import { useAuth } from '../AuthProvider';

export const Registration: React.FC = () => {
  const { login, signup } = useAuth();
  const history = useHistory();
  const [error, setError] = useState<Maybe<string>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleSubmit({ data }: { data: Data }) {
    const email = data.email as string;
    const password = data.password as string;

    setIsLoading(true);
    setError(undefined);

    signup(email, password, data)
      .then(() => login(email, password, true))
      .then(() => history.push('/'))
      .catch((error: { json?: { msg: string } }) => {
        console.log(error)
        const message = error.json?.msg || 'There was a problem signing up';
        setError(message);
        setIsLoading(false);
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
        Create an account
      </Heading>
      <Form onSubmit={handleSubmit}>
        <Flex
          padding={['large']}
          background={'background'}
          spacing={['medium']}
          rounded={true}
          maxWidth={380}
        >
          <Label text="Full name">
            <Input
              name="full_name"
              type="text"
              placeholder="John Smith"
              required
            />
          </Label>
          <Label text="Email address">
            <Input
              name="email"
              type="text"
              placeholder="john@here.com"
              required
            />
          </Label>
          <Label text="Create password">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
          </Label>

          <Label text="Company legal name">
            <Input
              name="company[name]"
              type="text"
              placeholder="Company name"
              required
            />
          </Label>
          <Label text="Address">
            <Input
              name="company[address]"
              type="text"
              placeholder="Company address"
              required
            />
          </Label>
          <Label text="City">
            <Input
              name="company[city]"
              type="text"
              placeholder="Company city location"
              required
            />
          </Label>
          <Label text="VAT number">
            <Input
              name="company[vat]"
              type="text"
              placeholder="VAT number"
              required
            />
          </Label>
          <fieldset>
            <legend>
              <Label text="Contact person" htmlFor="contact-name" />
            </legend>

            <StyledInput
              name="contact[name]"
              type="text"
              id="contact-name"
              placeholder="Full name"
              required
            />
            <StyledInput
              name="contact[email]"
              type="email"
              placeholder="Email address"
              required
            />
            <StyledInput
              name="contact[phone]"
              type="tel"
              placeholder="Phone number"
              pattern="[0-9]+"
              required
            />
          </fieldset>
          <fieldset>
            <legend>
              <Label
                text="Finance contact person"
                htmlFor="finance-contact-name"
              />
            </legend>

            <StyledInput
              name="financeContact[name]"
              type="text"
              id="finance-contact-name"
              placeholder="Full name"
              required
            />
            <StyledInput
              name="financeContact[email]"
              type="email"
              placeholder="Email address"
              required
            />
            <StyledInput
              name="financeContact[phone]"
              type="tel"
              placeholder="Phone number"
              pattern="[0-9]+"
              required
            />
          </fieldset>

          <Button type="submit">
            {isLoading ? <Loader /> : <>Create account</>}
          </Button>
        </Flex>
      </Form>
      <Box as="p" weight="medium" color="textOnPrimary">
        Already have an account? <Link to="/login">Login</Link>
      </Box>
    </Flex>
  );
};

const StyledInput = styled(Input).attrs(() => ({
  width: '100%',
}))`
  & + & {
    margin-top: ${props => props.theme.spacing.small};
  }
`;
