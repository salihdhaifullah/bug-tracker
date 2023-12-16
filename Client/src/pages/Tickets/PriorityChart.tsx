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
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
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


export default PriorityChart;
