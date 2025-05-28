import { Body, Controller, Post } from "@nestjs/common";
import { UserEntity } from "./entites/user.entity/user.entity";
import { UserService } from "./user.service";
import { LoginCredentialDto } from "./dto/login-credentials.dto";
import { UserSubscribeDto } from "./dto/login-creden";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {} // Inject UserService to handle user-related operations
  @Post()
  register(
    @Body() userData: UserSubscribeDto, // Use the UserSubscribeDto to validate the request body
  ): Promise<Partial<UserEntity>> {
    return this.userService.register(userData); // Call the subscribe method from UserService
  }
  // Method to handle user registration
  @Post("login")
  login(
    @Body() credentials: LoginCredentialDto, // Use the UserSubscribeDto to validate the request body
  ) {
    return this.userService.login(credentials); // Call the subscribe method from UserService
  }
}
