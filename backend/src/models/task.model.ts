import mongoose, { Document } from "mongoose";

interface ITask extends Document {
    title: string;
    description: string;
    dueDate: Date;
    priority: 'Low' | 'Medium' | 'High';
    createdBy: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId[];
    status: 'To Do' | 'In Progress' | 'Done';
    projectId: mongoose.Types.ObjectId;
}

const taskSchema = new mongoose.Schema<ITask>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    }
}, { timestamps: true });

export const Task = mongoose.model<ITask>('Task', taskSchema);
