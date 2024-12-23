interface Author {
  id: number;
  username: string;
  first_name: string;
  last_name: string;

  is_private: boolean,
  is_online: boolean,
  bio: string,
  by_line: string,
  date_of_birth: string,
  updated: string, // when did the user last update their profile
  created: string, // when did the user join OrbitView?
  image: string, //e.g. "/profile_pics/tom.jpg",
  followers_count: number,
  following_count: number;
}

interface Post {
  title: string;
  content: string;
  date_posted: string;
  date_updated: string;
}

const PostPreviewCard = (post: Post) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg border border-gray-700 hover:border-gray-500 transition-all duration-300">
      <h2 className="text-2xl font-extrabold text-blue-400 mb-2 hover:text-blue-500">
        {post.title}
      </h2>
      <div
        className="text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted on {new Date(post.date_posted).toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md">
            Like
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
