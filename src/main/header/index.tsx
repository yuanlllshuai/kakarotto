import { Link } from "react-router-dom";
import Avatar from '@/components/Avatar';

const Index = () => {
    return (
        <>
            <Avatar />
            <Link to='charts'>charts</Link>
        </>
    )
}

export default Index;