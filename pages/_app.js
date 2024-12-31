import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";
import PageHeader from "../components/pageHeader";
import BottomNavBar from "../components/BottomNavBar";
import Image from "next/image";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isIndexPage = router.pathname === "/";
  const [userTier, setUserTier] = useState(null);

  useEffect(() => {
    if (!isIndexPage) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserTier(decodedToken.tier);
      }
    }
  }, [isIndexPage]);

  const getTierImage = (tier) => {
    const tierImages = {
      BRONZE: "/media/Tiers/bronze.jpeg",
      SILVER: "/media/Tiers/silver.jpeg",
      GOLD: "/media/Tiers/gold.jpeg",
      DIAMOND: "/media/Tiers/diamond.jpeg",
    };
    return tierImages[tier];
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
          {userTier && (
            <div className="fixed right-4 top-4 z-50">
              <Image
                src={getTierImage(userTier)}
                alt={`${userTier}`}
                width={32}
                height={32}
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
