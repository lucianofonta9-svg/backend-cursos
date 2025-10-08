import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('profesores')
export class Profesor {
  //Clave primaria 
  @PrimaryGeneratedColumn()
  legajoProfesor: number; 

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true })
  dni: string; 

  @Column({ unique: true })
  email: string; 

  @Column({ nullable: true })
  telefono: string; 

  @Column({ type: 'text', nullable: true }) // nota: podría ser enum 
  especialidades: string; 

  @Column({ type: 'date' })
  fechaNacimiento: Date;
  
  @Column({ default: true })
  activo: boolean; 
  
}