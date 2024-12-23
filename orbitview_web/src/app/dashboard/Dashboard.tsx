import React from "react";
import { Card } from "@/components/Card/Card";

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back, Tom!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Quick Stats">
            <p>Badges earned: 5</p>
            <p>Events attended: 3</p>
          </Card>

          <Card title="Learning Hub">
            <p>Current progress: 3/10 lessons completed</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Continue Learning
            </button>
          </Card>

          <Card title="Upcoming Events">
            <p>Next event: Startup Pitch Practice</p>
            <p>Date: July 15, 2023</p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              RSVP
            </button>
          </Card>

          <Card title="Growth Tracking">
            <p>Skills developed: Marketing, Finance</p>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              View Progress
            </button>
          </Card>

          <Card title="AI Assistant">
            <p>Have a question? Ask our AI!</p>
            <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Chat Now
            </button>
          </Card>

          <Card title="Notifications">
            <ul className="list-disc pl-5">
              <li>New event added: Fundraising Workshop</li>
              <li>You've earned a new badge!</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};
