'use client';

import { registerUser } from '@/actions/register';
import { Form, Input, Button } from '@heroui/react';
import { useState } from 'react';

interface IProps {
  onClose: () => void;
}

function RegistrationForm({ onClose }: IProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerUser(formData);

    if ('error' in result) {
      setError(result.error);
      return;
    }
    onClose();
  };

  return (
    <Form className="w-full max-w-xs" onSubmit={handleSubmit}>
      <Input
        isRequired
        autoComplete="email"
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        validate={(value) => {
          if (!value) return 'Где почта, долбоёб?';
          if (!validateEmail(value)) return 'Неверный email';
          return null;
        }}
      />

      <Input
        isRequired
        name="password"
        placeholder="Enter your password"
        labelPlacement="outside"
        type="password"
        autoComplete="new-password"
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        validate={(value) => {
          if (!value) return 'Enter your password?';
          return null;
        }}
      />

      <Input
        isRequired
        name="confirmPassword"
        placeholder="Confirm your password"
        labelPlacement="outside"
        type="password"
        autoComplete="new-password"
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        validate={(value) => {
          if (!value) return 'Enter your password?';
          return null;
        }}
      />

      {error && <p className="text-danger text-sm w-full">{error}</p>}

      <div className="flex w-full gap-4 items-center pt-8 justify-end">
        <Button variant="light" onPress={onClose}>
          Отмена
        </Button>
        <Button type="submit" color="primary">
          Регистрация
        </Button>
      </div>
    </Form>
  );
}

export default RegistrationForm;
