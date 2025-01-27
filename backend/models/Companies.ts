import { Model,Column,DataType,Table,ForeignKey,BelongsTo,} from 'sequelize-typescript';
import Country from './Countries';
import Region from './Region';
  
  @Table({
    tableName: 'Companies',
    timestamps: true, 
  })
  class Company extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    })
    id!: number;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    Company_Name!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    Company_Logo!: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    About!: string;
  
    @ForeignKey(() => Country)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    Country_ID!: number;
  
    @ForeignKey(() => Region)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    Region_ID!: number;
  
    @BelongsTo(() => Country)
    country!: Country;
  
    @BelongsTo(() => Region)
    region!: Region;
  }
  
  export default Company;
  