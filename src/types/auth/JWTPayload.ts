export type JWTPayload = {
  id: number;
  dni: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  photoUrl: string | null;
  playerId: number | null;
  socialId: string | null;
};
