import * as zod from 'zod';

export const TaskCreateSchema = zod.object({
    title: zod.string().min(1, 'Title is required'),
    description: zod.string().min(1, 'Description is required'),
    dueDate: zod.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }).default(() => new Date().toISOString()),
    priority: zod.enum(['Low', 'Medium', 'High']).default('Low'),
    assignedTo: zod.array(zod.string()).optional().default([]),
});

export const AdminTaskUpdateSchema = zod.object({
    title: zod.string().min(1, 'Title is required').optional(),
    description: zod.string().min(1, 'Description is required').optional(),
    dueDate: zod.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }).optional(),
    priority: zod.enum(['Low', 'Medium', 'High']).optional(),
    status: zod.enum(['To Do', 'In Progress', 'Done']).optional(),
});

export const UserTaskUpdateSchema = zod.object({
    status: zod.enum(['To Do', 'In Progress', 'Done']).optional(),
});
