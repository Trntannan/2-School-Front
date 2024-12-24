import React from "react";
import Requests from "./Requests";

const regularRequests = [];

const mockRequests = [
  {
    id: 1,
    name: "John Doe",
    profilePic: "https://picsum.photos/200/300",
    bio: "Change these to english.",
  },
  {
    id: 2,
    name: "Jane Smith",
    profilePic: "https://picsum.photos/200/301",
    bio: "Change these to english.",
  },
  {
    id: 3,
    name: "Bob Johnson",
    profilePic: "https://picsum.photos/200/302",
    bio: "More to be changed to english.",
  },
];

const App = () => {
  const handleAccept = (id) => {
    console.log(`Accepted request from user with ID ${id}`);
  };

  const handleRefuse = (id) => {
    console.log(`Refused request from user with ID ${id}`);
  };

  return (
    <div>
      <h1>Regular Requests</h1>
      <Requests
        requests={regularRequests}
        onAccept={handleAccept}
        onRefuse={handleRefuse}
      />

      <h1>Mock Requests</h1>
      <Requests
        requests={mockRequests}
        onAccept={handleAccept}
        onRefuse={handleRefuse}
      />
    </div>
  );
};

export default App;
