export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  name: string;
  email: string;
};
