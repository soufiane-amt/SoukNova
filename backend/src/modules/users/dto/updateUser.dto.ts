import {
  IsString,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';

type StrongPasswordConstraints = {
  minLength: number;
  minLowercase: number;
  minUppercase: number;
  minNumbers: number;
  minSymbols: number;
};

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  image?: string;

  // Old password required if updating password
  @ValidateIf((o) => o.newPassword !== undefined)
  @IsString({ message: 'Old password is required to update the password' })
  oldPassword?: string;

  @ValidateIf((o) => o.oldPassword !== undefined)
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 2,
      minUppercase: 2,
      minNumbers: 2,
      minSymbols: 1,
    },
    {
      message: (args) => {
        const constraints = args.constraints[0] as StrongPasswordConstraints;
        const failedRules: string[] = [];
        const value = args.value as string | undefined;

        if (!value) {
          return 'New password is required';
        }

        if (value.length < constraints.minLength) {
          failedRules.push(`at least ${constraints.minLength} characters`);
        }
        const lowercase = (value.match(/[a-z]/g) || []).length;
        if (lowercase < constraints.minLowercase) {
          failedRules.push(`${constraints.minLowercase} lowercase letters`);
        }
        const uppercase = (value.match(/[A-Z]/g) || []).length;
        if (uppercase < constraints.minUppercase) {
          failedRules.push(`${constraints.minUppercase} uppercase letters`);
        }
        const numbers = (value.match(/[0-9]/g) || []).length;
        if (numbers < constraints.minNumbers) {
          failedRules.push(`${constraints.minNumbers} numbers`);
        }
        const symbols = (value.match(/[^A-Za-z0-9]/g) || []).length;
        if (symbols < constraints.minSymbols) {
          failedRules.push(`${constraints.minSymbols} symbols`);
        }

        return `Password is too weak. It should contain ${failedRules.join(', ')}.`;
      },
    },
  )
  newPassword?: string;
}
