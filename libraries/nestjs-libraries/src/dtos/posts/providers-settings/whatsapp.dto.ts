import { IsOptional, IsString } from 'class-validator';

export class WhatsappDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
