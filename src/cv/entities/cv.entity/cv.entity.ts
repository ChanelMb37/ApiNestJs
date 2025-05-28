import { TimestampEntites } from "src/Generics/timestamp.entites";
import { UserEntity } from "src/user/entites/user.entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("cv")
export class CvEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "name",
    length: 50,
    // unique: true,
  })
  name: string;

  @Column({
    // name: "firstname",
    length: 50,
    // unique: true,
  })
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: number;

  @Column()
  job: string;

  @Column({ nullable: true })
  path: string;

  @ManyToOne(
    () => UserEntity,
    (user) => user.cvs, // Assuming UserEntity has a 'cvs' relation defined
    {
      cascade: ["insert", "update"], // Automatically persist related user when saving the CV
      nullable: false,
      eager: true, // Load user data eagerly; set to false if not needed
    }, // Adjust cascade and eager loading as needed
  )
  user: UserEntity; // Assuming you have a UserEntity defined elsewhere
}
