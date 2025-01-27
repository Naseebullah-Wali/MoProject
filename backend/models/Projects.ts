import { Model, Column, DataType, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Projects',
  timestamps: true, 
})
class Project extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  Body!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Country_ID!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Topic_ID!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Priority!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Charachter!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Status!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  Project_date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Project_number!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Level_of_importance!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Document_type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Developer!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  Took_affect_date!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  No_longer_valid_date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  File!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Image!: string;
}

export default Project;
