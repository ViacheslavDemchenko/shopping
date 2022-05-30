const Good = ({id, name, category, price, deleteGood}) => {
    return(
        <tr>
            <td>{name}</td>
            <td>{category}</td>
            <td>{price}</td>
            <td className="delete" onClick={() => deleteGood(id)}>X</td>
        </tr>
    );
}

export { Good };