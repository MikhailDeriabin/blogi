function profile_data(){}

const noSuccessObj = { isSuccess: false };

/**
 * Read all user personal information, as name, email, phone etc. and return it as object with corresponding keys as name, email etc.
 * @returns Promise with result object, containing all user personal information, in case of error will return empty object
 */
async function readAllData() {
    return await getInformation("/profile/information");
}

/**
 * Read specific user personal information only such as name, email, phone etc. and return it as object with corresponding key as name, email etc.
 * Also returned object will contain operation status isSuccess, which is true if query was successful, user is logged in and no problems with Internet or database connection was occurred, if it is false the opposite.
 * @param name {string} name of the user information
 * @returns Promise with object with operation status and result array or only operation status if right parameter was not provided
 */
async function readPropertyByName(name) {
    if(name){
        return await getInformation(`/profile/information/${name}`);
    } else {
        console.error("No property name provided");
        return noSuccessObj;
    }
}

/**
 * Update specific user personal information only such as name, email, phone etc. and return it as object with corresponding key as name, email etc.
 * Also returned object will contain operation status isSuccess, which is true if query was successful, user is logged in and no problems with Internet or database connection was occurred, if it is false the opposite.
 * @param name {string} name of the user information, for example email
 * @param value{string} new value of the property
 * @returns Promise with object with operation status and result array or only operation status if right parameter was not provided
 */
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