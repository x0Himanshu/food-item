import axios from "axios";
import env from "dotenv";
env.config();


const apikey = process.env.SP_API;

async function searchRec( searchItem, page)
{
    if(!apikey) throw new Error("API Erro");

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
    const query_param = {
        apiKey: apikey,
        query: searchItem,
        number:"10",
        offset: (page*10)
    };
    const response = await axios.get(url,{params: query_param});
    const data = await response.data;
    return data;
}

export async function recipe(id)
{
    const url = new URL(`https://api.spoonacular.com/recipes/${id}/summary`);
    const query_param = {
        apiKey: apikey
    };
    const response = await axios.get(url,{params: query_param});
    const data = await response.data;
    return data;
}
export async function favRecipe(id_arr)
{
    const url="https://api.spoonacular.com/recipes/informationBulk";
    const query_params={
        apiKey: apikey,
        ids: id_arr.join(",")
    }
    
    const response = await axios.get(url,{params: query_params});
    return response.data;
}
export {searchRec};