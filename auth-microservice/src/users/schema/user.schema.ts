import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  autoCreate: true,
  autoIndex: true,
})
export class User extends Document {
  @Prop()
  _id: Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  // @Prop() 
  // refreshToken?: string;

  @Prop({
    type: Date,
  })
  createdAt?: Date;

  @Prop({
    type: Date,
  })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  createdAt: -1,
});
