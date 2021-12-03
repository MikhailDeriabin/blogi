function profile_post(){}

const noSuccessObj = { isSuccess: false };

/**
 * Create and save new post to the database and returns operation status
 * Operation status isSuccess is true if query was successful, user is logged in and no problems with Internet or database connection was occurred, if it is false the opposite
 * If right parameters was not provided operation status will be also false
 * @param name {string} name of the new post
 * @param content {string} content of the new post
 * @returns Promise with object with status of operation
 */
async function createPost(name, content) {
    if(name){
        content = content ? content : "";
        const data = {
            name: name,
            content: content
        }
        const fetchOptions = generateFetchObj("POST", data);
        try{
            const res = await fetch("/profile/myposts", fetchOptions);
            return await res.json();
        } catch(e){
            //if something wrong with cookies = probably user is not authorized
            console.error(e);
            window.location.href = "/login";
        }
    } else {
        console.error("Name of post not provided");
        return noSuccessObj;
    }
}

/**
 * Read all user posts, returns it as object with results array and operation status isSuccess
 * Operation status is true if query was successful, user is logged in and no problems with Internet or database connection was occurred, if it is false the opposite
 * @returns Promise with object with operation status and result array or only operation status if right parameter was not provided
 */
async function readAllPosts(){
    return await getInformation("/profile/myposts");
}

/**
 * Read post with specific id, returns it as object with operation status isSuccess
 * Operation status is true if query was successful, user is logged in and no problems with Internet or database connection was occurred, if it is false the opposite
 * @param id {int} id number of the post
 * @returns Promise with object with operation status and result object or only operation status if right parameter was not provided
 */
async function readPostById(id){
    if(Number.isInteger(id)){
        return await getInformation(`/profile/myposts/${id}`);
    } else {
        console.error("Provided id is not integer");
        return noSuccessObj;
    }
}

/**
 * Update post with specific id, returns object with operation status isSuccess
 * Operation status is true if query was successful, user is logged in and no problems with Internet or database connection was occurred, if it is false the opposite
 * @param id {int} id number of the post
 * @param name {string} new name of the post
 * @param content {string} new content of the post
 * @returns Promise with object with status of operation
 */
async function updatePostById(id, name, content) {
    if(Number.isInteger(id) && name){
        content = content ? content : "";
        const data = {name: name, content: content};

        const fetchOptions = generateFetchObj("PUT", data);

        try{
            const res = await fetch(`/profile/myposts/${id}`, fetchOptions);
            return await res.json();
        } catch(e){
            //if something wrong with cookies = probably user is not authorized
            console.error(e);
            window.location.href = "/login";
        }
    } else if(!Number.isInteger(id))
        console.error("Provided id is not an integer");
    else if(!name)
        console.error("Name is not provided");

    return noSuccessObj;
}

/**
 * Delete post with specific id, returns object with operation status isSuccess
 * Operation status is true if query was successful, user is logged in and no problems with Internet or database connection was occurred, if it is false the opposite
 * @param id {int} id number of the post
 * @returns Promise with object with status of operation
 */
async function deletePostById(id) {
    if(Number.isInteger(id)){
        const fetchOptions = {
            method: "DELETE"
        };
        try{
            const res = await fetch(`/profile/myposts/${id}`, fetchOptions);
            return await res.json();
        } catch(e){
            //if something wrong with cookies = probably user is not authorized
            console.log(e);
            window.location.href = "/login";
        }
    } else{
        console.error("Provided id is not an integer");
        return noSuccessObj;
    }
}

async function getInformation(path) {
    const fetchOptions = {
        method: "GET"
    };
    try{
        const res = await fetch(path, fetchOptions);
        return await res.json();
    } catch(e){
        console.log(e);
        return noSuccessObj;
    }
}

function generateFetchObj(method, data) {
   return {
       method: method,
       headers: {
            "Content-Type": "application/json"
       },
       body: JSON.stringify(data)
   };
}

export { createPost, readAllPosts, readPostById, updatePostById, deletePostById };