import { UserDto } from "./UserDto";

export interface UsersListDto {
  success: boolean;
  data: UserDto[];
  total: number;
  page?: number;
  limit?: number;
}
