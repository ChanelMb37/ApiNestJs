/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

import { UserEntity } from "./entites/user.entity/user.entity";
import { LoginCredentialDto } from "./dto/login-credentials.dto";
import { UserSubscribeDto } from "./dto/login-creden";
import { JwtService } from "@nestjs/jwt";
import { UserRoleEnum } from "src/enums/user-role.enum"; // Enum des rôles utilisateur

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  /**
   * Inscription d'un utilisateur
   * @param userData données à enregistrer
   */
  async register(userData: UserSubscribeDto): Promise<Partial<UserEntity>> {
    const user = this.userRepository.create({ ...userData });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(`Le nom d'utilisateur ou l'email est déjà utilisé.`);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  /**
   * Authentification de l'utilisateur
   */
  async login(credentials: LoginCredentialDto) {
    const { username, password } = credentials;

    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.username = :identifier OR user.email = :identifier", { identifier: username })
      .getOne();

    if (!user) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec ce nom d'utilisateur.`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException(`Mot de passe incorrect pour l'utilisateur ${username}`);
    }

    const payload = { username: user.username, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  /**
   * Vérifie si l'utilisateur est le propriétaire d'un objet ou s'il est administrateur
   * @param objet Entité liée à un utilisateur (CV, projet, etc.)
   * @param user Utilisateur authentifié
   */
  isOwnerOrAdmin(objet: { user?: { id: number } }, user: UserEntity): boolean {
    return user.role === UserRoleEnum.ADMIN || !!(objet.user && objet.user.id === user.id);
  }
}
