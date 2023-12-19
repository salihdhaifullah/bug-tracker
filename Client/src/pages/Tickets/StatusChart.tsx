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
                    "#6366f1",
                    "#3b82f6",
                    "#06b6d4",
                    "#10b981",
                    "#6b7280"
                ],
                borderColor: [
                    "#4338ca",
                    "#1d4ed8",
                    "#0e7490",
                    "#047857",
                    "#374151"
                ],
                borderWidth: 2,
            },
        ],
    };


    return (
        <div className="flex justify-center items-center rounded-md p-2 shadow-lg bg-white dark:bg-black">
            <Pie data={data} width={350} height={350} />
        </div>
    )
}


export default StatusChart;
