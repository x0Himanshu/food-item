import { useEffect, useRef, useState } from 'react'
import * as API from "./api";
import RecipeCard from './components/RecipeCard';
import './App.css'
import RecipePopUp from './components/RecipePopUp';
import { AiOutlineSearch } from 'react-icons/ai';

function App() {
  
  const [searchItem, setSearch] = useState(""); //re renders the page
  const [recipe, setRecipe] = useState([]);
  const pageNum = useRef(1);  //stop re-rendring
  const [selectRec, setSelectedRes]=useState(undefined);
  const [selectedTab, setSelectedTab] = useState("search");
  const [favRecipe, setfavRecipe] = useState([]);

  useEffect(()=>{

    async function fetchFav()
    {
      console.log("Use effect called");
      try{
        const fav = await API.getFavorit();
        setfavRecipe(fav);
      }
      catch(err)
      {
        console.log("Error: "+err)
      }
    }
    fetchFav();

  },[]);

  async function addToFavorite(recipe)
  {

    try{
      await API.addFav(recipe);
      setfavRecipe([...favRecipe,recipe]);

    }
    catch(err)
    {
      console.error("Error adding to fav: "+err);
    }

  }

  async function handleSubmit(event)
  {
    event.preventDefault();
    const recp = await API.searchRes(searchItem, 1);
    setRecipe(recp.results);
    setSearch("");
    pageNum.current=1;
    
  }
  async function handleViewNore()
  {
    const nextPage = pageNum.current + 1;
    try
    {
      const recp = await API.searchRes(searchItem, nextPage);
      
      setRecipe([...recipe, ...recp.results]);
      console.log(recipe);
      pageNum.current = nextPage;
    }
    catch(err)
    {
      console.error('Error occured: '+err);
    }
  }

  async function removeFavorite(rcp)
  {  
    try{
      await API.delFav(rcp);
      const updateFav = favRecipe.filter((frec)=>{return frec.id != rcp.id});
      setfavRecipe(updateFav);
    }
    catch(err)
    {
      console.error("Error while delete: "+err)
    }
  }
  
// When we add to favorites, the page re-rendres, as this 'favoriteRes
// is a ueSateHook
  return (
  <div className='app-container'>
    <div className='header'>
      <img src="/background.jpg"></img>
      <div className='title'>Find your recipe</div>
    </div>
    <div className="tabs">
      <h1 className={(selectedTab=="search")?"tab-active":""}
      onClick={()=>{setSelectedTab("search")}}>Find Recipe</h1>
      <h1 className={(selectedTab=="favorites")?"tab-active":""}
      onClick={()=>{setSelectedTab("favorites")}}>Favorites</h1>
    </div>

    {selectedTab==="search" && 
    <>
      <form onSubmit={(event)=>{handleSubmit(event)}} >
        <input type="text" value={searchItem} required placeholder='food item' 
            onChange={(event)=>{setSearch(event.target.value)}}></input>
        <button type='submit'><AiOutlineSearch size={40} /></button>
      </form>
      <div className='recipe-grid'>
        {recipe.map((rcp)=>{ 
          const isFavorite=favRecipe.some((favr)=>{return rcp.id===favr.id});
          
          return(
          <RecipeCard key={rcp.id} recipe={rcp} 
            onClick={()=>{setSelectedRes(rcp)}} 
            onFavClick={ (rcp)=>{(isFavorite)? removeFavorite(rcp):addToFavorite(rcp)}}
            isFavorite={isFavorite} />);
        })}
      
      <button className='view-more-button'
      onClick={()=>{handleViewNore()}}>
        View More
      </button>
      </div>
    </>
    }

  {selectedTab==='favorites'&&(
    <div className='recipe-grid'>
      {favRecipe.map((rcp)=>{ return(
      <RecipeCard key={rcp.id} recipe={rcp} onClick={()=>{setSelectedRes(rcp)}} 
        onFavClick={(rcp)=>removeFavorite(rcp)}
        isFavorite={true} />);
    })}
    </div>
  )
  
  }
  
  {((selectRec) ? <RecipePopUp id={selectRec.id} onClose={()=>{setSelectedRes(undefined)}}/>: null)}
  </div>);
}


export default App
