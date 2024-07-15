import react from "react";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
export default function RecipeCard(props)
{
    return(<div className="recipe-card" onClick={props.onClick}>
        <img src={props.recipe.image} alt="" />
        <div className="recipe-card-title">
            <span onClick={(event)=>{
                event.stopPropagation(); //stoping click action on div
                props.onFavClick(props.recipe)}}>
                {props.isFavorite ? <AiFillHeart size={25} color="red" /> :<AiOutlineHeart size={25} /> }
                
            </span>
            <h3>{props.recipe.title}</h3>
        </div>
    </div>);
}