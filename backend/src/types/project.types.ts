import * as zod from "zod";

export const CreateProjectSchema = zod.object({
  name: zod.string().min(1, "Project name is required"),
  description: zod.string().optional(),
});
