import React from 'react';
import serialize from 'form-serialize';

export type Data = ReturnType<typeof getFormData>;

type FormEvent = {
  event: React.FormEvent<HTMLFormElement>;
  data: Data;
};

type Props = Omit<React.ComponentProps<'form'>, 'onChange' | 'onSubmit'> & {
  children: React.ReactNode;
  hasEnterSubmit?: boolean;
  onSubmit?: (event: FormEvent) => void;
  onChange?: (event: FormEvent) => void;
};

export const Form: React.FC<Props> = ({
  children,
  hasEnterSubmit = false,
  onSubmit = () => {},
  onChange = () => {},
  ...props
}) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const data = getFormData(event.currentTarget);
    onSubmit({ event, data });
    event.preventDefault();
  }

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const target = event.nativeEvent.target as HTMLFormElement;
    const data = getFormData(target.form);
    onChange({ event, data });
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLFormElement>) {
    if (
      !hasEnterSubmit &&
      event.target instanceof Element &&
      event.target.tagName !== 'TEXTAREA' &&
      event.keyCode === 13
    ) {
      event.preventDefault();
    }
  }

  return (
    <form
      {...props}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    >
      {children}
    </form>
  );
};

function getFormData(form: HTMLFormElement) {
  return serialize(form, { hash: true });
}
