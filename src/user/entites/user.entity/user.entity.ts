import { CvEntity } from "src/cv/entities/cv.entity/cv.entity";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { TimestampEntites } from "src/Generics/timestamp.entites";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true,
  })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({
    type: "enum",
    enum: UserRoleEnum,
    default: UserRoleEnum.USER, // Default role can be set to USER or any other role you prefer
    // type: "enum",
  })
  role: string; // Assuming role is a string, adjust as needed

  @OneToMany(() => CvEntity, (cv) => cv.user, {
    cascade: true, // Automatically persist related CVs when saving the user
    nullable: true, // Allow user to exist without CVs
  })
  cvs: CvEntity[];
}
