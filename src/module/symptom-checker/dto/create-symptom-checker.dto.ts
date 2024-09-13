import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateSymptomCheckerDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "Please describe your problem accurately"})
    description: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({example: "User ID"})
    userId: string;

}
