'use strict';
import { Model, Column, DataType, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Regions', 
  timestamps: true, 
})
class Region extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Region_Name!: string; 
}

export default Region;
