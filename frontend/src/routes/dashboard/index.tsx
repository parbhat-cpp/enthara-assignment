import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useForm } from '@tanstack/react-form'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

type MemberSearchResult = {
  _id: string
  email: string
  fullname: string
}

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  query: z.string().min(0).optional(),
})

function RouteComponent() {
  const [memberSearchResults, setMemberSearchResults] = useState<
    MemberSearchResult[]
  >([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedMembersEmail, setSelectedMembersEmail] = useState<
    { email: string; id: string }[]
  >([])
  const [memberQuery, setMemberQuery] = useState('')

  const navigator = useNavigate()

  const projectList = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  })

  const createProjectForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      query: '',
    },
    validators: {
      onSubmit: createProjectSchema,
      onChange: createProjectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          name: value.name,
          description: value.description,
          members: selectedMembers,
        }
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/project/create`,
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
          toast.error(errorData.message || 'Failed to create project')
          throw new Error(errorData.message || 'Failed to create project')
        }

        toast.success('Project created successfully!')
        projectList.refetch()
      } catch (error) {
        toast.error('Failed to create project')
      }
    },
  })

  async function getAllProjects() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/get-all`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      )
      const projects = await response.json()
      return projects.data
    } catch (error) {
      toast.error('Failed to fetch projects')
    }
  }

  useEffect(() => {
    if (memberQuery) {
      const fetchMembers = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/user?email=${memberQuery}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            },
          )
          const data = await response.json()
          setMemberSearchResults(data.data)
        } catch (error) {
          toast.error('Failed to search members')
        }
      }
      fetchMembers()
    } else {
      setMemberSearchResults([])
    }
  }, [memberQuery])

  return (
    <main>
      <header className="px-6 py-4 bg-black text-white flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Dialog>
          <DialogTrigger>Create Project</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Project</DialogTitle>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  createProjectForm.handleSubmit()
                }}
              >
                <FieldGroup>
                  <createProjectForm.Field
                    name="name"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Project Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Coolest project ever"
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  />
                  <createProjectForm.Field
                    name="description"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Project Description
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="This project will change the world..."
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  />
                  <div className="relative">
                    <div className="absolute top-17 left-0 w-full">
                      {memberSearchResults.length > 0 && (
                        <div className="bg-white border rounded shadow p-2 w-64">
                          {memberSearchResults.map((user) => (
                            <div
                              key={user._id}
                              className="p-1 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                if (
                                  !selectedMembers.find((m) => m === user._id)
                                ) {
                                  setSelectedMembers([
                                    ...selectedMembers,
                                    user._id,
                                  ])
                                  setSelectedMembersEmail([
                                    ...selectedMembersEmail,
                                    { email: user.email, id: user._id },
                                  ])
                                  setMemberQuery('')
                                  createProjectForm.setFieldValue('query', '')
                                  setMemberSearchResults([])
                                }
                              }}
                            >
                              {user.email} ({user.fullname})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <createProjectForm.Field
                      name="query"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Member Email (optional)
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => {
                                field.handleChange(e.target.value)
                                setMemberQuery(e.target.value)
                              }}
                              aria-invalid={isInvalid}
                              placeholder="member@example.com"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <div>
                      {selectedMembersEmail.map((memberEmail) => (
                        <div
                          key={memberEmail.id}
                          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2 mt-2"
                        >
                          {memberEmail.email}
                          <button
                            type="button"
                            className="ml-2 text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              setSelectedMembers(
                                selectedMembers.filter(
                                  (id) => id !== memberEmail.id,
                                ),
                              )
                              setSelectedMembersEmail(
                                selectedMembersEmail.filter(
                                  (m) => m.id !== memberEmail.id,
                                ),
                              )
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FieldGroup>
                <Button type="submit">Submit</Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </header>
      <div>
        {projectList.data?.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {projectList.data.map((project: any) => (
              <div
                key={project._id}
                className="p-4 m-4 border rounded shadow cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  navigator({
                    to: `/dashboard/project/${project._id}`,
                  })
                }}
              >
                <h3 className="text-lg font-bold">{project.name}</h3>
                <p className="text-gray-600">{project.description}</p>
                <p>{project.members.length} members</p>
                <span
                  className={clsx(
                    project.isAdmin
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                    'px-2 py-1 rounded-full',
                  )}
                >
                  {project.isAdmin ? 'Admin' : 'Member'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-10 text-gray-500">
            No projects found. Create your first project!
          </p>
        )}
      </div>
    </main>
  )
}
