import { Module } from "@nestjs/common";
import { CvController } from "./cv.controller";
import { CvService } from "./cv.service";
import { CvEntity } from "./entities/cv.entity/cv.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CvEntity]),
    UserModule, // Import UserModule to access UserService
  ],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
