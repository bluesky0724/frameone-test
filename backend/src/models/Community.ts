import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { User } from "./index";

export class Community {
    @prop({ required: true })
    public name?: string;

    @prop()
    public logo?: string;

    @prop({ ref: () => User })
    public members?: Ref<User>[];

    @prop({ default: 0 })
    public totalExperiencePoints?: number;
}
