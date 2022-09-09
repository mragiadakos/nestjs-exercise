import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class LoginDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;

}


export class SignUpDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

}

