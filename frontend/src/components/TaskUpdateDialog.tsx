import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import * as zod from 'zod'
import { useForm } from '@tanstack/react-form'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TaskUpdateDialogProps {
  isAdmin: boolean
  taskId: string
  projectId: string
  trigger: React.ReactNode
}

interface ProjectMember {
  _id: string
  fullname: string
  email: string
}

const AdminTaskUpdateSchema = zod.object({
  title: zod.string().min(1, 'Title is required').optional(),
  description: zod.string().min(1, 'Description is required').optional(),
  dueDate: zod
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    })
    .optional(),
  priority: zod.enum(['Low', 'Medium', 'High']).optional(),
  status: zod.enum(['To Do', 'In Progress', 'Done']).optional(),
})

const UserTaskUpdateSchema = zod.object({
  status: zod.enum(['To Do', 'In Progress', 'Done']).optional(),
})

const TaskUpdateDialog = (props: TaskUpdateDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const queryClient = useQueryClient()

  const project = useQuery({
    queryKey: ['project', props.projectId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/get/${props.projectId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }
      const data = await response.json()
      return data.data
    },
    enabled: isOpen,
  })

  const task = useQuery({
    queryKey: ['task', props.taskId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/task/${props.taskId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch task details')
      }
      const data = await response.json()
      return data.data
    },
    enabled: isOpen,
  })

  const adminForm = useForm({
    defaultValues: {
      title: task.data?.title || '',
      description: task.data?.description || '',
      dueDate: task.data?.dueDate
        ? new Date(task.data.dueDate).toISOString().split('T')[0]
        : '',
      priority: task.data?.priority || 'Low',
      status: task.data?.status || 'To Do',
    },
    validators: {
      onSubmit: AdminTaskUpdateSchema,
    },
    onSubmit: handleTaskUpdate,
  })

  const userForm = useForm({
    defaultValues: {
      status: task.data?.status || 'To Do',
    },
    validators: {
      onSubmit: UserTaskUpdateSchema,
    },
    onSubmit: handleTaskUpdate,
  })

  async function handleTaskUpdate({ value }: { value: any }) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/task/update/${props.projectId}/${props.taskId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(value),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update task')
        return
      }

      toast.success('Task updated successfully!')
      setIsOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['project', props.projectId, 'tasks'],
      })
      queryClient.invalidateQueries({
        queryKey: ['task', props.taskId],
      })
    } catch (error) {
      toast.error('Failed to update task. Please try again.')
    }
  }

  async function handleTaskAssign(userId: string) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/task/assign/${props.projectId}/${props.taskId}/${userId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.message || 'Failed to assign task');
            return;
        }

        toast.success('Task assigned successfully!');
        queryClient.invalidateQueries({
            queryKey: ['project', props.projectId, 'tasks'],
        });
        queryClient.invalidateQueries({
            queryKey: ['task', props.taskId],
        });
    } catch (error) {
        toast.error('Failed to assign task. Please try again.');
    }
  }

  async function handleTaskUnassign(userId: string) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/task/unassign/${props.projectId}/${props.taskId}/${userId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.message || 'Failed to unassign task');
            return;
        }

        toast.success('Task unassigned successfully!');
        queryClient.invalidateQueries({
            queryKey: ['project', props.projectId, 'tasks'],
        });
        queryClient.invalidateQueries({
            queryKey: ['task', props.taskId],
        });
    } catch (error) {
        toast.error('Failed to unassign task. Please try again.');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[calc(100vh-8rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>

        {props.isAdmin ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              adminForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <adminForm.Field
                name="title"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value as string}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Task title"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <adminForm.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value as string}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Task description"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <adminForm.Field
                name="priority"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value)
                        }
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <adminForm.Field
                name="dueDate"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Due Date</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value as string}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <adminForm.Field
                name="status"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value)
                        }
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
            <Button type="submit" className="mt-4">
              Update Task
            </Button>

            {/* Assign/Unassign Section */}
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-4 font-semibold">Manage Assignments</h3>

              {/* Currently Assigned Users */}
              <div className="mb-6">
                <FieldLabel>Currently Assigned To</FieldLabel>
                {task.data?.assignedTo && task.data.assignedTo.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {task.data.assignedTo.map((member: ProjectMember) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between rounded border p-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{member.fullname}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleTaskUnassign(member._id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    No one assigned to this task yet.
                  </p>
                )}
              </div>

              {/* Assign New User */}
              <div>
                <FieldLabel htmlFor="assignMember">Assign to Member</FieldLabel>
                <div className="mt-2 flex gap-2">
                  <Select
                    value={selectedMemberId}
                    onValueChange={setSelectedMemberId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {project.data?.members?.map((member: ProjectMember) => {
                          const isAlreadyAssigned = task.data?.assignedTo?.some(
                            (assigned: ProjectMember) => assigned._id === member._id
                          )
                          return (
                            <SelectItem
                              key={member._id}
                              value={member._id}
                              disabled={isAlreadyAssigned}
                            >
                              {member.fullname} ({member.email})
                              {isAlreadyAssigned ? ' - Already assigned' : ''}
                            </SelectItem>
                          )
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => {
                      if (selectedMemberId) {
                        handleTaskAssign(selectedMemberId)
                        setSelectedMemberId('')
                      }
                    }}
                    disabled={!selectedMemberId}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              userForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <FieldDescription>
                As a team member, you can only update the task status.
              </FieldDescription>

              <userForm.Field
                name="status"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value)
                        }
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
            <Button type="submit" className="mt-4">
              Update Status
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TaskUpdateDialog
