import React from "react";
import { formatRoute } from "../public/src/actions/goTo";
import { GLOBAL_ENUM } from "../public/common/enums";
import { useApiRoute } from "../public/src/hooks/queries";
import { LoadingSpinner } from "../public/src/components/Custom";
import { useRouter } from "next/router";
import EntityNotFound from "../public/src/views/Entity/EntityNotFound";
import Event from "../public/src/views/Entity/Event";
import Organization from "../public/src/views/Entity/Organization";
import Person from "../public/src/views/Entity/Person";
import Team from "../public/src/views/Entity/Team";

const EntityMap = {
  [GLOBAL_ENUM.PERSON]: Person,
  [GLOBAL_ENUM.ORGANIZATION]: Organization,
  [GLOBAL_ENUM.TEAM]: Team,
  [GLOBAL_ENUM.EVENT]: Event,
};

export default function Entity() {
  const router = useRouter();
  const { id } = router.query;

  const { response, isLoading } = useApiRoute(
    formatRoute("/api/entity", null, { id }),
    {
      defaultValue: {},
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!response) {
    return <EntityNotFound />;
  }

  const EntityObject = EntityMap[response.basicInfos.type];

  if (!EntityObject) {
    return <EntityNotFound />;
  }
  return <EntityObject {...response} />;
}
