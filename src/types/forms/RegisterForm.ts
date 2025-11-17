export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  profilePhoto?: string;
};

export const registerDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  profilePhoto: "",
};
