const Category = ({id, category}) => {
    return(
        <option key={id} value={category}>{category}</option>
    );
}

export { Category };