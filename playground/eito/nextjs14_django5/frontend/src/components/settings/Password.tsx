"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { updatePassword } from "@/actions/user";
import { UserType } from "@/lib/nextauth";
import toast from "react-hot-toast";

const schema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
    newPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
    repeatedPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
  })
  .refine((data) => data.newPassword === data.repeatedPassword, {
    message: "新しいパスワードが一致しません",
    path: ["repeatedPassword"],
  });

type InputType = z.infer<typeof schema>;

interface PasswordProps {
  user: UserType;
}

const Password = ({ user }: PasswordProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatedPassword: "",
    },
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);
    try {
      const res = await updatePassword({
        accessToken: user.accessToken,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        reNewPassword: data.repeatedPassword,
      });
      if (!res.success) {
        toast.error("パスワードの変更に失敗しました");
        setIsLoading(false);
        return;
      }
      toast.success("パスワードを変更しました");
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("パスワードの変更に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-xl font-bold text-center mb-5">パスワード変更</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>現在のパスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
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
            name="repeatedPassword"
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
            変更
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Password;
