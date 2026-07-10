import { Role } from "../../../generated/prisma/enums";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  role?:Role;
}

export default User
