const completeUserProfile = async (req, res) => {
  const { fullName, school, kidCount, bio } = req.body;

  try {
    const update = { profile: { fullName, school, kidCount, bio } };

    if (req.file) {
      const profilePicPath = `/2-School/uploads/${req.file.filename}`;
      update.profile.profilePic = profilePicPath;
    }

    await usersCollection.updateOne({ _id: ObjectId(req.userId) }, [
      { $set: update },
    ]);

    res.json({ message: "Profile updated successfully" });
    router.push("/profile");
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};