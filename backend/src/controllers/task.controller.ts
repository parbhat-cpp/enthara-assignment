import { Response } from 'express';
import HttpStatus from 'http-status';
import * as zod from 'zod';

import { VerifiedRequest } from '../types/req.types';
import { AdminTaskUpdateSchema, TaskCreateSchema, UserTaskUpdateSchema } from '../types/task.types';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import mongoose from 'mongoose';

export const createTask = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const { projectId } = req.params;
        const { title, description, dueDate, priority, assignedTo } = await zod.parseAsync(TaskCreateSchema, req.body);

        if (!projectId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Project ID is required' });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Project not found' });
        }

        if (project.createdBy.toString() !== req_user._id.toString()) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not authorized to add tasks to this project' });
        }

        const task = {
            title,
            description,
            dueDate: new Date(dueDate),
            priority,
            assignedTo,
            createdBy: req_user._id,
            projectId: project._id,
        };

        const newTask = new Task(task);
        await newTask.save();

        res.status(HttpStatus.CREATED).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation error', errors: error.issues });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating task', error });
    }
};

export const updateTask = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const projectId = req.params.projectId as string;
        const taskId = req.params.taskId as string;

        if (!projectId || !taskId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Project ID and Task ID are required' });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Project not found' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Task not found' });
        }

        const isProjectCreator = project.createdBy.toString() === req_user._id.toString();
        const isTaskCreator = task.createdBy.toString() === req_user._id.toString();
        const isAssignedUser = task.assignedTo.some((id: mongoose.Types.ObjectId) => id.equals(req_user._id));

        if (!isProjectCreator && !isTaskCreator && !isAssignedUser) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not authorized to update this task' });
        }

        if (isProjectCreator || isTaskCreator) {
            const { title, description, dueDate, priority, status } = await zod.parseAsync(AdminTaskUpdateSchema, req.body);
            if (title !== undefined) task.title = title;
            if (description !== undefined) task.description = description;
            if (dueDate !== undefined) task.dueDate = new Date(dueDate);
            if (priority !== undefined) task.priority = priority;
            if (status !== undefined) task.status = status;
        } else if (isAssignedUser) {
            const { status } = await zod.parseAsync(UserTaskUpdateSchema, req.body);
            if (status !== undefined) task.status = status;
        }

        await task.save();

        res.status(HttpStatus.OK).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error updating task', error });
    }
};

export const assignUserToTask = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const userId= req.params.userId as string;
        const projectId = req.params.projectId as string;
        const taskId = req.params.taskId as string;
        
        if (!projectId || !taskId || !userId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Project ID, Task ID and User ID are required' });
        }
        
        const userIdObj = new mongoose.Types.ObjectId(userId);
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Project not found' });
        }

        if (project.createdBy.toString() !== req_user._id.toString()) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not authorized to assign users to tasks in this project' });
        }

        const isCreator = project.createdBy.equals(userIdObj);
        const isMember = project.members.some((id: mongoose.Types.ObjectId) => id.equals(userIdObj));
        
        if (!isCreator && !isMember) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User is not a member of the project' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Task not found' });
        }

        if (task.projectId.toString() !== projectId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Task does not belong to the specified project' });
        }

        if (task.assignedTo.includes(userIdObj)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User is already assigned to this task' });
        }

        task.assignedTo.push(userIdObj);
        await task.save();

        res.status(HttpStatus.OK).json({ message: 'User assigned to task successfully', task });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error assigning user to task', error });
    }
};

export const unassignUserFromTask = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const userId= req.params.userId as string;
        const projectId = req.params.projectId as string;
        const taskId = req.params.taskId as string;
        
        if (!projectId || !taskId || !userId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Project ID, Task ID and User ID are required' });
        }
        
        const userIdObj = new mongoose.Types.ObjectId(userId);
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Project not found' });
        }

        if (project.createdBy.toString() !== req_user._id.toString()) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not authorized to unassign users from tasks in this project' });
        }

        const isCreator = project.createdBy.equals(userIdObj);
        const isMember = project.members.some((id: mongoose.Types.ObjectId) => id.equals(userIdObj));
        
        if (!isCreator && !isMember) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User is not a member of the project' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Task not found' });
        }

        if (task.projectId.toString() !== projectId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Task does not belong to the specified project' });
        }

        if (!task.assignedTo.includes(userIdObj)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User is not assigned to this task' });
        }

        task.assignedTo = task.assignedTo.filter((id: mongoose.Types.ObjectId) => !id.equals(userIdObj));
        await task.save();

        res.status(HttpStatus.OK).json({ message: 'User unassigned from task successfully', task });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error unassigning user from task', error });
    }
};
export const getTaskById = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const taskId = req.params.taskId as string;

        if (!taskId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Task ID is required' });
        }

        const task = await Task.findById(taskId).populate('assignedTo', 'email fullname');

        if (!task) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Task not found' });
        }

        const isCreator = task.createdBy.equals(req_user._id);
        const isAssigned = task.assignedTo.some((id: mongoose.Types.ObjectId) => id.equals(req_user._id));

        if (!isCreator && !isAssigned) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not authorized to view this task' });
        }

        const project = await Project.findById(task.projectId);
        const isProjectCreator = project?.createdBy.equals(req_user._id);

        res.status(HttpStatus.OK).json({
            data: {
                ...task.toObject(),
                isAdmin: isCreator || isProjectCreator // Admin if task creator OR project creator
            }
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching task', error });
    }
};

export const getAllTasksByProjectId = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const projectId = req.params.projectId as string;

        if (!projectId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Project ID is required' });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Project not found' });
        }

        const isProjectCreator = project.createdBy.equals(req_user._id);
        const isProjectMember = project.members.some((id: mongoose.Types.ObjectId) => id.equals(req_user._id));

        if (!isProjectCreator && !isProjectMember) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not authorized to view tasks in this project' });
        }

        const tasks = await Task.find({ projectId: project._id }).populate('assignedTo', 'email fullname');

        const filteredTasks = tasks.filter(task => {
            const isTaskCreator = task.createdBy.equals(req_user._id);
            const isAssignedToTask = task.assignedTo.some((id: mongoose.Types.ObjectId) => id.equals(req_user._id));
            return isProjectCreator || isTaskCreator || isAssignedToTask;
        });

        const tasksWithRole = filteredTasks.map(task => ({
            ...task.toObject(),
            isAdmin: task.createdBy.equals(req_user._id) || isProjectCreator
        }));

        res.status(HttpStatus.OK).json({ data: tasksWithRole });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching tasks', error });
    }
};

export const deleteTask = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const projectId = req.params.projectId as string;
        const taskId = req.params.taskId as string;

        if (!projectId || !taskId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Project ID and Task ID are required' });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Project not found' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Task not found' });
        }

        const isProjectCreator = project.createdBy.toString() === req_user._id.toString();
        const isTaskCreator = task.createdBy.toString() === req_user._id.toString();

        if (!isProjectCreator && !isTaskCreator) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not authorized to delete this task' });
        }

        await task.deleteOne();

        res.status(HttpStatus.OK).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting task', error });
    }
};
