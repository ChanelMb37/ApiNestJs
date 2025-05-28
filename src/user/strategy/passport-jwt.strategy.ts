/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PayloadInterface } from "../interfaces/payload.interface";
import { UserEntity } from "../entites/user.entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StrategyOptions } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>("SECRET") ??
        (() => {
          throw new Error("JWT secret is not defined in configuration");
        })(),
    };

    super(options);
  }

  async validate(payload: PayloadInterface) {
    const user = await this.userRepository.findOne({
      where: { username: payload.username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, salt, ...result } = user;
    return result;
  }
}
