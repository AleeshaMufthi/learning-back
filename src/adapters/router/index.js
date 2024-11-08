import express from "express";
import authRoute from './authRoute.js'

import userDetailsRoute from './user/profileRoute.js'
import userCourseRoute from './user/courseRoute.js'
import userLessonRoute from './user/lessonRoute.js'
import userOrdersRoute from './user/orderRoute.js'
import userWalletRoute from './user/walletRoute.js'

import tutorDetailsRoute from './tutor/profileRoute.js'
import tutorCourseRoute from './tutor/courseRoute.js'
import tutorLessonRoute from './tutor/lessonRoute.js'

import adminUserRoute from './admin/usersRoute.js'
import adminTutorRoute from './admin/TutorsRoute.js'
import adminCategoryRoute from './admin/categoryRoute.js'

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
        path: "/user/courses",
        route: userCourseRoute,
    },
    {
        path: "/user/lessons",
        route: userLessonRoute,
    },
    {
        path: "/user/orders",
        route: userOrdersRoute,
    },
    {
        path: "/user/wallet",
        route: userWalletRoute,
    },
    {
        path: '/tutor/details',
        route: tutorDetailsRoute
    },
    {
        path: "/tutor/courses",
        route: tutorCourseRoute,
    },
    {
        path: "/tutor/lessons",
        route: tutorLessonRoute,
    },
    {
        path: '/admin/users',
        route: adminUserRoute
    },
    {
        path: '/admin/tutors',
        route: adminTutorRoute
    },
    {
        path: "/admin/category",
        route: adminCategoryRoute,
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router