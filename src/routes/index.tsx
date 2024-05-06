import { createBrowserRouter } from 'react-router-dom'
import Main from '@/main/index';
import ErrorPage from '@/components/ErrorPage';
import Index from '@/main/home';
import ThreeLearn from '@/main/threeLearn';
import Gltf from '@/main/three/glft';

// let res = { title: 'before' };

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        errorElement: <ErrorPage />,
        // loader: async () => {
        //     const data = await new Promise(r => {
        //         setTimeout(() => {
        //             const d = { ...res }
        //             r(d)
        //         }, 0);
        //     });
        //     return data;
        // },
        // action: async (props: any) => {
        //     // const { request, params } = props;
        //     // const formData = await request.formData();
        //     // const updates = Object.fromEntries(formData);
        //     // console.log(updates, params)
        //     res = { title: 'after' };
        //     return res;
        // },
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    { index: true, element: <Index /> },
                ]
            },
            {
                path: 'three',
                children: [
                    {
                        path: 'index',
                        element: <ThreeLearn />
                    },
                    {
                        path: 'gltf',
                        element: <Gltf />
                    }
                ]
            },
            {
                path: '*',
                errorElement: <ErrorPage />,
                element: <ErrorPage />
            }
        ]
    }
]);

export default router;