import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";
import PageHeader from "../components/pageHeader";
import axios from "axios";
import jwtDecode from "jwt-decode";
import BottomNavBar from "../components/BottomNavBar";
import Image from "next/image";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isIndexPage = router.pathname === "/";
  const [userTier, setUserTier] = useState(null);
  const [tierImageURL, setTierImageURL] = useState(null);

  useEffect(() => {
    if (!isIndexPage) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserTier(decodedToken.tier);
      }
    }
  }, [isIndexPage]);

  useEffect(() => {
    if (userTier) {
      const loadTierImage = async () => {
        const imageUrl = await getTierImage(userTier);
        setTierImage(imageUrl);
      };
      loadTierImage();
    }
  }, [userTier]);

  const getTierImage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/tierImages/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTierImageUrl(response.data.tierImages);
      return response.data.tierImages[userTier];
    } catch (error) {
      console.error("Error fetching tier image:", error);
      return null;
    }
  };

  const pageTitles = {
    "/profile": "Profile",
    "/groups": "Groups",
    "/settings": "Settings",
    "/ChatPage": "Chat",
    "/completeProfile": "Bio and Profile Picture",
    "/": "",
  };

  return (
    <>
      {!isIndexPage && (
        <div>
          <PageHeader title={pageTitles[router.pathname]} />
          {userTier && tierImageUrl && (
            <div className="fixed right-3 z-50">
              <Image
                src={`data:image/png;base64,${
                  tierImageUrl[userTier.toLowerCase()]
                }`}
                alt={`${userTier} Tier`}
                width={55}
                height={47}
                priority
              />
            </div>
          )}
        </div>
      )}

      <main
        className={`pt-${!isIndexPage ? 16 : 0} mb-${!isIndexPage ? 12 : 0}`}
      >
        <Component {...pageProps} />
      </main>

      {!isIndexPage && (
        <BottomNavBar activePage={pageTitles[router.pathname]} />
      )}
    </>
  );
}

export default MyApp;
