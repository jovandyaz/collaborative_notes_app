import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must be at most 200 characters' })
  title!: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Title must be at most 200 characters' })
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class ShareNoteDto {
  @IsUUID('4', { message: 'Invalid user ID format' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId!: string;

  @IsEnum(['viewer', 'editor'], {
    message: 'Permission must be either viewer or editor',
  })
  @IsNotEmpty({ message: 'Permission is required' })
  permission!: 'viewer' | 'editor';
}

export class NotesQueryDto {
  @IsString()
  @IsOptional()
  search?: string;
}
