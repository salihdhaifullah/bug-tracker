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
                    "#f43f5e",
                    "#84cc16"
                ],
                borderColor: [
                    "#be123c",
                    "#4d7c0f"
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

export default TypeChart;
