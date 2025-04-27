import  * as validator from 'class-validator';

export class CreateUserDto {
    
    @validator.IsEmail()
    email: string;

    @validator.IsString()
    @validator.IsNotEmpty()
    password: string;

    name: string;

    age: number;

    asdress: string;

    phone: string;

    createdAt: Date;
    
    updatedAt: Date;
}
