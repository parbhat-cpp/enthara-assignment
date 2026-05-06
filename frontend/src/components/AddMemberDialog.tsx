import React from 'react'
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
import { Input } from './ui/input'
import { FieldError, FieldLabel, Field } from './ui/field'
import { Button } from './ui/button'
import { useQueryClient } from '@tanstack/react-query'

interface AddMemberDialogProps {
  trigger: React.ReactNode
  projectId: string
}

const searchUserSchema = zod.object({
  query: zod.email().min(1, 'Search query is required'),
})

const AddMemberDialog = (props: AddMemberDialogProps) => {
  const [searchResults, setSearchResults] = React.useState([])
  const queryClient = useQueryClient()

  const searchForm = useForm({
    defaultValues: {
      query: '',
    },
    validators: {
      onSubmit: searchUserSchema,
      onChange: searchUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/user?email=${value.query}`,
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
          throw new Error(errorData.message || 'Failed to search user')
        }

        const data = await response.json()
        setSearchResults(data.data)
      } catch (error) {
        toast.error('Failed to search user. Please try again.')
      }
    },
  })

  async function handleAddMember(userId: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/add/${props.projectId}/${userId}`,
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
        throw new Error(errorData.message || 'Failed to add member')
      }

      toast.success('Member added successfully')
      queryClient.invalidateQueries({
        queryKey: ['project', props.projectId],
      })
    } catch (error) {
      toast.error('Failed to add member. Please try again.')
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <form
          id="search-query"
          onSubmit={(e) => {
            e.preventDefault()
            searchForm.handleSubmit()
          }}
        >
          <searchForm.Field
            name="query"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="form-tanstack-input-query">
                    Email
                  </FieldLabel>
                  <Input
                    id="form-tanstack-input-query"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="john@example.com"
                    type="email"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </form>
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Search Results:</h3>
            <ul className="space-y-2">
              {searchResults.map((user: any) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p className="text-sm font-medium">{user.fullname}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    onClick={() => handleAddMember(user._id)}
                  >
                    Add Member
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddMemberDialog
