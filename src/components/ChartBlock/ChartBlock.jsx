import './ChartBlock.css';
import { Chart } from "react-google-charts";

const ChartBlock = (
    {
        goodsByDate, 
        date, 
        periodStart, 
        periodEnd,
        chartDescription
    }) => {

    // Фнукция первода формата даты или дат периода с гггг-мм-дд в дд-мм-ггг
    const dateFormat = (num) => {
        let currentDate = num.split('-');
        currentDate = currentDate.reverse();
        currentDate = currentDate.join('-');
        
        return currentDate;
    }

    // Функция проверки, что выбрано в данный момент, дата или период
    const checkDateOrPeriod = () => {
        if (date) {
            return dateFormat(date);
        } else {
            return`${dateFormat(periodStart)} — ${dateFormat(periodEnd)}`;
        }
    }

    // Функция формирования массива для графика
    const getDataArr = (arr) => {
        let chartArr = []; // Задаем пустой массив для покупок
        let productHead = ['Продукт', 'Сумма']; // Задаем заголовок (массив) для подписей на графике
        chartArr.push(productHead); // Добавляем массив с заголовком первым элементом в массив покупок

        // Перебираем полученный массив покупок по дате или периоду из App.js
        arr.forEach((el => {
            let tempArr = []; // Задаем пустой массив для каждой покупки
            tempArr[0] = el.name; // Задаем первым элементом каждого массива покупки название
            tempArr[1] = el.price; // Задаем вторым элементом каждого массива покупки цену
            chartArr.push(tempArr); // Вставляем каждый массив покупки в общий массив покупок
        }));

        return chartArr;
    }

    // Опции для указания информации над грфиком слева в углу
    let options = {
        chart: {
          title: `Расходы за ${checkDateOrPeriod()}`,
          subtitle: `${chartDescription}`,
        },
    };

    return(
        <>
            <h2 className="table-title">График покупок</h2>
            <Chart
                chartType="Bar"
                data={getDataArr(goodsByDate)}
                options={options}
                width="100%"
                height="600px"
                legendToggle
            />
        </>
    );
}

export { ChartBlock };