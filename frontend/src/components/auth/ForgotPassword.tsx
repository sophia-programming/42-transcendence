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
import { forgotPassword } from "@/actions/user";

const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません" }),
});

type InputType = z.infer<typeof schema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);

    try {
      const res = await forgotPassword(data);

      if (!res.success) {
        setToastMessage("パスワード再設定に失敗しました");
        setShowToast(true);
        return;
      }

      setIsForgotPassword(true);
    } catch {
      setToastMessage("パスワード再設定に失敗しました");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <div className="w-50">
        {isForgotPassword ? (
          <div className="text-center">
            <h2 className="fw-bold mb-4">パスワード再設定メール送信</h2>
            <p>
              パスワード再設定に必要なメールを送信しました。
              <br />
              メールのURLよりパスワード再設定画面へ進んでいただき、パスワードを再設定してください。
              <br />
              ※メールが届かない場合、入力したメールアドレスが間違っている可能性があります。
              <br />
              お手数ですが、再度、パスワード再設定からやり直してください。
            </p>
          </div>
        ) : (
          <>
            <h2 className="fw-bold text-center mb-4">パスワード再設定</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
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
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isLoading}
              >
                {isLoading && (
                  <Spinner animation="border" size="sm" className="me-2" />
                )}
                送信
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

export default ForgotPassword;
