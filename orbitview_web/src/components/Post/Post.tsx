import React from "react";

interface User {
  username: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
}

interface Author {
  user: User;
  agree_to_guidelines: boolean;
  agree_to_punishments: boolean;
  agree_to_legal: boolean;
  agree_to_terms_and_conditions: boolean;
  has_signed: boolean;
  can_post_content: boolean;
}

interface Attachment {
  id: number;
  attachment: string;
}

interface PostProps {
  id: number;
  author: Author;
  post_type: string;
  main_content: string;
  attachments: Attachment[];
  created_at: string;
  archived: boolean;
}

interface PostComponentProps {
  post: PostProps;
}

const Post: React.FC<PostComponentProps> = ({ post }) => {
  const {
    author: { user, can_post_content },
    post_type,
    main_content,
    attachments,
    created_at,
  } = post;

  // Format timestamp for user-friendly display
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 hover:shadow-lg transition-shadow duration-300 max-w-3xl mx-auto">
      {/* Author Section */}
      <div className="flex items-center mb-4">
        <img
          src={user.profile_pic}
          alt={`${user.username}'s profile`}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div>
          <p className="text-lg font-bold text-gray-800">{`${user.first_name} ${user.last_name}`}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        {post_type === "TEXT" && (
          <p className="text-gray-700 leading-relaxed">{main_content}</p>
        )}
      </div>

      {/* Attachments */}
      {attachments?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {attachments.map((attachment) => (
            <img
              key={attachment.id}
              src={attachment.attachment}
              alt={`Attachment ${attachment.id}`}
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 object-cover max-h-64"
            />
          ))}
        </div>
      )}

      {/* Timestamp */}
      <div className="mt-4 text-right text-sm text-gray-500">
        {formattedDate}
      </div>

      {/* Interaction Section */}
      {can_post_content && (
        <div className="mt-4 flex justify-between items-center">
          <button className="text-sm font-medium text-blue-600 hover:underline">
            Like
          </button>
          <button className="text-sm font-medium text-blue-600 hover:underline">
            Comment
          </button>
          <button className="text-sm font-medium text-blue-600 hover:underline">
            Share
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
