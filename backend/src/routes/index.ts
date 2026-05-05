import type { Router } from "express";
import express from "express";

import authRoutes from "./auth.routes";

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
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
