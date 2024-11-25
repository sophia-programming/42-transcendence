"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/actions/user";
import toast from "react-hot-toast";
import Link from "next/link";

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください" }),
    confirmPassword: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください" }),
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
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      setIsLoading(true);
      const res = await resetPassword({
        uid,
        token,
        password: data.password,
        rePassword: data.confirmPassword,
      });
      if (!res.success) {
        toast.error("パスワードのリセットに失敗しました");
        return;
      }
      setIsPasswordReset(true);
    } catch {
      toast.error("パスワードのリセットに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] m-auto">
      {isPasswordReset ? (
        <div className="text-center">
          <div className="text-2xl font-bold mb-10">パスワード再設定完了</div>

          <div>パスワードの再設定が完了しました</div>
          <div className="mb-5">ログインしてください</div>
          <Button asChild className="font-bold">
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-center mb-10">
            パスワード再設定
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新しいパスワード</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新しいパスワード(確認用)</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                送信
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
