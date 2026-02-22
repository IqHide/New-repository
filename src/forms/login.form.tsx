"use client";

import signInWithCredentials from "@/actions/sign-in";
import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";

interface IProps {
  onClose: () => void;
}

export default function LoginForm({ onClose }: IProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);

    await signInWithCredentials(formData.email, formData.password);

    window.location.reload();
    
    onClose();
  };

  return (
    <Form className="w-full max-w-xs" onSubmit={handleSubmit}>
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none",
        }}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        validate={(value) => {
          if (!value) return "Где почта, долбоёб?";
          return null;
        }}
      />

      <Input
        isRequired
        name="password"
        placeholder="Enter your password"
        labelPlacement="outside"
        type="password"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none",
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        validate={(value) => {
          if (!value) return "Где пароль, долбоёб?";
          return null;
        }}
      />

      <div className="flex w-[100%] gap-4 items-center pt-8 justify-end">
        <Button variant="light" onPress={onClose}>
          Отмена
        </Button>
        <Button color="primary" type="submit">
          Войти (в жопу BMW'шнику?)
        </Button>
      </div>
    </Form>
  );
}
