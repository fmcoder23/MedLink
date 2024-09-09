import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateDoctorDto } from "./create.dto";

export class UpdateDoctorDto extends CreateDoctorDto {
    @IsOptional()
    @ApiPropertyOptional({ example: "12345", required: false })
    password: string;
    
  }
  