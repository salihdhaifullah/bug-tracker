import { useNavigate, useParams } from 'react-router-dom'
import useFetchApi from '../utils/hooks/useFetchApi';
import CircleProgress from '../components/utils/CircleProgress';
import { useEffect } from 'react';

const JoinProject = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    useEffect(() => { if (!sessionId) navigate("/"); }, []);

    const [_, call] = useFetchApi("GET", `member/${sessionId}`);

    useEffect(() => { call() }, [])

    return <CircleProgress size='lg' />
}

export default JoinProject;
