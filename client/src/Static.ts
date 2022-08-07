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
      }

}
