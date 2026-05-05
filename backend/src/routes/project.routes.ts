import { Router } from "express";
import { addUserToProject, createProject, deleteProject, getAllProjects, getProjectById, removeUserFromProject } from "../controllers/project.controller";
import { isAuth } from "../middlewares/is-auth";

const router: Router = Router();

router.post("/create", isAuth, createProject);

router.patch("/add/:projectId/:userId", isAuth, addUserToProject);

router.patch("/remove/:projectId/:userId", isAuth, removeUserFromProject);

router.get("/get/:projectId", isAuth, getProjectById);

router.get("/get-all", isAuth, getAllProjects);

router.delete("/delete/:projectId", isAuth, deleteProject);

export default router;
