import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Field } from '@nestjs/graphql';
import { Scalar } from '@nestjs/graphql';
// import GraphQLUpload from 'graphql-upload';

        // @Scalar('Upload', () => GraphQLUpload)
export class FileUploadDto {
    @ApiProperty()
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
