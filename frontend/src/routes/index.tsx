import { Button } from '#/components/ui/button'
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import * as z from 'zod'

export const Route = createFileRoute('/')({ component: App })

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

const signupSchema = z.object({
  fullname: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
})

function App() {
  const navigator = useNavigate();

  const loginForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(value),
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          toast.error(errorData.message || 'Login failed')
          throw new Error(errorData.message || 'Login failed')
        }

        const data = await response.json()

        localStorage.setItem('user', JSON.stringify(data.data))

        toast.success('Login successful!')

        navigator({
          to: '/dashboard',
        });
      } catch (error) {
        toast.error('Login Failed')
      }
    },
  })

  const signupForm = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signupSchema,
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(value),
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          toast.error(errorData.message || 'Signup failed')
          throw new Error(errorData.message || 'Signup failed')
        }

        const data = await response.json()

        localStorage.setItem('user', JSON.stringify(data.data))

        toast.success('Signup successful!')
        navigator({
          to: '/dashboard',
        });
      } catch (error) {
        toast.error('Signup Failed')
      }
    },
  })

  return (
    <main className="h-screen flex items-center justify-center">
      <div className="shadow-md rounded-md p-6">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                loginForm.handleSubmit()
              }}
            >
              <FieldGroup>
                <loginForm.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="john@example.com"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <loginForm.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="********"
                          autoComplete="off"
                          type="password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <Button type="submit">Login</Button>
              </FieldGroup>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                signupForm.handleSubmit()
              }}
            >
              <FieldGroup>
                <signupForm.Field
                  name="fullname"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="John Doe"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <signupForm.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="john@example.com"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <signupForm.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="********"
                          autoComplete="off"
                          type="password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <Button type="submit">Signup</Button>
              </FieldGroup>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
