import { UpdateUserDto } from './dto-input/update-user.dto';
import { UserEntity } from './entities-objectType/user.entity';
import { UpdateUserRole } from './dto-input/update-user-role.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
export declare class UsersController {
    private readonly cloudinaryService;
    private readonly commandBus;
    private readonly queryBus;
    constructor(cloudinaryService: CloudinaryService, commandBus: CommandBus, queryBus: QueryBus);
    findAll(page: number): Promise<UserEntity>;
    allBlocked(page: number): Promise<UserEntity>;
    findOne(id: number): Promise<UserEntity>;
    update(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: number): Promise<any>;
    changeRole(id: number, updateUserRole: UpdateUserRole): Promise<UserEntity>;
    removeMyAccount(userId: number): Promise<any>;
    banUser(id: number): Promise<any>;
    uploadImage(userId: string, file: Express.Multer.File): Promise<"Error during upload file" | {
        avatar: number;
    }>;
}
