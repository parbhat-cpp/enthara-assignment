import { useState } from 'react'

import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as z from 'zod'
import toast from 'react-hot-toast'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import TaskUpdateDialog from '#/components/TaskUpdateDialog'
import AddMemberDialog from '#/components/AddMemberDialog'

export const Route = createFileRoute('/dashboard/project/$projectId')({
  component: RouteComponent,
})

type ProjectMember = {
  _id: string
  fullname: string
  email: string
  isAdmin?: boolean
}

type AddTaskFormValues = {
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  dueDate: string
  assignedTo: string[]
}

const addTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().default(''),
  priority: z.enum(['Low', 'Medium', 'High']).default('Low'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  assignedTo: z.array(z.string()).default([]),
})

function RouteComponent() {
  const [currentUser] = useState(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null,
  )

  const navigator = useNavigate()
  const { projectId } = Route.useParams()
  const [selectedAssigneeId, setSelectedAssigneeId] = useState('')

  const project = useQuery({
    queryKey: ['project', projectId],
    queryFn: fetchProject,
  })

  const projectTasks = useQuery({
    queryKey: ['project', projectId, 'tasks'],
    queryFn: fetchProjectTasks,
  })

  const addTaskForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'Low',
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: [] as string[],
    },
    validators: {
      onSubmit: addTaskSchema,
    },
    onSubmit: async ({ value }: { value: AddTaskFormValues }) => {
      try {
        const payload = {
          ...value,
          assignedTo: selectedAssigneeId ? [selectedAssigneeId] : [],
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/task/create/${projectId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          toast.error(errorData.message || 'Failed to add task')
          throw new Error(errorData.message || 'Failed to add task')
        }

        toast.success('Task added successfully!')
        setSelectedAssigneeId('')
        addTaskForm.reset()
        projectTasks.refetch()
      } catch (error) {
        toast.error('Failed to add task')
      }
    },
  } as any)

  async function fetchProject() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/get/${projectId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to fetch project details')
        throw new Error(errorData.message || 'Failed to fetch project details')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      toast.error('Failed to fetch project details')
      navigator({ to: '/dashboard' })
    }
  }

  async function handleProjectDelete() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/delete/${projectId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete project')
        throw new Error(errorData.message || 'Failed to delete project')
      }

      toast.success('Project deleted successfully!')
      navigator({ to: '/dashboard' })
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  async function fetchProjectTasks() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/task/all/${projectId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to fetch project tasks')
        throw new Error(errorData.message || 'Failed to fetch project tasks')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      toast.error('Failed to fetch project tasks')
    }
  }

  async function handleTaskDelete(taskId: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/task/delete/${projectId}/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete task')
        throw new Error(errorData.message || 'Failed to delete task')
      }

      toast.success('Task deleted successfully!')
      projectTasks.refetch()
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  async function handleMemberRemove(memberId: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/remove/${projectId}/${memberId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to remove member')
        throw new Error(errorData.message || 'Failed to remove member')
      }

      toast.success('Member removed successfully!')
      project.refetch()
    } catch (error) {
      toast.error('Failed to remove member')
    }
  }

  return (
    <main className="h-screen w-full">
      <header className="flex items-center justify-between bg-black px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            {project.data?.name || 'Project Details'}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-sm ${project.data?.isAdmin ? 'bg-green-500' : 'bg-gray-500'}`}
          >
            {project.data?.isAdmin ? 'Admin' : 'Member'}
          </span>
        </div>
        {project.data?.isAdmin && (
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">Add Task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Task</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    addTaskForm.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <addTaskForm.Field
                      name="title"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value as string}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Title of the task"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <addTaskForm.Field
                      name="description"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Description
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value as string}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Description of the task"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <addTaskForm.Field
                      name="priority"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Priority
                            </FieldLabel>
                            <Select
                              value={field.state.value as string}
                              onValueChange={(value) =>
                                field.handleChange(value as any)
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
                    <addTaskForm.Field
                      name="dueDate"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Due Date
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              type="date"
                              value={field.state.value as string}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <Field>
                      <FieldLabel htmlFor="assignedTo">Assign To</FieldLabel>
                      <Select
                        value={selectedAssigneeId}
                        onValueChange={setSelectedAssigneeId}
                      >
                        <SelectTrigger id="assignedTo">
                          <SelectValue placeholder="Select a project member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {project.data?.members?.map(
                              (member: ProjectMember) => (
                                <SelectItem key={member._id} value={member._id}>
                                  {member.fullname} ({member.email})
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Optional — select a member to assign the task
                        immediately.
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                  <Button type="submit">Add Task</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={handleProjectDelete}>
              Delete Project
            </Button>
          </div>
        )}
      </header>
      <div className="grid grid-cols-1 border-l md:grid-cols-[2fr_1fr]">
        <div className="grid h-[calc(100vh-68px)] grid-cols-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2">
          {projectTasks.data?.length === 0 && <p>No tasks in this project.</p>}
          {projectTasks.data?.map((task: any) => (
            <div
              key={task._id}
              className="h-min rounded-lg border p-4 shadow-sm hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-semibold">{task.title}</h3>
              <p className="mb-2 text-sm text-gray-600">{task.description}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    task.priority === 'High'
                      ? 'bg-red-500'
                      : task.priority === 'Medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                >
                  {task.priority} Priority
                </span>
                <span className="text-xs text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
              {task.assignedTo.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Assigned to:{' '}
                  {task.assignedTo
                    .map((assignee: any) => assignee.fullname)
                    .join(', ')}
                </p>
              )}
              <span
                className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
                  task.isAdmin ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                {task.isAdmin ? 'Admin' : 'Member'}
              </span>
              <span>
                {task.status === 'Done' ? (
                  <span className="ml-2 inline-block rounded-full bg-green-500 px-2 py-1 text-xs">
                    Completed
                  </span>
                ) : (
                  <span className="ml-2 inline-block rounded-full bg-yellow-500 px-2 py-1 text-xs">
                    {task.status}
                  </span>
                )}
              </span>
              <div className="flex gap-4 items-center mt-4">
                <TaskUpdateDialog
                  taskId={task._id}
                  projectId={projectId}
                  isAdmin={task.isAdmin}
                  trigger={
                    <div className="bg-gray-400 px-4 py-2 rounded-md text-white">
                      Edit
                    </div>
                  }
                />
                {task.isAdmin && (
                  <Button
                    variant="destructive"
                    onClick={() => handleTaskDelete(task._id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="h-[calc(100vh-68px)] overflow-y-auto p-6">
          <h2 className="mb-4 text-xl font-semibold">Project Members</h2>
          {project.data?.members.length === 0 && (
            <p>No members in this project.</p>
          )}
          {project.data?.members.length > 0 && project.data?.isAdmin && (
            <AddMemberDialog
              trigger={
                <div className="w-full bg-black text-white rounded-md px-6 py-2 text-center">
                  Add Member
                </div>
              }
              projectId={projectId}
            />
          )}
          {project.data?.members.map((member: ProjectMember) => (
            <div
              key={member._id}
              className="mb-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{member.fullname}</p>
                <p className="font-medium">{member.email}</p>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${project.data.createdBy._id === member._id ? 'bg-green-500' : 'bg-gray-500'}`}
                >
                  {project.data.createdBy._id === member._id
                    ? 'Admin'
                    : 'Member'}
                </span>
              </div>
              {currentUser?._id === project.data.createdBy._id && (
                <Button
                  variant={'destructive'}
                  onClick={() => handleMemberRemove(member._id)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
