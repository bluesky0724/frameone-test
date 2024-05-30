import { User } from "./User";
import { Community } from "./Community";
import { getModelForClass } from "@typegoose/typegoose";

const CommunityModel = getModelForClass(Community);
const UserModel = getModelForClass(User);

export { UserModel, User, CommunityModel, Community };
