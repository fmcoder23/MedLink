import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsPhoneNumber('UZ', {message: "phone number must be a number of Uzbekistan"})
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: "+998901234567" })
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "12345" })
    password: string;
}
