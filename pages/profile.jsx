import dynamic from 'next/dynamic';

// Lazy-load the Profile component, disabling SSR
const Profile = dynamic(() => import('../components/profile'), { ssr: false });

export default Profile;
