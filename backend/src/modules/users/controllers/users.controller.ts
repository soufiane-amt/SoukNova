import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../user.decorator';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Put()
  async updateProfile(
    @User('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    //pass AbCd12!@
    const updatedUser = await this.usersService.updateUserData(
      userId,
      updateUserDto,
    );
    return {
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  @Post('upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @User('id') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/profile-pictures/${file.filename}`;
    await this.usersService.updateUserProfileImage(userId, imageUrl);
    return { url: imageUrl };
  }

  @Get('profile')
  async getProfilePicture(@User('id') userId: number) {
    const imageUrl = await this.usersService.getUserProfileImage(userId);
    return { imageUrl: imageUrl };
  }
}
