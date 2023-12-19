import { ArcElement, Legend, Tooltip, Chart as ChartJS, } from "chart.js";
import { IPriorityChart } from ".";
import { Pie } from "react-chartjs-2";

const PriorityChart = (props: IPriorityChart) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ["Low", "Medium", "High", "Critical"],
        datasets: [
            {
                label: 'of Tickets',
                data: [props.low, props.medium, props.high, props.critical],
                backgroundColor: [
                    "#22c55e",
                    "#eab308",
                    "#f97316",
                    "#ef4444"
                ],
                borderColor: [
                    "#15803d",
                    "#a16207",
                    "#c2410c",
                    "#b91c1c"
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


export default PriorityChart;
