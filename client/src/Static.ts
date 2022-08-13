export const Static = {

    Roles: {
        Array: ["Admin", "Developer", "Submitter", "ProjectManger"],
        Admin: "Admin",
        Developer: "Developer",
        Submitter: "Submitter",
        ProjectManger: "ProjectManger",
    },

    Priorates: {
        Array: ["Low", "Medium", "High"],
        Low: "Low",
        Medium: "Medium",
        High: "High",
    },

    Statuses: {
        Array: ["New", "In Progress", "Closed"],
        New: "New",
        InProgress: "In Progress",
        Closed: "Closed",
    },

    Types: {
        Array: ["Feature", "Bug"],
        Feature: "Feature",
        Bug: "Bug",
    },

    getIdParams: (url: string): number => {

        // split ashe char in the url   
        let array = url.split("");
        // this is array of the results
        let params: string[] = [];
        // inverse for loop  in this case gonna be away more faster
        for (let i = array.length - 1; i >= 0; i--) {
            // if the char is a slash that mean the end of params
            if (array[i] === "/") break;
            // i make sher if the are any query in url if there are i empty the array
            if (array[i] === "=") params = [];
            // if the char is a number gonna be in params array
            !isNaN(Number(array[i])) && params.push(array[i])
        }
        // return the id in the params url 
        // i used reverse function cuz its inverse for loop
        return Number(params.reverse().join(""))
    },


    checkExpirationDateJwt: (token: string): boolean => {
        // get the object part that content the expiration Date from token
        const base64Url = token.split('.')[1]

        // get the payload from the object part 
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        
        // decode the payload
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))

        // parse the json object 
        const objToken = JSON.parse(jsonPayload);

        // get the expiration date from the payload 
        const expireDate = objToken.exp * 1000;
        
        // get date now
        const currentDate = Date.now();
        
        // if the expiration date is less than the date now return true else false
        if ((currentDate - 1000 * 60 * 10) >= expireDate) return true;
                                    else return false;
    }

}
