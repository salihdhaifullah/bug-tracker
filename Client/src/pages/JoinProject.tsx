import { useNavigate, useParams } from 'react-router-dom'
import useFetchApi from '../utils/hooks/useFetchApi';
import CircleProgress from '../components/utils/CircleProgress';
import { useEffect } from 'react';

const JoinProject = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionId) navigate("/");
    }, []);

    const [_, call] = useFetchApi("GET", `member/${sessionId}`);

    useEffect(() => { call() }, [])

    return (
        <div className='flex flex-col justify-center items-center h-full min-h-[80vh] w-full'>
            <CircleProgress size='lg' />
        </div>
    )
}

export default JoinProject
