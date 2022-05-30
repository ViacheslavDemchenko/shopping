import './Table.css';

import { Good } from './../Good/Good';

import { useEffect } from 'react';

const Table = (
    {
        getTotalSum, 
        deleteGood, 
        cleanTable, 
        goodsByDate, 
        periodStart, 
        setPeriodStart, 
        periodEnd, 
        setPeriodEnd,
        getPeriod,
        categoriesArr,
        productsArr,
        setCurrentCategory,
        setCurrentName
    }) => {

    // Получаем и передаем в App.js текущую дату
    useEffect(() => { 
        let initailDate = new Date().toISOString().split('T')[0];
        setPeriodStart(initailDate);
        setPeriodEnd(initailDate);
    }, [setPeriodStart, setPeriodEnd]);

    // Получаем значение инпута начала периода
    const handlePeriodStart = e => {
        setPeriodStart(e.target.value);
    }

    // Получаем значение инпута конца периода
    const handlePeriodEnd = e => {
        setPeriodEnd(e.target.value);
    }

    // Получаем значение инпута выбранной категории
    const handleCategoryChoose = e => {
        setCurrentCategory(e.target.value);
    }

    // Получаем значение инпута выбранного названия товара
    const handleGoodChoose = e => {
        setCurrentName(e.target.value);
    }
    
    return(
        <>
            <h2 className="table-title">Таблица покупок</h2>
            <div className="table-handler">
                <div className="table-period">
                    <p className="table-period-title">Выберите параметры просмотра покупок</p>
                    <div className="inputs-wrap">
                        <input 
                            type="date" 
                            value={periodStart}
                            onChange={handlePeriodStart}
                        />
                        <input 
                            type="date"
                            value={periodEnd}
                            onChange={handlePeriodEnd}
                        />
                        <select className="form__block" onChange={e => handleCategoryChoose(e)}>
                            <option>Все категории</option>
                            {
                                categoriesArr.length ? categoriesArr.map( (item, i) => {
                                    return <option key={i} value={item}>{item}</option>
                                }) : null
                            }
                        </select >
                        <select className="form__block" onChange={e => handleGoodChoose(e)}>
                        <option>Все товары</option>
                            {
                                productsArr.length ? productsArr.map( (item, i) => {
                                    return <option key={i} value={item}>{item}</option>
                                }) : null
                            }
                        </select >
                        <button onClick={() => getPeriod(periodStart, periodEnd)}>Показать</button>
                    </div>
                </div>
                <div className="table-period">
                    <button onClick={() => cleanTable()}>Очистить таблицу</button>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Название товара</th>
                        <th>Категория товара</th>
                        <th>Цена товара (руб.)</th>
                        <th></th>
                    </tr>
                    {
                        goodsByDate.length ? goodsByDate.map(item => {
                            return <Good 
                                key={item.id} 
                                {...item} 
                                deleteGood={deleteGood}
                                />
                        }) : null
                    }
                </thead>
            </table>
            <div className="table-total">Итого: &nbsp;
                <span>{getTotalSum(goodsByDate)} рублей</span>
            </div>
        </>
    );
}

export { Table };