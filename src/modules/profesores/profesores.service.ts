import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesore.entity';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
  ) {}

  // 1. Crear Profesor
  async create(createDto: CreateProfesorDto): Promise<Profesor> {
    const nuevoProfesor = this.profesorRepository.create(createDto);
    return this.profesorRepository.save(nuevoProfesor);
  }

  // 2. Obtener todos los Profesores (activos)
  findAll(): Promise<Profesor[]> {
    return this.profesorRepository.find({
      where: { activo: true },
      relations: ['cursos'], // carga los cursos de cada profesor 
    });
  }

  // 3. Obtener uno por Legajo
  async findOne(legajoProfesor: number): Promise<Profesor> {
    const profesor = await this.profesorRepository.findOne({
      where: { legajoProfesor, activo: true },
      relations: ['cursos'],
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con legajo ${legajoProfesor} no encontrado.`);
    }
    return profesor;
  }

  // 4. Actualizar Profesor
  async update(legajoProfesor: number, updateDto: UpdateProfesorDto): Promise<Profesor> {
    // Reutilizamos findOne para verificar existencia y obtener la entidad
    const profesor = await this.findOne(legajoProfesor); 

    // Mergeamos los datos y guardamos
    this.profesorRepository.merge(profesor, updateDto);
    
    return this.profesorRepository.save(profesor);
  }

  // 5. Eliminar (Baja Lógica)
  async remove(legajoProfesor: number): Promise<Profesor> {
    // Reutilizamos findOne para verificar existencia
    const profesor = await this.findOne(legajoProfesor);
    
    // Ejecutamos la baja lógica
    profesor.activo = false; 
    
    return this.profesorRepository.save(profesor);
  }
}
