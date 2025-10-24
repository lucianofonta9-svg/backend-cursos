import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesoreDto } from './create-profesore.dto';
import { IsBoolean, IsOptional } from 'class-validator'; // Necesario para validar 'activo'

export class UpdateProfesorDto extends PartialType(CreateProfesoreDto) {
  // Añadimos 'activo' para permitir que se reactive un profesor dado de baja
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}