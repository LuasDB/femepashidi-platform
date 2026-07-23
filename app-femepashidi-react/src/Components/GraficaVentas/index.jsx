import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const GraficaVentas = ({ sales }) => {
    const { labels, data,category } = sales;

    const chartData = {
        labels,
        datasets: [
            {
                label: `Productos Vendidos ${category}`,
                data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)', 
                borderColor: 'rgba(54, 162, 235, 1)', 
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ventas por Mes',
            },
            datalabels: {
                color: '#000',
                anchor: 'end',
                align: 'top',
                formatter: (value) => value,
                font: {
                    weight: 'bold',
                },
                offset: 4,
            },
        },
    };
    return <Bar data={chartData} options={options} />;
};

export default GraficaVentas;
