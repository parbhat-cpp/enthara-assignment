import { Response } from 'express';
import HttpStatus from 'http-status';
import mongoose from 'mongoose';
import * as zod from "zod";

import { VerifiedRequest } from '../types/req.types';
import { CreateProjectSchema } from '../types/project.types';
import { Project } from '../models/project.model';

export const createProject = async (req: VerifiedRequest, res: Response) => {
  try {
    const req_user = req.user;
    const { name, description } = await zod.parseAsync(CreateProjectSchema, req.body);

    const newProject = new Project({
      name,
      description,
      createdBy: req_user._id,
    });

    await newProject.save();

    res.status(HttpStatus.CREATED).json({ message: "Project created successfully", data: newProject });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Validation failed", errors: error.issues });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to create project", error });
  }
};

export const addUserToProject = async (req: VerifiedRequest, res: Response) => {
  try {
    const req_user = req.user;
    const userId = req.params.userId as string;
    const projectId = req.params.projectId as string;

    if (!userId || !projectId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "User ID and Project ID are required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req_user._id.toString()) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Only the project creator can add members" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    if (project.members.includes(userIdObj)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "User is already a member of the project" });
    }

    project.members.push(userIdObj);
    await project.save();

    res.status(HttpStatus.OK).json({ message: "User added to project successfully" });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to create project", error });
  }
};

export const removeUserFromProject = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const userId = req.params.userId as string;
        const projectId = req.params.projectId as string;

        if (!userId || !projectId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "User ID and Project ID are required" });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Project not found" });
        }

        if (project.createdBy.toString() !== req_user._id.toString()) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "Only the project creator can remove members" });
        }

        const userIdObj = new mongoose.Types.ObjectId(userId);

        if (!project.members.includes(userIdObj)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "User is not a member of the project" });
        }

        project.members = project.members.filter(memberId => memberId.toString() !== userIdObj.toString());
        await project.save();

        res.status(HttpStatus.OK).json({ message: "User removed from project successfully" });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to remove user from project", error });
    }
};

export const getProjectById = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const projectId = req.params.projectId as string;

        if (!projectId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Project ID is required" });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Project not found" });
        }

        const isCreator = project.createdBy.equals(req_user._id);
        const isMember = project.members.some((id: mongoose.Types.ObjectId) => id.equals(req_user._id));

        if (!isCreator && !isMember) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "You do not have access to this project" });
        }

        res.status(HttpStatus.OK).json({ 
            message: "Project retrieved successfully", 
            data: {
                ...project.toObject(),
                isAdmin: isCreator
            }
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to get project", error });
    }
};

export const getAllProjects = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;

        const projects = await Project.find({
            $or: [
                { createdBy: req_user._id },
                { members: { $in: [req_user._id] } }
            ]
        });

        const projectsWithRole = projects.map(project => ({
            ...project.toObject(),
            isAdmin: project.createdBy.equals(req_user._id)
        }));

        res.status(HttpStatus.OK).json({ message: "Projects retrieved successfully", data: projectsWithRole });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to get all projects", error });
    }
};

export const deleteProject = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const projectId = req.params.projectId as string;

        if (!projectId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Project ID is required" });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Project not found" });
        }

        if (project.createdBy.toString() !== req_user._id.toString()) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "Only the project creator can delete the project" });
        }

        await project.deleteOne();

        res.status(HttpStatus.OK).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete project", error });
    }
};
