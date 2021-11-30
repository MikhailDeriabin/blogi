function profile_post(){}

const noSuccessObj = { isSuccess: false };

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

async function readAllPosts(){
    return await getInformation("/profile/myposts");
}

async function readPostById(id){
    if(Number.isInteger(id)){
        return await getInformation(`/profile/myposts/${id}`);
    } else {
        console.error("Provided id is not integer");
        return noSuccessObj;
    }
}

async function updatePostById(id, name, content) {
    if(Number.isInteger(id) && name){
        content = content ? content : "";
        const data = {id: id, name: name, content: content};

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