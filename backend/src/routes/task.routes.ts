import { Router } from "express";
import { isAuth } from "../middlewares/is-auth";
import { assignUserToTask, createTask, deleteTask, getAllTasksByProjectId, getTaskById, unassignUserFromTask, updateTask } from "../controllers/task.controller";

const router: Router = Router();

router.get("/all/:projectId", isAuth, getAllTasksByProjectId);

router.get("/:taskId", isAuth, getTaskById);

router.post("/create/:projectId", isAuth, createTask);

router.patch("/update/:projectId/:taskId", isAuth, updateTask);

router.patch("/assign/:projectId/:taskId/:userId", isAuth, assignUserToTask);

router.patch("/unassign/:projectId/:taskId/:userId", isAuth, unassignUserFromTask);

router.delete("/delete/:projectId/:taskId", isAuth, deleteTask);

export default router;
