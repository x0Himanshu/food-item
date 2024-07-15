import axios from "axios";
export async function searchRes(searchItem, page)
{
    const base_url = "http://localhost:5000/api/recipes/search";
    const queryp={"searchItem": searchItem, "page": page};
    try
    {
        const response = await axios.get(base_url,{params: queryp});
        //const response = await axios.get(new URL("http://localhost:5000/api/recipes/search?searchItem=burger&page=1"));
        //console.log(response.data);
        return response.data;
    } catch(err)
    {
        console.error("Error oopssss: "+err);
        return null;
    }
}

export async function getRecipeSummary(id)
{
    const url = `http://localhost:5000/api/recipes/${id}/summary`;
    const response = await axios.get(url);
    return response.data;
}

export async function getFavorit()
{
    const url = "http://localhost:5000/api/recipes/favorites";
    const response = await axios.get(url);
    return response.data;
}

export async function addFav(recipe)
{
    const url = "http://localhost:5000/api/recipes/favorites"
    const body={
        recipeid: recipe.id
    };
    try{
        await axios.post(url,body);
    }
    catch(err)
    {
        console.erorr("Post error"+ err);
    }
}

/*export async function delFav(recipe)
{

    const url = "http://localhost:5000/api/recipes/favorites"
    const body={
        recipeid: recipe.id
    };
    
    try{
        console.log("Calling delte api");
        await axios.delete(url,{data: body});
        console.log("Exiting api call");
    }
    catch(err)
    {
        console.error("Delete error"+ err);
    }
}*/
export async function delFav(recipe) {
    const url = "http://localhost:5000/api/recipes/favorites";
    const body = {
        recipeid: recipe.id
    };

    try {

        const response = await axios.delete(url, { data: body });
    } catch (error) {
        console.error("Error in API call", error);
    }
}