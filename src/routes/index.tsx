import { createBrowserRouter } from 'react-router-dom'
import Main from '@/main/index/index';
import ErrorPage from '@/components/ErrorPage';
import FormAction from '@/main/form-action';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        errorElement: <ErrorPage />,
        loader: async () => {
            const data = await new Promise(r => r({ title: 'charts' }));
            return data;
        },
        action: async () => {
            const data = await new Promise(r => r({ title: 'charts' }));
            return data;
        },
        children: [
            {
                path: '/formAction',
                element: <FormAction />,
            }
        ]
    }
]);

export default router;