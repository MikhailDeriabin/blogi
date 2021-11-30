function profile_data(){}

const noSuccessObj = { isSuccess: false };

async function readAllData() {
    return await getInformation("/profile/information");
}

async function readPropertyByName(name) {
    if(name){
        return await getInformation(`/profile/information/${name}`);
    } else {
        console.error("No property name provided");
        return noSuccessObj;
    }
}

async function updatePropertyByName(name, value) {
    //const updateObj = {value: "Andrew"};
    //const resp = await updateInformation("/profile/information/name", updateObj);

    if(name && value){
        const data = { value: value };
        const fetchOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        try{
            const res = await fetch(`/profile/information/${name}`, fetchOptions);
            return await res.json();
        }
        catch(e){
            //if something wrong with cookies = probably user is not authorized
            console.error(e);
            window.location.href = "/login";
        }
    } else {
        console.error("No property name or value provided");
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
    }catch(e){
        console.log(e);
        return {};
    }
}

export { readAllData, readPropertyByName, updatePropertyByName };