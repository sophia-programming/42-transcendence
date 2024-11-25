"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { updatePassword } from "@/actions/user";
import { UserType } from "@/lib/nextauth";

const schema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
    newPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
    confirmPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof schema>;

interface PasswordProps {
  user: UserType;
}

const Password = ({ user }: PasswordProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);

    try {
      const res = await updatePassword({
        accessToken: user.accessToken,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        reNewPassword: data.confirmPassword,
      });

      if (!res.success) {
        setToastMessage("パスワードの変更に失敗しました");
        setShowToast(true);
        return;
      }

      setToastMessage("パスワードを変更しました");
      setShowToast(true);
      router.refresh();
    } catch {
      setToastMessage("パスワードの変更に失敗しました");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="fw-bold mb-4 text-center">パスワード変更</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label>現在のパスワード</Form.Label>
              <Form.Control
                type="password"
                placeholder="現在のパスワード"
                {...register("currentPassword")}
                isInvalid={!!errors.currentPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.currentPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>新しいパスワード</Form.Label>
              <Form.Control
                type="password"
                placeholder="新しいパスワード"
                {...register("newPassword")}
                isInvalid={!!errors.newPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>新しいパスワード（確認）</Form.Label>
              <Form.Control
                type="password"
                placeholder="新しいパスワード（確認）"
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
              変更
            </Button>
          </Form>
        </Col>
      </Row>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg="danger"
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">通知</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Password;
