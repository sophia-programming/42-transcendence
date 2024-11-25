"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  Button,
  Spinner,
  Container,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { resetPassword } from "@/actions/user";
import Link from "next/link";

const schema = z
  .object({
    password: z.string().min(8, { message: "8文字以上入力する必要があります" }),
    confirmPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof schema>;

interface ResetPasswordProps {
  uid: string;
  token: string;
}

const ResetPassword = ({ uid, token }: ResetPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isReset, setIsReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);

    try {
      const res = await resetPassword({
        uid,
        token,
        newPassword: data.password,
        reNewPassword: data.confirmPassword,
      });

      if (!res.success) {
        setToastMessage("パスワードリセットに失敗しました");
        setShowToast(true);
        return;
      }

      setIsReset(true);
    } catch {
      setToastMessage("パスワードリセットに失敗しました");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <div className="w-50">
        {isReset ? (
          <div className="text-center">
            <h2 className="fw-bold mb-4">パスワードリセット完了</h2>
            <p>パスワードが正常にリセットされました。</p>
            <Link
              href="/login"
              className="btn btn-primary w-100 text-white text-decoration-none"
            >
              ログイン
            </Link>
          </div>
        ) : (
          <>
            <h2 className="fw-bold text-center mb-4">パスワードリセット</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>新しいパスワード</Form.Label>
                <Form.Control
                  type="password"
                  {...register("password")}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>パスワード確認</Form.Label>
                <Form.Control
                  type="password"
                  {...register("confirmPassword")}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
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
                パスワードをリセット
              </Button>
            </Form>
          </>
        )}
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg="danger"
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">エラー</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ResetPassword;
