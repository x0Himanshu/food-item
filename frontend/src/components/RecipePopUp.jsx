import React, { useState, useEffect } from "react";
import * as api from "../api"

export default function RecipePopUp(props)
{
    const [recipeSum, setRecipeSum] = useState("");
    useEffect(()=>
    {
        async function fetchSummary()
        {
            const response = await api.getRecipeSummary(props.id);
            setRecipeSum(response);
        }

        fetchSummary();
    },[props.id]);
    if(!recipeSum) return<></>;

    //console.log(props.recipe);
    return(<div className="overlay">
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{recipeSum.title}</h2>
                    <span className="close-btn" onClick={ props.onClose}>&times;</span>
                </div>
                <p dangerouslySetInnerHTML={{__html: recipeSum.summary}} >
               
                </p>
            </div>
        </div>
    </div>

    )
}