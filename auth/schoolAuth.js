const handleSchoolLogin = async (credentials) => {
  const response = await axios.post("/api/school/login", credentials);
  if (response.data.token) {
    localStorage.setItem("schoolToken", response.data.token);
    router.push("/school-dashboard");
  }
};
