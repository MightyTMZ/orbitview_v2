const HomeFeed = () => {
  const dummyPosts = [
    {
      id: 1,
      title: "Welcome to OrbitView!",
      content: "Discover immersive learning and media consumption experiences.",
      image: "https://via.placeholder.com/600x400",
      author: "Tom Zhang",
    },
    {
      id: 2,
      title: "How to Use OrbitView for Networking",
      content: "Tips to maximize your professional connections.",
      image: "https://via.placeholder.com/600x400",
      author: "Jane Doe",
    },
    {
      id: 3,
      title: "How to Use OrbitView for Networking",
      content: "Tips to maximize your professional connections.",
      image: "https://via.placeholder.com/600x400",
      author: "Jane Doe",
    },
    {
      id: 4,
      title: "How to Use OrbitView for Networking",
      content: "Tips to maximize your professional connections.",
      image: "https://via.placeholder.com/600x400",
      author: "Jane Doe",
    },
    {
      id: 5,
      title: "How to Use OrbitView for Networking",
      content: "Tips to maximize your professional connections.",
      image: "https://via.placeholder.com/600x400",
      author: "Jane Doe",
    },
    {
      id: 6,
      title: "How to Use OrbitView for Networking",
      content: "Tips to maximize your professional connections.",
      image: "https://via.placeholder.com/600x400",
      author: "Jane Doe",
    },
  ];

  return (
    <div className="home-feed"
    style={{
        paddingRight: "20%",
        paddingLeft: "20%",
    }}>
      <h1 className="text-3xl font-bold mb-4">Home Feed</h1>
      <div className="posts">
        {dummyPosts.map((post) => (
          <div
            key={post.id}
            className="post-card border p-4 rounded mb-4 shadow"
            
          >
            <img
              src={post.image}
              alt={post.title}
              className="mb-2 rounded w-full h-48 object-cover"
            />
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">By {post.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;
