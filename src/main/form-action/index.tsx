import { useLoaderData } from "react-router-dom";

const Index = () => {
    const data: any = useLoaderData();
    return (
        <>
            {data}
            <form method="post">
                <button type="submit">New</button>
            </form>
        </>
    )
}

export default Index;