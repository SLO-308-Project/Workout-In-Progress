import userModel, {userType} from "../data/user";

//Add a user.
function addUser(userJSON: userType)
{
    const userToAdd = new userModel(userJSON);
    const prom = userToAdd.save();
    return prom;
}

export default {
    addUser,
};
