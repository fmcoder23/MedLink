import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class DoctorLoginDto {
    @IsNotEmpty()
    @IsPhoneNumber('UZ', { message: "Phone number must be a valid Uzbekistan number" })
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: "+998901234567" })
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @ApiProperty({ example: "12345" })
    password: string;
}
