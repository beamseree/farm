import border from '../img/item.png';

const Item = (props) => {
    return (<div className="item">
        <img src={border} alt="item" className='item-border' />
        <div className="item-inner">
            <img src={props.img} alt="item" className='item-img' />
            <p className="item-text">{props.amount}</p>
        </div>
    </div>);
}

export default Item;