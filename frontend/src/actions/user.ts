"use server";

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
  try {
    const body = JSON.stringify({
      name,
      email,
      password,
      re_password: rePassword,
    });

    console.log(body);

    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    );

    if (!apiRes.ok) {
      console.log(apiRes);
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
};
