import type { Router } from "express";
import express from "express";

import authRoutes from "./auth.routes";
import projectRoutes from "./project.routes";
import taskRoutes from "./task.routes";

const router: Router = express.Router();

type Route = {
    path: string;
    route: Router;
}

const routes: Route[] = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/project",
        route: projectRoutes,
    },
    {
        path: "/task",
        route: taskRoutes,
    },
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
