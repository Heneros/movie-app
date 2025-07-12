import { MovieEntity } from '@/movie/entities-objectType/movie.entity';
import { User } from '@prisma/client';
export declare class UserEntity implements User {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: string;
    refreshToken: string[];
    isEmailVerified: boolean;
    blocked: boolean;
    avatar: string;
    preview: string;
    googleId: string;
    githubId: string;
    discordId: string;
    roles: string[];
    avatarId: number;
    provider: string;
    password: string;
    movies?: MovieEntity[];
    constructor(partial: Partial<UserEntity>);
}
