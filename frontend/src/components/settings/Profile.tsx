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
import { UserType } from "@/lib/nextauth";
import { updateUser } from "@/actions/user";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Image from "next/image";
import Link from "next/link";

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>({
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
      avatarUpload[0].dataURL &&
      avatarUpload[0].dataURL.startsWith("data:image")
    ) {
      base64Image = avatarUpload[0].dataURL;
    }

    try {
      const res = await updateUser({
        accessToken: user.accessToken,
        name: data.name,
        introduction: data.introduction,
        avatar: base64Image,
      });

      if (!res.success) {
        setToastMessage("プロフィールの編集に失敗しました");
        setShowToast(true);
        return;
      }

      setToastMessage("プロフィールを編集しました");
      setShowToast(true);
      router.refresh();
    } catch {
      setToastMessage("プロフィールの編集に失敗しました");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeImage = (imageList: ImageListType) => {
    const file = imageList[0]?.file;
    const maxFileSize = 2 * 1024 * 1024;

    if (file && file.size > maxFileSize) {
      setToastMessage("ファイルサイズは2MBを超えることはできません");
      setShowToast(true);
      return;
    }

    setAvatarUpload(imageList);
  };

  return (
    <Container>
      <Row className="justify-content-center mb-5">
        <Col md={6} className="text-center">
          <h2 className="fw-bold mb-4">プロフィール</h2>
          <ImageUploading
            value={avatarUpload}
            onChange={onChangeImage}
            maxNumber={1}
            acceptType={["jpg", "png", "jpeg"]}
          >
            {({ imageList, onImageUpdate }) => (
              <div className="d-flex flex-column align-items-center">
                {imageList.map((image, index) => (
                  <div key={index} className="mb-3">
                    {image.dataURL && (
                      <div
                        className="position-relative"
                        style={{ width: "96px", height: "96px" }}
                      >
                        <Image
                          fill
                          src={image.dataURL}
                          alt={user.name || "avatar"}
                          className="rounded-circle object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
                {imageList.length > 0 && (
                  <Button
                    variant="outline-primary"
                    onClick={() => onImageUpdate(0)}
                  >
                    アバターを変更
                  </Button>
                )}
              </div>
            )}
          </ImageUploading>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit(onSubmit)}>
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
              <Form.Control type="email" value={user.email} disabled />
            </Form.Group>

            <Form.Group className="mb-3" controlId="introduction">
              <Form.Label>自己紹介</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="自己紹介"
                {...register("introduction")}
                isInvalid={!!errors.introduction}
              />
              <Form.Control.Feedback type="invalid">
                {errors.introduction?.message}
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
      <Row className="justify-content-center mt-3">
        <Col md={6} className="text-center">
          <Link href="/settings/password" passHref>
            パスワード変更
          </Link>
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

export default Profile;
