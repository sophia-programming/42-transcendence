"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Spinner, Container } from "react-bootstrap";
import { signIn } from "next-auth/react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません" }),
  password: z.string().min(8, { message: "8文字以上入力する必要があります" }),
});

type InputType = z.infer<typeof schema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then((result) => {
        if (result?.error) {
          //   toast.error("ログインに失敗しました");
        } else {
          window.location.href = "/";
        }
      })
      .catch(() => {
        // toast.error("ログインに失敗しました");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container className="d-flex justify-content-center">
      <div className="w-50">
        <h2 className="fw-bold text-center mb-4">ログイン</h2>

        <Form onSubmit={handleSubmit(onSubmit)} className="mb-3">
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>メールアドレス</Form.Label>
            <Form.Control
              type="email"
              placeholder="xxxx@gmail.com"
              {...register("email")}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>パスワード</Form.Label>
            <Form.Control
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading && (
              <Spinner animation="border" size="sm" className="me-2" />
            )}
            ログイン
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Link
            href="/reset-password"
            className="text-decoration-none text-primary"
          >
            パスワードを忘れた方はこちら
          </Link>
        </div>

        <div className="text-center mt-2">
          <Link href="/signup" className="text-decoration-none text-primary">
            アカウントを作成する
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;
