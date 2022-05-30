import './Form.css';

const Form = (
    {
        setGood, 
        good, 
        addGood, 
        setCategory, 
        category, 
        setPrice, 
        price, 
        categoriesArr, 
        chooseCategory
    }) => {

    const data = new Date().getTime(); // Получаем миллисекунды в момент создания новой записи (для key и id)

    // Получаем значение инпута названия товара
    const handleGoodChange = e => { 
        setGood(e.target.value.toLowerCase()); 
    }

    // Получаем значение инпута категории товара
    const handleCategoryChange = e => {
        setCategory(e.target.value.toLowerCase()); 
    }

    // Получаем значение инпута цены товара
    const handlePriceChange = e => {
        setPrice(e.target.value); 
    }

    // Получаем категорию из списка ранее созданных
    const handleCategoryChoose = e => {
        chooseCategory(e.target.value);
    }

    // Функция передачи данных из формы в App.js
    const handleSubmit = (e, data) => {
        e.preventDefault();
        let date = new Date().toISOString().split('T')[0];
        let reg = /^[0-9]+$/;
        
        // Проверяем, чтобы все поля формы были заполнены
        if (good !== '' && category !== '' && price !== '' && date !== '') {
            if (reg.test(price)) {// Проверяем, чтобы цена была числом
                addGood(good, category, price, data, date); // Передаем все параметры нового товара
                // Очищаем все инпуты после сохранения нового товара
                setGood(''); 
                setCategory('');
                setPrice('');
            } else {
                alert('Цена товара может быть только числом');
            }
        } else {
            alert('Все поля формы должны быть заполнены');
        }
    }

    return(
        <form className="form">
            <label className="form__block"> Введите название товара
                <input 
                    type="text" 
                    value={good}
                    onChange={handleGoodChange}
                />
            </label>
            <label className="form__block"> Введите категорию товара
                <input 
                    type="text" 
                    value={category}
                    onChange={handleCategoryChange}
                />
            </label>
            <div className="form__block">
                <p>Или выберите из ранее использованных</p>
                <select className="form__block form__block--select" onChange={e => handleCategoryChoose(e)}>
                    <option>Выберите категорию из ранее использованных</option>
                    {
                        categoriesArr.length ? categoriesArr.map( (item, i) => {
                            return <option key={i} value={item}>{item}</option>
                        }) : null
                    }
                </select >
            </div>
            <label className="form__block"> Введите цену товара
                <input 
                    type="text" 
                    value={price}
                    onChange={handlePriceChange}
                />
            </label>
            <button className="form__submit" onClick={e => handleSubmit(e, data)}>Сохранить</button>
        </form>
    );
}

export { Form };