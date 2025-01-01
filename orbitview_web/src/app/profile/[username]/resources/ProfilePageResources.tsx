import React from "react";
import ContentTypeComingSoon from "../ContentTypeComingSoon";
import ProfilePage from "../ProfilePage";

// Profile component
const ProfilePageEvents = () => {
  return (
    <>
      <ProfilePage content_type="events" />
      <div id="list-of-their-posts" className="container mx-auto mt-8 px-4">
        {/*<h1 className="text-4xl font-extrabold text-black mb-6">Posts</h1>*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/*<div>
              {posts.map((userPost) => (
                <PostPreviewCard key={userPost} post={userPost} />
              ))}
            </div>*/}

          <>
            <ContentTypeComingSoon contentType="resources" />
          </>
        </div>
      </div>
    </>
  );
};

export default ProfilePageEvents;
