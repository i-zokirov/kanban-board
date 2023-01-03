import { Schema, model, Types, Model } from "mongoose";

export interface IProject {
    title: string;
    owner: Types.ObjectId;
    members?: Types.ObjectId[];
    sections?: Types.ObjectId[];
}

interface IProjectMethods {
    isOwner(user: Types.ObjectId): boolean;
    isMember(user: Types.ObjectId | undefined): boolean;
}

type IProjectModel = Model<IProject, {}, IProjectMethods>;

const projectSchema = new Schema<IProject, IProjectModel, IProjectMethods>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        sections: [
            {
                type: Schema.Types.ObjectId,
                ref: "Section",
            },
        ],
    },
    { timestamps: true }
);

projectSchema.method("isOwner", function (user: Types.ObjectId) {
    return this.owner._id.toString() === user._id.toString();
});

projectSchema.method("isMember", function (user: Types.ObjectId) {
    return this.members.some(
        (member: Types.ObjectId) =>
            member._id.toString() === user._id.toString()
    );
});

const Project = model<IProject, IProjectModel>("Project", projectSchema);
export default Project;
