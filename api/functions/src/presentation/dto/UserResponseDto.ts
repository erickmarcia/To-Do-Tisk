import { UserDto } from "./UserDto";

export interface UserResponseDto {
  success: boolean;
  data: UserDto;
  message?: string;
}
