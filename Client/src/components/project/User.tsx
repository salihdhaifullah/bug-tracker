import { Link } from "react-router-dom";
import { IUser } from ".";

const User = ({ user }: { user: IUser }) => {
    return (
        <Link to={`/profile/${user.id}`}>
            <div className="flex items-center">
                <img
                    className="rounded-full shadow-md w-10 h-10 object-contain"
                    src={user.imageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                />
                <span className="ml-2 font-medium">{user.firstName} {user.lastName}</span>
            </div>
        </Link>
    );
};

export default User;
