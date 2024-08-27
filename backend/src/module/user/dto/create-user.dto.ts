import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(3)
    @ApiProperty({ example: "John Doe" })
    fullname: string;

    @IsNotEmpty()
    @IsPhoneNumber('UZ', { message: "phone number must be a number of Uzbekistan" })
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: "+998901234567" })
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty({ example: "12345" })
    password: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: "photo_name.jpg" })
    @Transform(({ value }) => value.trim())
    photo: string;

    @IsNotEmpty()
    @IsEnum({ "ADMIN": UserRole.ADMIN, "SUPERADMIN": UserRole.SUPERADMIN, "USER": UserRole.USER })
    @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
    role: UserRole;

}
