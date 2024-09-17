import express from "express";
import authRoute from './authRoute.js'
import userDetailsRoute from './user/profileRoute.js'
import tutorDetailsRoute from './tutor/profileRoute.js'
import adminUserRoute from './admin/usersRoute.js'
import adminTutorRoute from './admin/TutorsRoute.js'

const router = express.Router()

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/user/details',
        route: userDetailsRoute
    },
    {
        path: '/tutor/details',
        route: tutorDetailsRoute
    },
    {
        path: '/admin/users',
        route: adminUserRoute
    },
    {
        path: '/admin/tutors',
        route: adminTutorRoute
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router