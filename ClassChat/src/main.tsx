import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import App from './views/App.tsx'
import NewClassroom from './views/NewClassroom.tsx'
import ErrorPage from "./views/ErrorPage.tsx";
import './App.css'
import Classroom from './views/Classroom.tsx';
import JoinClassroom from './views/JoinClassroom.tsx';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />
    },
    {
        path: '/new',
        element: <NewClassroom />
    },
    {
        path: 'room/:roomId',
        element: <Classroom />
    },
    {
        path: 'join',
        element: <JoinClassroom />
    }
]);

createRoot(document.getElementById('root')!).render(
    <>
    <RouterProvider router={router}/>
    <style>@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');</style>
    </>
)
