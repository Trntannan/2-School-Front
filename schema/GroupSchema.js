const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  routes: [
    {
      start: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      end: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      waypoints: [
        {
          // Optional waypoints for the route
          latitude: { type: Number, required: true },
          longitude: { type: Number, required: true },
        },
      ],
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
