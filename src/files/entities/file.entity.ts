import { Entity } from 'typeorm';
import { FileBase } from './file.base';

@Entity({ name: 'files' })
export class File extends FileBase {}
