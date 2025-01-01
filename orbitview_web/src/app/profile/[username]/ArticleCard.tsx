interface Profile {
  image: string;
  by_line: string;
}

interface Author {
  id: number;
  first_name: string;
  last_name?: string;
  profile: Profile;
}

interface Article {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  author: Author;
  content: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  featured_image: string;
  public: boolean;
  archived: boolean;
  likes_count: number;
  shares_count: number;
  saves_count: number;
  hide_likes_count: number;
  hide_shares_count: number;
}

interface Props {
  article: Article;
}

const ArticleCard = ({ article }: Props) => {
  const handleArticleClick = () => {
    // Redirect to article detail page
    window.location.href = `/article/${article.id}/${article.slug}`; // as of Dec 27, 2024, this is how the frontend routing for articles work
  };

  return (
    <div
      className="relative bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer"
      onClick={handleArticleClick}
    >
      {/* Featured Image */}
      <div className="relative">
        <img
          src={`${article.featured_image}`}
          alt={article.title}
          className="w-full h-40 object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-500 transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {article.subtitle}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {new Date(article.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center space-x-1">
            <img
              key={article.author.id}
              src={article.author.profile?.image ? `${article.author.profile.image}` : "/default-avatar.jpg"}
              alt={`${article.author.first_name} ${article.author.last_name}`}
              className="w-6 h-6 rounded-full border border-gray-300"
            />
            <span>
              {article.author.first_name} {article.author.last_name}
            </span>
          </span>
        </div>
      </div>

      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default ArticleCard;
