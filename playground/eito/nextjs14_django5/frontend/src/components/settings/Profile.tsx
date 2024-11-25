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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { UserType } from "@/lib/nextauth";
import { updateUser } from "@/actions/user";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Image from "next/image";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(3, { message: "3文字以上入力する必要があります" }),
  introduction: z.string().optional(),
});

type InputType = z.infer<typeof schema>;

interface ProfileProps {
  user: UserType;
}

const Profile = ({ user }: ProfileProps) => {
  const router = useRouter();
  const [avatarUpload, setAvatarUpload] = useState<ImageListType>([
    {
      dataURL: user.avatar || "/default.png",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name || "",
      introduction: user.introduction || "",
    },
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);
    let base64Image;
    if (
      avatarUpload[0]?.file &&
      avatarUpload[0]?.dataURL?.startsWith("data:image")
    ) {
      base64Image = avatarUpload[0].dataURL;
    }

    try {
      console.log("data", data.introduction);
      console.log("data", data.name);
      const res = await updateUser({
        accessToken: user.accessToken,
        name: data.name,
        introduction: data.introduction,
        avatar: base64Image,
      });
      if (!res.success) {
        toast.error("更新に失敗しました");
        return;
      }
      toast.success("更新しました");
      router.refresh();
    } catch {
      toast.error("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeImage = (imageList: ImageListType) => {
    const file = imageList[0]?.file;
    const maxSize = 1024 * 1024 * 2;
    if (file && file.size > maxSize) {
      toast.error("2MB以下の画像を選択してください");
      return;
    }
    setAvatarUpload(imageList);
  };

  return (
    <div>
      <div className="text-xl font-bold text-center mb-5">プロフィール</div>
      <Form {...form}>
        <div className="mb-5">
          <ImageUploading
            value={avatarUpload}
            onChange={onChangeImage}
            maxNumber={1}
            acceptType={["jpg", "png", "jpeg"]}
          >
            {({ imageList, onImageUpdate }) => (
              <div className="w-full flex flex-col items-center justify-center">
                {imageList.map((image, index) => (
                  <div key={index}>
                    {image.dataURL && (
                      <div className="w-24 h-24 relative">
                        <Image
                          fill
                          src={image.dataURL}
                          alt={user.name || "avatar"}
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {imageList.length > 0 && (
                  <div className="text-center mt-3">
                    <Button variant="outline" onClick={() => onImageUpdate(0)}>
                      アバターを変更
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ImageUploading>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input placeholder="名前" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>メールアドレス</FormLabel>
            <Input value={user.email!} disabled />
          </FormItem>

          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>自己紹介</FormLabel>
                <FormControl>
                  <Textarea placeholder="自己紹介" {...field} rows={10} />
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

export default Profile;
