"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { temporarrySignup } from "@/actions/user";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, { message: "2文字以上入力する必要があります" }),
  email: z.string().email({ message: "メールアドレスの形式ではありません" }),
  password: z.string().min(8, { message: "8文字以上入力する必要があります" }),
});

type InputType = z.infer<typeof schema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);

    try {
      const res = await temporarrySignup({
        name: data.name,
        email: data.email,
        password: data.password,
        rePassword: data.password,
      });

      if (!res.success) {
        // toast.error("サインアップに失敗しました");
        console.log("サインアップに失敗しました");
        return;
      }

      setIsSignUp(true);
    } catch {
      //   toast.error("サインアップに失敗しました");
      console.log("サインアップに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] m-auto">
      {isSignUp ? (
        <>
          <div className="text-2xl font-bold text-center mb-10">仮登録完了</div>
          <div className="">
            アカウント本登録に必要なメールを送信しました。
            <br />
            メールのURLより本登録画面へ進んでいただき、本登録を完了させてください。
            <br />
            ※メールが届かない場合、入力したメールアドレスが間違っている可能性があります。
            <br />
            お手数ですが、再度、新規登録からやり直してください。
          </div>
        </>
      ) : (
        <>
          <p className="h2 fw-bold text-center mb-5">新規登録</p>

          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>名前</Form.Label>
              <Form.Control
                type="text"
                placeholder="名前"
                {...register("name")}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

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

            <Form.Text className="text-muted">
              サインアップすることで、利用規約、プライバシーポリシーに同意したことになります。
            </Form.Text>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading && (
                <Spinner animation="border" size="sm" className="me-2" />
              )}
              アカウント作成
            </Button>
          </Form>

          <div className="text-center mt-5">
            <Link href="/login" className="text-sm text-blue-500">
              すでにアカウントをお持ちの方
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Signup;
