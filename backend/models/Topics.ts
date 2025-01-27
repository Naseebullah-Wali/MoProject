import { Model, Column, DataType, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Topics',
  timestamps: true, 
})
class Topic extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Topic!: string;
}

export default Topic;
