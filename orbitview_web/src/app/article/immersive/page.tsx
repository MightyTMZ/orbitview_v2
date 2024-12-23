import React from "react";
import ImmersiveReader from "@/components/ImmersiveReader/ImmersiveReader";

const testArticle = {
  id: 1,
  title: "The Future of Social Media: Moving Beyond Likes and Filters",
  slug: "the-future-of-social-media-moving-beyond-likes-and-filters",
  subtitle:
    "The current iteration of social platforms has reached a saturation point",
  blog: null,
  authors: [
    {
      id: 1,
      first_name: "Tom",
      last_name: "Zhang",
      user: {
        username: "tom",
        first_name: "Tom",
        last_name: "Zhang",
        profile_pic:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      },
    },
  ],
  content: `<p>Social media has been the defining innovation of the 21st century, reshaping how humans connect, communicate, and consume information. Yet, the current iteration of social platforms has reached a saturation point, plagued by issues like algorithm-induced echo chambers, performative interactions, and a lack of meaningful connections. It begs the question: <strong>What comes next?</strong></p>\r\n\r\n<h1>The Problem with Today&rsquo;s Social Media</h1>\r\n\r\n<p>For years, social media apps have relied on engagement metrics like likes, shares, and views to drive user activity. While this has proven effective for monetization, it has come at the cost of authentic communication. Many platforms now prioritize sensationalism over substance, leading to superficial interactions and, often, user burnout.</p>\r\n\r\n<p>Moreover, platforms fail to adequately serve young professionals and students seeking genuine connections, career opportunities, and learning tools. As a result, a significant portion of users are disengaging, hungry for something better.</p>\r\n\r\n<h1>Enter Next-Generation Social Media</h1>\r\n\r\n<p>The next wave of social platforms must focus on solving these pain points while introducing features that resonate with emerging generations. Here are a few pivotal trends that will define the future:</p>\r\n\r\n<h2>1. <strong>Purpose-Driven Networking</strong></h2>\r\n\r\n<p>Future platforms will move away from being time-fillers to tools that help users achieve tangible goals. This includes professional networking, skill-building, and project collaborations. The platforms will be less about &ldquo;who you know&rdquo; and more about &ldquo;what you&rsquo;re building together.&rdquo;</p>\r\n\r\n<h2>2. <strong>Immersive Learning Environments</strong></h2>\r\n\r\n<p>Social media can evolve into hubs for experiential learning. Imagine logging into an app that offers interactive courses, real-time coding sessions, or hands-on workshops&mdash;all integrated into your social feed. By merging AR/VR and gamification, these platforms can make learning as addictive as scrolling through Instagram.</p>\r\n\r\n<h3>3. <strong>AI-Driven Personalization</strong></h3>\r\n\r\n<p>Generative AI will play a crucial role in tailoring content, not just for consumption but for creation. Whether you&#39;re writing a blog post, planning a project pitch, or developing a business strategy, AI agents embedded in these platforms will assist in real time, democratizing access to high-quality tools.</p>\r\n\r\n<h2>4. <strong>Offline-Ready Communities</strong></h2>\r\n\r\n<p>One of the most exciting aspects of next-gen platforms is their ability to bridge the gap between the digital and the real world. Features like geolocated meetups and certified community spaces&mdash;what I call &quot;OrbitNodes&quot;&mdash;will become central to fostering genuine relationships.</p>\r\n\r\n<h1>Building for Gen Z and Beyond</h1>\r\n\r\n<p>The next generation of social apps, like <em>OrbitView</em>, will cater specifically to Gen Z and early professionals who demand more from their digital spaces. This demographic values transparency, innovation, and purposeful design, and they are ready to embrace platforms that prioritize these principles.</p>\r\n\r\n<h4>Key Features to Watch:</h4>\r\n\r\n<ul>\r\n\t<li><strong>Stereoscopic Filters</strong>: Cost-effective AR/VR tools for immersive experiences.</li>\r\n\t<li><strong>Assistive Content Creation</strong>: Upload a file and let AI generate an actionable article or proposal.</li>\r\n\t<li><strong>Real-Time Data Feeds</strong>: Ultra-responsive analytics for networking and projects.</li>\r\n</ul>\r\n\r\n<h1>Challenges and Opportunities</h1>\r\n\r\n<p>Building such platforms isn&rsquo;t without challenges. Monetization models must align with user-first principles, and ensuring data privacy will be non-negotiable. However, for creators who can navigate these hurdles, the opportunities are immense.</p>\r\n\r\n<p>Next-gen social media will transform how we connect and learn, becoming as indispensable as the internet itself.</p>`,
  created_at: "2024-12-14T18:15:12.787886Z",
  updated_at: "2024-12-14T18:15:12.787886Z",
  is_published: true,
  featured_image:
    "https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5304ec4f-e5fe-4568-bc5e-f31d56d1a0c1_1100x585.jpeg",
  label: "B",
};

const page = () => {
  return <ImmersiveReader article={testArticle}/>;
};

export default page;
