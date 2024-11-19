import React from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";
import PageHeader from "../components/pageHeader";
import BottomNavBar from "../components/BottomNavBar";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isIndexPage = router.pathname === "/";

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
      {!isIndexPage && <PageHeader title={pageTitles[router.pathname]} />}

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
