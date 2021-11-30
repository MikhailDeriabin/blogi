import * as postsSearch from "./modules/posts.js";

const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");

const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const searchDateBtn = document.querySelector("#searchDateBtn");

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

searchDateBtn.addEventListener("click", async () => {

    //TODO: check user input value for special characters

    const start = startDateInput.value;
    const end = endDateInput.value;

    const data = await postsSearch.searchPostsByDate(start, end);

    console.log(data);

    //TODO: display search results

});