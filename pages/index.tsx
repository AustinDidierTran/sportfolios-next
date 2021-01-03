import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import React, { useContext, useEffect } from "react";
import { ROUTES } from "../public/src/actions/goTo";

const LoadingSpinner = dynamic(
  import("../public/src/components/Custom/LoadingSpinner")
);
const IgContainer = dynamic(
  import("../public/src/components/Custom/IgContainer")
);
import { useApiRoute } from "../public/src/hooks/queries";
import { Store } from "../public/src/Store";
const Home = dynamic(import("../public/src/views/Home"));

export default function HomeRoute() {
  const router = useRouter();

  const {
    state: { isAuthenticated },
  } = useContext(Store);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push(ROUTES.login);
    }
  }, [isAuthenticated]);

  const { isLoading, refetch, response: posts } = useApiRoute(
    "/api/entity/forYouPage",
    {
      defaultValue: [],
      method: "GET",
    }
  );

  if (isLoading) {
    return (
      <IgContainer>
        <LoadingSpinner />
      </IgContainer>
    );
  }

  return <Home posts={posts} refetch={refetch} />;
}
