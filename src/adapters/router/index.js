import express from "express";
import authRoute from './authRoute.js'

import userDetailsRoute from './user/profileRoute.js'
import userCourseRoute from './user/courseRoute.js'
import userLessonRoute from './user/lessonRoute.js'
import userOrdersRoute from './user/orderRoute.js'
import userWalletRoute from './user/walletRoute.js'
import userChatRoute from './user/chatRoute.js'
import userNotificationRoute from './user/notificationRoute.js'
import userRevenueRoute from './user/revenueRoute.js'

import tutorDetailsRoute from './tutor/profileRoute.js'
import tutorCourseRoute from './tutor/courseRoute.js'
import tutorLessonRoute from './tutor/lessonRoute.js'
import tutorChatRoute from './tutor/chatRoute.js'
import tutorRevenueRoute from './tutor/revenueRoute.js'

import adminUserRoute from './admin/usersRoute.js'
import adminTutorRoute from './admin/TutorsRoute.js'
import adminCategoryRoute from './admin/categoryRoute.js'
import adminRevenueRoute from './admin/revenueRoute.js'
import { path } from "@ffmpeg-installer/ffmpeg";

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
        path: "/user/chat",
        route: userChatRoute,
    },
    {
        path: "/user/notification",
        route: userNotificationRoute,
    },
    {
       path: '/user/revenue',
       route: userRevenueRoute,
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
        path: "/tutor/chat",
        route: tutorChatRoute,
    },
    {
        path: "/tutor/revenue",
        route: tutorRevenueRoute,
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
    {
        path: "/admin/revenue",
        route: adminRevenueRoute,
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router