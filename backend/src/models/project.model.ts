import mongoose, { Document } from "mongoose";

interface IProject extends Document {
    name: string;
    description: string;
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
}

const projectSchema = new mongoose.Schema<IProject>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        optional: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

export const Project = mongoose.model<IProject>('Project', projectSchema);
