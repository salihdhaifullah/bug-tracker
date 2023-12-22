import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import useFetchApi from '../../utils/hooks/useFetchApi';
import CircleProgress from '../../components/utils/CircleProgress';

interface IData {
    developers: number;
    projectMangers: number;
}

const RolesPieChart = () => {
    const { projectId, userId } = useParams();

    const [isNoMembers, setIsNoMembers] = useState(false);

    const [rolesPayload, callRoles] = useFetchApi<IData>("GET", `users/${userId}/projects/${projectId}/members/chart/`);

    useEffect(() => { callRoles() }, [])

    ChartJS.register(ArcElement, Tooltip, Legend);

    const config = {
        labels: ['developers', 'project mangers'],
        datasets: [
            {
                label: 'of members',
                data: [0, 0],
                backgroundColor: [
                    "#3b82f6",
                    "#eab308"
                ],
                borderColor: [
                    "#1d4ed8",
                    "#a16207"
                ],
                borderWidth: 2,
            },
        ],
    }

    const getData = (result: { developers: number, projectMangers: number }) => {
        if (result.developers + result.projectMangers === 0) {
            setIsNoMembers(true)
        };
        config.datasets[0].data = [result.developers, result.projectMangers]
        return config;
    }

    return (
        isNoMembers ? null :
            <div className="flex justify-center items-center text-center my-4 min-h-[350px] min-w-[350px] rounded-md p-2 shadow-lg bg-white dark:bg-black">
                {rolesPayload.result && !rolesPayload.isLoading
                    ? <Pie data={getData(rolesPayload.result)} width={350} height={350} />
                    : <CircleProgress size="lg" />
                }
            </div>
    )
}

export default RolesPieChart;
