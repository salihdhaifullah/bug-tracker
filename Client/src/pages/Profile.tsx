import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();

  return (
    <section className="flex flex-col lg:flex-row justify-between gap-2 w-full h-full flex-grow p-2">
      {/* <div className="flex flex-col w-full lg:w-fit h-[70vh] justify-center items-center my-2">
        <div className="flex flex-col w-fit px-8 lg:px-2 gap-2 rounded-2xl justify-center items-center bg-white py-2">
          <Image />
          <h1 className="text-gray-800 font-medium text-2xl">{user.fullName}</h1>
          <Title />
          <hr className="bg-gray-500 w-full h-[2px] rounded-md" />
        </div>
      </div>
      <Content /> */}
    </section>
  )
}

export default Profile;
