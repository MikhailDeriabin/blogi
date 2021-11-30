import * as postsSearch from "./modules/posts.js";

const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", async () => {

    //TODO: check user input value for special characters

    const searchWord = searchInput.value;

    //search by name
    const data = await postsSearch.searchPostsByName(searchWord);
    //search by author
    //const data = await postsSearch.searchPostsByAuthor(searchWord);
    console.log(data);

    //TODO: display search results below with right template (\n = new paragraph)

});