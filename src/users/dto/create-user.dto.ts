import  * as validator from 'class-validator';

export class CreateUserDto {
    
    @validator.IsEmail({},{message: 'Email không hợp lệ'})
    email: string;

    @validator.IsString({message: 'Mật khẩu phai la string'})
    @validator.IsNotEmpty({message: 'Mật khẩu không được để trống'})
    password: string;

    name: string;

    age: number;

    asdress: string;

    phone: string;

    createdAt: Date;
    
    updatedAt: Date;
}
