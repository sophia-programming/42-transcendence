"use server";

const fetchAPI = async (url: string, options: RequestInit) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { success: false, error: "API URLが設定されていません" };
  }

  try {
    const response = await fetch(`${apiUrl}${url}`, options);
    if (!response.ok) {
      return { success: false, error: response.statusText };
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return { success: true, data: await response.json() };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "ネットワークエラーが発生しました" };
  }
};

interface TemporarrySignupProps {
  name: string;
  email: string;
  password: string;
  rePassword: string;
}

export const temporarrySignup = async ({
  name,
  email,
  password,
  rePassword,
}: TemporarrySignupProps) => {
  const body = JSON.stringify({
    name,
    email,
    password,
    re_password: rePassword,
  });

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };

  const result = await fetchAPI("/api/auth/users/", options);
  if (!result.success) {
    console.error(result.error);
    return { success: false };
  }

  return { success: true };
};

interface CompleteSignupProps {
  uid: string;
  token: string;
}

export const completeSignup = async ({ uid, token }: CompleteSignupProps) => {
  const body = JSON.stringify({ uid, token });

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };

  const result = await fetchAPI("/api/auth/users/activation/", options);
  if (!result.success) {
    console.error(result.error);
    return { success: false };
  }

  return { success: true };
};

interface ForgotPasswordProps {
  email: string;
}

export const forgotPassword = async ({ email }: ForgotPasswordProps) => {
  const body = JSON.stringify({ email });

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };

  const result = await fetchAPI("/api/auth/users/reset_password/", options);
  if (!result.success) {
    console.error(result.error);
    return { success: false };
  }

  return { success: true };
};

interface ResetPasswordProps {
  uid: string;
  token: string;
  password: string;
  rePassword: string;
}

export const resetPassword = async ({
  uid,
  token,
  password,
  rePassword,
}: ResetPasswordProps) => {
  const body = JSON.stringify({
    uid,
    token,
    new_password: password,
    re_new_password: rePassword,
  });

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };

  const result = await fetchAPI(
    "/api/auth/users/reset_password_confirm/",
    options
  );
  if (!result.success) {
    console.error(result.error);
    return { success: false };
  }

  return { success: true };
};

export interface UserDetailType {
  uid: string;
  name: string;
  email: string;
  avatar: string | undefined;
  introduction: string;
  created_at: string;
}

interface GetUserDetailProps {
  userId: string;
}

export const getUserDetail = async ({ userId }: GetUserDetailProps) => {
  const options: RequestInit = {
    method: "GET",
    cache: "no-store",
  };
  const result = await fetchAPI(`/api/users/${userId}/`, options);
  if (!result.success) {
    console.error(result.error);
    return { success: false, user: null };
  }

  return { success: true, user: result.data as UserDetailType };
};

interface UpdateUserProps {
  accessToken: string;
  name: string;
  introduction: string | undefined;
  avatar: string | undefined;
}

export const updateUser = async ({
  accessToken,
  name,
  introduction,
  avatar,
}: UpdateUserProps) => {
  const body = JSON.stringify({ name, introduction, avatar });

  const options: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `JWT ${accessToken}`,
      "Content-Type": "application/json",
    },
    body,
  };

  const result = await fetchAPI("/api/auth/users/me/", options);
  if (!result.success) {
    console.error(result.error);
    return { success: false, user: null };
  }

  return { success: true, user: result.data as UserDetailType };
};

interface UpdatePasswordProps {
  accessToken: string;
  currentPassword: string;
  newPassword: string;
  reNewPassword: string;
}

export const updatePassword = async ({
  accessToken,
  currentPassword,
  newPassword,
  reNewPassword,
}: UpdatePasswordProps) => {
  const body = JSON.stringify({
    current_password: currentPassword,
    new_password: newPassword,
    re_new_password: reNewPassword,
  });

  const options: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `JWT ${accessToken}`,
      "Content-Type": "application/json",
    },
    body,
  };

  const result = await fetchAPI("/api/auth/users/set_password/", options);
  if (!result.success) {
    console.error(result.error);
    return { success: false };
  }

  return { success: true };
};
