import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Community } from "./index";

export class User {
    @prop({ required: true })
    public email?: string;

    @prop({ required: true, select: false })
    public passwordHash?: string;

    @prop()
    public profilePicture?: string;

    @prop({ required: true, default: [] })
    public experiencePoints?: { points: number; timestamp: Date }[];

    @prop({ ref: () => Community, default: undefined })
    public community?: Ref<Community>;
}
