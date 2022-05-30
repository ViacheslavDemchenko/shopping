import './App.css';

import { useState, useEffect } from 'react';
import products from './goods.json'; // Загружаем список товаров

import { Form } from './components/Form/Form';
import { Table } from './components/Table/Table';
import { ChartBlock } from './components/ChartBlock/ChartBlock';

function App() {
  const [goods, setGoods] = useState([]); // Хук для списка товаров
  const [good, setGood] = useState(''); // Хук для названия товара
  const [categories, setCategories] = useState(new Set()); // Хук для списка использованных категорий
  const [category, setCategory] = useState(''); // Хук для новой категории
  const [price, setPrice] = useState(''); // Хук для цены
  const [goodsByDate, setGoodsByDate] = useState([]); // Хук для отлфильтрованных товаров по дате
  const [periodStart, setPeriodStart] = useState(''); // Хук для начала периода
  const [periodEnd, setPeriodEnd] = useState(''); // Хук для конца периода
  const [period, setPeriod] = useState([]); // Хук для массива дат периода
  const [categoriesList, setCategoriesList] = useState(new Set()); // Хук для всех категорий
  const [categoriesArr, setCategoriesArr] = useState([]); // Хук для массива всех категорий
  const [productsList, setProductsList] = useState(new Set()); // Хук для всех товаров
  const [productsArr, setProductsArr] = useState([]); // Хук для массива всех товаров
  const [currentCategory, setCurrentCategory] = useState(''); // Хук для выбранной категории
  const [currentName, setCurrentName] = useState(''); // Хук для выбранного товара
  const [chartDescription, setChartDescription] = useState(''); // Хук для описания графика

  // Вносим полученный список товаров из файла goods.json в массив товаров при создании компонента
  useEffect(() => { 
    setGoods(products);
  }, []);

  // Фильтруем товары по дате при изменении массива товаров и даты
  useEffect(() => { 
    let result = goods.filter(good => good.date === periodStart && good.date === periodEnd); // Отбираем товары по текущей дате
    setGoodsByDate(result); // Задаем в массив отфильтрованный по текущей дате список товаров
    setChartDescription('Все покупки за указанный период'); // Задаем начальное описание графика
  }, [goods, periodStart, periodEnd]);

  // Запускаем функцию составления списка всех категорий и названий товаров
  useEffect(() => { 
    makeCategoriesArr(goods);
  }, [goodsByDate, categories]);

  // Запускаем функцию фильтра товаров за указанный период с учетом категории и названия товара
  useEffect(() => { 
    makeDateCategoryGoodArr();
  }, [period]);

  // Функция добавления нового товара
  const addGood = (good, category, price, data, date) => {

    let newGood = { // Добавляем новый товар
      id: data, // Задаем id товара (время в миллисекундах на момент ее создания)
      name: good, // Задаем название товара
      category: category, // Задаем категорию товара
      price: price, // Задаем цену товара
      date: date // Задаем дату товара
    }

    setGoodsByDate([...goodsByDate, newGood]); // Вносим новый товар в массив товаров

    // Добавляемновую категорию в Set категорий, чтобы избежать дублей
    setCategories(prevState => new Set(prevState).add(category));
  }

  // Функция выбора категории из ранее использованных
  const chooseCategory = category => {
    // Если категория выбрана не дефолтная, то вносим ее в инпут для категории
    if (category !== 'Выберите категорию из ранее использованных') {
      setCategory(category);
    } else {
    // Если категория выбрана дефолтная, то инпут для категорий очищаем
      setCategory('');
    }
  }

  // Получаем общую сумму товаров в таблице (Итого)
  const getTotalSum = goodsByDate => {
    let totalSum = 0;
    
    goodsByDate.map(item => {
      return totalSum += +item.price;
    });

    return totalSum;
  }

  // Функция удаления товара из таблицы
  const deleteGood = id => {
    setGoodsByDate([...goodsByDate.filter(item => item.id !== id)]);
  }

  // Функция очистки таблицы
  const cleanTable = () => {
    setGoods([]);
  }

  // Функция получает начало и конец периода
  const getPeriod = (periodStart, periodEnd) => {
    // setDate('');
    periodStart = Date.parse(periodStart); // Дата начала периода в миллисекундах
    periodEnd = Date.parse(periodEnd); // Дата конца периода в миллисекундах

    let oneDay = 1000 * 60 * 60 * 24; // Получаем скольким миллисекундам равен один день
    let dates = []; // Массив для дат периода

    // Перебираем все даты и вносим их в массив
    for (let i = periodStart; i <= periodEnd; i += oneDay) {
      dates.push(new Date(i).toISOString().split('T')[0]);
    }

    // Задаем стейт массива дат
    setPeriod(dates);
  }

  // Составляем массив по выбранному периоду, категории и названию товара
  const makeDateCategoryGoodArr = () => {
    // Задаем пустые массивы
    let arr1 = []; // Для товаров по дате или периоду
    let arr2 = []; // Для товаров по категории
    let arr3 = []; // Для товаров по названию продукта


    // Если задан период (или дата)
    if (period) {
    // Перебираем стейт массива дат
      period.forEach(num => {
      // Отбираем в массив товары по дате
        goods.forEach(el => {
          // Если параметры совпадают, то вносим товар в массив
          if (el.date === num) {
            arr1.push(el);
          }
        });
      });
    }

    // Если выбрана категория
    if (currentCategory) {
      arr1.forEach(el => {
        // Если параметры совпадают, то вносим товар в массив
        if (el.category === currentCategory) {
          arr2.push(el);
        }
      });
    }

    // Если выбрано название товара
    if (currentName) {
      arr2.forEach(el => {
        // Если параметры совпадают, то вносим товар в массив
        if (el.name === currentName) {
          arr3.push(el);
        }
      });
    } 

    // Если первый массив не пустой (выбраны товары по дате или периоду), то задаем его в текущий стейт
    if (arr1.length > 0) {
      setGoodsByDate(arr1);
      setChartDescription('Все покупки за указанный период');
    }

    // Если второй массив не пустой (выбрана категория), то задаем его в текущий стейт
    if (arr2.length > 0) {
      setGoodsByDate(arr2);
      setChartDescription(`Все покупки по категории \"${firstLetterUppercase(currentCategory)}\" за указанный период`);
    }

    // Если третий массив не пустой (выбрано название товара), то задаем его в текущий стейт
    if (arr3.length > 0) {
      setGoodsByDate(arr3);
      setChartDescription(`Все покупки по товару \"${firstLetterUppercase(currentName)}\" за указанный период`);
    }
  }

  // Функция возвращает строку с первой заглавной буквой 
  // (для названия категории и товара на описании графика)
  const firstLetterUppercase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Составляем список всех категорий и названий товаров
  const makeCategoriesArr = (arr) => {
    // Помещаем их в Set во избежания дублей
    arr.forEach((el => {
      setCategoriesList(prevState => new Set(prevState).add(el.category));
      setProductsList(prevState => new Set(prevState).add(el.name));
    }));

    // Делаем из Set массивы в алфавитном порядке и задаем их в стейты
    let catArr = [...categoriesList].sort();
    let prodArr = [...productsList].sort();

    setCategoriesArr(catArr);
    setProductsArr(prodArr);
  }

  return (
    <div className="App">
      <h1>Приложение учета покупок</h1>
      <Form 
        setGood={setGood}
        good={good} 
        addGood={addGood}
        setCategory={setCategory}
        category={category}
        setPrice={setPrice}
        price={price}
        chooseCategory={chooseCategory}
        categoriesArr={categoriesArr}
      />
      <Table 
        goodsByDate={goodsByDate}
        getTotalSum={getTotalSum}
        deleteGood={deleteGood}
        cleanTable={cleanTable}
        periodStart={periodStart}
        setPeriodStart={setPeriodStart}
        periodEnd={periodEnd}
        setPeriodEnd={setPeriodEnd}
        getPeriod={getPeriod}
        categoriesArr={categoriesArr}
        productsArr={productsArr}
        setCurrentCategory={setCurrentCategory}
        setCurrentName={setCurrentName}
      />
      <ChartBlock 
        goodsByDate={goodsByDate}
        periodStart={periodStart}
        periodEnd={periodEnd}
        chartDescription={chartDescription}
      />
    </div>
  );
}

export default App;
