export const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      {results.users.length > 0 && (
        <div className="users-results mb-6">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          {results.users.map((user, index) => (
            <div key={index} className="user-card border p-2 rounded mb-2">
              <p className="text-lg font-medium">{user.username}</p>
              <p className="text-sm text-gray-600">
                {user.first_name} {user.last_name}
              </p>
            </div>
          ))}
        </div>
      )}

      {results.posts.length > 0 && (
        <div className="posts-results mb-6">
          <h2 className="text-xl font-bold mb-2">Posts</h2>
          {results.posts.map((post, index) => (
            <div key={index} className="post-card border p-2 rounded mb-2">
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.content}</p>
            </div>
          ))}
        </div>
      )}

      {results.articles.length > 0 && (
        <div className="articles-results">
          <h2 className="text-xl font-bold mb-2">Articles</h2>
          {results.articles.map((article, index) => (
            <div key={index} className="article-card border p-2 rounded mb-2">
              <h3 className="font-semibold text-lg">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
