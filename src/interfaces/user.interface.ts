export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export interface IPromo {
  code: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
