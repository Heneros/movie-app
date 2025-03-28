import { Resolver } from '@nestjs/graphql';
import { AuthEntity } from './entity/auth.entity';

@Resolver(() => AuthEntity)
export class AuthResolver {
    
}
