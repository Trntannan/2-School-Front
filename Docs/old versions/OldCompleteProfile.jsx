import React, { useState, useEffect } from 'react';
import styles from '../styles/profile.module.css';

const CompleteProfile = () => {
  const [form, setForm] = useState({
    id: '12345', 
    fullName: '',
    mobile: '',
    school: '',
    bio: '',
    profilePic: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const userId = '12345';

    if (userId) {
      setForm((prevForm) => ({ ...prevForm, id: userId }));

      const fetchProfile = () => {
        
        const profileData = {
          fullName: "John Doe",
          mobile: "123-456-7890",
          school: "XYZ University",
          bio: "Software Developer"
        };
        setForm((prevForm) => ({ ...prevForm, ...profileData }));
      };

      fetchProfile();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      const file = files[0];
      setForm({ ...form, [name]: file });

      if (file) {
        try {
          const objectUrl = URL.createObjectURL(file);
          setPreviewUrl(objectUrl);
        } catch (error) {
          console.error("Error creating object URL", error);
        }
      } else {
        setPreviewUrl(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile saved (placeholder)");
   
  };

  return (
    <div className={styles.profilePage}>
      <div className="page-header">
        <h1>Complete Your Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mobile">Mobile</label>
          <input id="mobile" type="text" name="mobile" value={form.mobile} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="school">School</label>
          <input id="school" type="text" name="school" value={form.school} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} required />
        </div>
        <div className={styles.profilePicContainer}>
          <label htmlFor="profilePic">Profile Picture</label>
          <input id="profilePic" type="file" name="profilePic" onChange={handleChange} />
          {previewUrl && <img src={previewUrl} alt="Profile" />}
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default CompleteProfile;