import { ArcElement, Legend, Tooltip, Chart as ChartJS, } from "chart.js";
import { ITypeChart } from ".";
import { Pie } from "react-chartjs-2";

const TypeChart = (props: ITypeChart) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ['Bug', 'Feature'],
        datasets: [
            {
                label: 'of Tickets',
                data: [props.bugs, props.features],
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

export default TypeChart;
