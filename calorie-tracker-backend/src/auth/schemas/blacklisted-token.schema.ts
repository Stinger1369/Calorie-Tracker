import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlacklistedTokenDocument = BlacklistedToken & Document;

@Schema({ timestamps: true })
export class BlacklistedToken {
  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: '60m' }) // Le token expire après 60 minutes
  createdAt: Date;
}

export const BlacklistedTokenSchema =
  SchemaFactory.createForClass(BlacklistedToken);
