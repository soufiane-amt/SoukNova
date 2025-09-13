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

// @UseGuards(AuthGuard)
@Controller('user')
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
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    const userId = 43;

    const imageUrl = `/uploads/profile-pictures/${file.filename}`;
    await this.usersService.updateUserProfileImage(userId, imageUrl);
    return { url: imageUrl };
  }

  @Get('profile')
  async getProfilePicture() {
    console.log('------1---------');
    const userId = 43;

    const imageUrl = await this.usersService.getUserProfileImage(userId);
    console.log('imageUrl : ', imageUrl);
    return { imageUrl: imageUrl };
  }
}
