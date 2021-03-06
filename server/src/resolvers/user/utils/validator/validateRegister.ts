import { UsernamePasswordInput } from "../../types/UsernamePasswordInput.type";

export const validateRegister = ({
  username,
  password,
  email,
}: UsernamePasswordInput) => {
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }

  if (password.length <= 2) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ];
  }

  if (username.includes("@")) {
    return [
      {
        field: "username",
        message: "can't include @ ",
      },
    ];
  }
  return null;
};
