import { googleLogout, useGoogleLogin } from "@react-oauth/google";

export type User = {
  accessToken: string;
  expires_in: number;
  name: string;
  picture?: string;
  email: string;
};

export const useGoogleAuth = (
  onSuccess: (user: User) => void,
  onError: () => void
) => {
  return useGoogleLogin({
    onError: (errorResponse) => {
      console.log("Login failed:", errorResponse);
      onError();
    },
    onSuccess: (tokenResponse) => {
      console.log({ tokenResponse });
      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user info");
          }
          return response.json();
        })
        .then((userInfo) => {
          const user: User = {
            ...userInfo,
            accessToken: tokenResponse.access_token,
            expires_in: tokenResponse.expires_in,
          };
          console.log({ user });
          onSuccess(user);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          onError();
        });
    },
    scope: "https://www.googleapis.com/auth/spreadsheets",
  });
};

export const logout = () => {
  googleLogout();
};
