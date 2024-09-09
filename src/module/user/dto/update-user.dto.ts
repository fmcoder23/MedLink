import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(3)
    @ApiPropertyOptional({ example: "John Doe" })
    fullname?: string;

    @IsOptional()
    @IsPhoneNumber('UZ', { message: "phone number must be a number of Uzbekistan" })
    @Transform(({ value }) => value.trim())
    @ApiPropertyOptional({ example: "+998901234567" })
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @ApiPropertyOptional({ example: "12345" })
    password?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: "photo_name.jpg" })
    @Transform(({ value }) => value.trim())
    photo?: string;

    @IsOptional()
    @IsEnum({ "ADMIN": UserRole.ADMIN, "SUPERADMIN": UserRole.SUPERADMIN, "USER": UserRole.USER })
    @ApiPropertyOptional({ enum: UserRole, example: UserRole.ADMIN })
    role?: UserRole;

}
