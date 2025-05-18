// users.interface.ts
export interface IUser {
  _id: string;
  name: string;
  email: string;
  createAt: Date;
  role: {
    _id: string;
    name: string;
  };

  permissions: {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}
