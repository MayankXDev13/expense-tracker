function Profile() {
  const user = {
    name: "Mayank Sharma",
    email: "mayank@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mayank", // avatar generator
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="flex flex-col items-center bg-neutral-900 text-neutral-100 rounded-2xl shadow-lg w-80 p-6 mx-auto mt-10">
      <img
        src={user.avatar}
        alt="User Avatar"
        className="w-24 h-24 rounded-full border-2 border-neutral-700 mb-4"
      />

      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="text-neutral-400 text-sm mb-6">{user.email}</p>

      <button
        onClick={handleLogout}
        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-4 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
