import Head from "next/head";
import { useRouter } from "next/router";
import { errors, ERROR_ENUM } from "../public/common/errors";
import { ROUTES } from "../public/src/actions/goTo";
import {
  Card,
  IgContainer,
  LoadingSpinner,
} from "../public/src/components/Custom";
import { useApiRoute } from "../public/src/hooks/queries";
import styles from "../styles/Home.module.css";

export default function HomeRoute() {
  const router = useRouter();

  const { isLoading, refetch, response: posts, status } = useApiRoute(
    "/api/entity/forYouPage",
    {
      defaultValue: [],
      method: "GET",
    }
  );

  if (status === errors[ERROR_ENUM.ACCESS_DENIED].code) {
    router.push(ROUTES.login);
  }

  if (isLoading) {
    <IgContainer>
      <LoadingSpinner />
    </IgContainer>;
  }

  console.log({ posts });
  return (
    <IgContainer>
      <div className={styles.general}>
        {posts.map((e, index) => (
          <Card
            type={e.cardType}
            items={{ ...e, update: refetch }}
            key={index}
          />
        ))}
      </div>
    </IgContainer>
  );
}
