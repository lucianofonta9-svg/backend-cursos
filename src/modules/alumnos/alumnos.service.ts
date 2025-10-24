import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from './entities/alumno.entity';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
  ) {}

  // 1. Crear alumno (Usa el DTO para entrada de datos)
  async create(createDto: CreateAlumnoDto): Promise<Alumno> {
    const alumno = this.alumnoRepository.create(createDto);
    return this.alumnoRepository.save(alumno);
  }

  // 2. Obtener todos los alumnos (Carga inscripciones)
  findAll(): Promise<Alumno[]> {
    return this.alumnoRepository.find({
      relations: ['inscripciones'],
      where: { activo: true }, // Opcional: solo listar activos
    });
  }

  // 3. Obtener uno por Legajo
  async findOne(legajoAlumno: number): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findOne({
      where: { legajoAlumno, activo: true }, // Buscar por legajo y activo
      relations: ['inscripciones'],
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con legajo ${legajoAlumno} no encontrado.`);
    }
    return alumno;
  }

  // 4. Actualizar alumno (Usa el DTO de actualización y manejo de errores)
  async update(legajoAlumno: number, updateDto: UpdateAlumnoDto): Promise<Alumno> {
    // Reutilizamos findOne para que lance 404 si no existe
    const alumno = await this.findOne(legajoAlumno); 

    // Mergeamos los datos del DTO con la entidad existente
    this.alumnoRepository.merge(alumno, updateDto);
    
    // Guardamos y retornamos
    return this.alumnoRepository.save(alumno);
  }

  // 5. Eliminar (Baja Lógica)
  async remove(legajoAlumno: number): Promise<Alumno> {
    // Reutilizamos findOne para verificar existencia
    const alumno = await this.findOne(legajoAlumno);
    
    // Ejecutamos la baja lógica
    alumno.activo = false; 
    
    return this.alumnoRepository.save(alumno);
  }
}