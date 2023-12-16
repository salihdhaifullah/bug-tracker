import { ArcElement, Legend, Tooltip, Chart as ChartJS, } from "chart.js";
import { IStatusChart } from ".";
import { Pie } from "react-chartjs-2";

const StatusChart = (props: IStatusChart) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ["Review", "Active", "Progress", "Resolved", "Closed"],
        datasets: [
            {
                label: 'of Tickets',
                data: [props.review, props.active, props.progress, props.resolved, props.closed],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };


    return (
        <div className="flex justify-center items-center w-[400px] h-fit rounded-md p-4 shadow-lg bg-white dark:bg-black">
            <Pie data={data} />
        </div>
    )
}


export default StatusChart;
