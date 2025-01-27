import { Model, Column, DataType, Table, ForeignKey,BelongsTo } from 'sequelize-typescript';
import Region from './Region'; 

@Table({
  tableName: 'Countries', 
  timestamps: true, 
})
class Country extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Country_Name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, 
  })
  Flag!: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Region_ID!: number;
  @BelongsTo(() => Region)
  region!: Region;
}

export default Country;
