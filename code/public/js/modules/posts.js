function posts(){}

const noSuccessObj = { isSuccess: false };

/**
 * Make search of posts by name in database.
 * Returning value is promise with object, which contains isSuccess boolean indicator of operation status on the server side and result array with all matches.
 * Operation status is true if query was successful, user is logged and no problems with Internet or database connection was occurred, if it is false the opposite.
 * @param name {string} name or start of the post name
 * @returns Promise with object with operation status and result array or only operation status if right parameter was not provided
 */
async function searchPostsByName(name) {
    if(name){
        return await fetchPosts("name", name);
    } else {
        console.error("No name defined");
        return noSuccessObj;
    }
}

/**
 * Make search of posts by login value in database.
 * Returning value is promise with object, which contains isSuccess boolean indicator of operation status on the server side and result array with all matches.
 * Operation status is true if query was successful, user is logged and no problems with Internet or database connection was not occurred, if it is false the opposite.
 * @param author {string} login or start of it
 * @returns Promise with object with operation status and result array or only operation status if right parameter was not provided
 */
async function searchPostsByAuthor(author) {
    if(author){
        return await fetchPosts("author", author);
    } else {
        console.error("No author defined");
        return noSuccessObj;
    }
}

/**
 * Make search of posts, which were created from, to and from to searching dates in database.
 * Returning value is promise with object, which contains isSuccess boolean indicator of operation status on the server side and result array with all matches.
 * Operation status is true if query was successful, user is logged and no problems with Internet or database connection was not occurred, if it is false the opposite.
 * @param start {date} starting date in format: 2021-03-01
 * @param end {date} ending date in format: 2021-03-01
 * @returns Promise with object with operation status and result array or only operation status if right parameter was not provided
 */
async function searchPostsByDate(start, end) {
    if(start || end){
        try{
            start = start ? start : "";
            end = end ? end : "";
            const res = await fetch(`/posts?start=${start}&end=${end}`, {method: "GET"});
            return await res.json();
        }catch(e){
            console.error(e);
            console.error("Problems with fetching");
            return noSuccessObj;
        }
    } else {
        console.error("Both of dates are not defined");
        return noSuccessObj;
    }
}

async function fetchPosts(field, searchWord) {
    try{
        const res = await fetch(`/posts?${field}=${searchWord}`, {method: "GET"});
        return await res.json();
    }catch(e){
        console.error(e);
        console.error("Problems with fetching");
        return noSuccessObj;
    }
}

export { searchPostsByName, searchPostsByAuthor, searchPostsByDate };