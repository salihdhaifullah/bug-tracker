import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import useFetchApi from '../../../utils/hooks/useFetchApi';
import CircleProgress from '../../../components/utils/CircleProgress';

interface IData {
    developers: number;
    testers: number;
    projectMangers: number;
}

const RolesPieChart = () => {
    const { projectId } = useParams();

    const [isNoMembers, setIsNoMembers] = useState(false);

    const [rolesPayload, callRoles] = useFetchApi<IData>("GET", `member/chart/${projectId}`);

    useEffect(() => { callRoles() }, [])

    ChartJS.register(ArcElement, Tooltip, Legend);

    const config = {
        labels: ['developers', 'testers', 'project mangers'],
        datasets: [
            {
                label: 'of members',
                data: [0, 0, 0],
                backgroundColor: [
                    '#d946ef',
                    '#eab308',
                    '#3b82f6'
                ],
                borderColor: [
                    '#701a75',
                    '#713f12',
                    '#1e3a8a'
                ],
                borderWidth: 2,
            },
        ],
    }

    const getData = (result: { developers: number, testers: number, projectMangers: number }) => {
        if (result.developers + result.testers + result.projectMangers === 0) {
            setIsNoMembers(true)
        };
        config.datasets[0].data = [result.developers, result.testers, result.projectMangers]
        return config;
    }

    return (
        isNoMembers ? null :
            <div className="flex justify-center items-center text-center my-4 w-[400px] h-fit rounded-md p-4 shadow-lg bg-white dark:bg-black">
                {rolesPayload.result && !rolesPayload.isLoading
                    ? <Pie data={getData(rolesPayload.result)} />
                    : <CircleProgress size="lg" />
                }
            </div>
    )
}

export default RolesPieChart;
