import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user";
import Project from "./Projects";

@Table({
  tableName: "Project_Comments",
  timestamps: true,
})
class ProjectComment extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  User_ID!: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Project_ID!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  Comment!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  Is_Deleted!: boolean;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Project)
  project!: Project;
}

export default ProjectComment;
