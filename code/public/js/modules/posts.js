function posts(){}

const noSuccessObj = { isSuccess: false };

async function searchPostsByName(name) {
    if(name){
        return await fetchPosts("name", name);
    } else {
        console.error("No name defined");
        return noSuccessObj;
    }
}

async function searchPostsByAuthor(author) {
    if(author){
        return await fetchPosts("author", author);
    } else {
        console.error("No author defined");
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

export { searchPostsByName, searchPostsByAuthor };