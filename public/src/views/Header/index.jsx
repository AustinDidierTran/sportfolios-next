import React, { useContext, useState, useEffect } from "react";
import { Store } from "../../Store";

import LoggedIn from "./LoggedIn";
import Default from "./Default";
import LoggedOut from "./LoggedOut";
import { Typography } from "../../components/MUI";
import api from "../../actions/api";
import { GLOBAL_ENUM } from "../../../common/enums";
import CartIcon from "../Cart/CartICon";
import validator from "validator";
import { useRouter } from "next/router";

const getEntity = async (entityId) => {
  const { data } = await api(`/api/entity?id=${entityId}`);
  return data.basicInfos;
};

export default function Header() {
  const {
    state: { isAuthenticated },
  } = useContext(Store);
  console.log({ isAuthenticated });

  const router = useRouter();
  const [path, setPath] = useState("");
  const [entity, setEntity] = useState({});

  const fetchData = async () => {
    const pth = router.pathname.split("/")[1] || "";

    if (
      [
        "addPaymentMethod",
        "cart",
        "checkout",
        "menu",
        "orderProcessed",
        "organizationList",
        "registrationStatus",
        "scheduleInteractiveTool",
      ].includes(pth)
    ) {
      setPath(pth);
    } else if (["eventRegistration"].includes(pth)) {
      const id = router.pathname.split("/")[2] || "";
      const ent = await getEntity(id);
      setPath(ent.type);
      setEntity(ent);
    } else if (validator.isUUID(pth)) {
      const ent = await getEntity(pth);
      setPath(ent.type);
      setEntity(ent);
    } else {
      setPath("");
    }
  };

  useEffect(() => {
    fetchData();
  }, [router.pathname]);

  if (isAuthenticated) {
    switch (path) {
      case "addPaymentMethod":
      case "checkout":
      case "orderProcessed":
      case "registrationStatus":
        return (
          <Default
            Item1={() => (
              <Typography style={{ fontSize: "24px" }}>{"Checkout"}</Typography>
            )}
            Item4={() => <CartIcon />}
          />
        );

      case "cart":
        return (
          <Default
            Item1={() => (
              <Typography style={{ fontSize: "24px" }}>{"Cart"}</Typography>
            )}
            Item4={() => <CartIcon />}
          />
        );

      case "menu":
        return (
          <Default
            Item1={() => (
              <Typography style={{ fontSize: "24px" }}>{"Menu"}</Typography>
            )}
            Item4={() => <CartIcon />}
          />
        );

      case "scheduleInteractiveTool":
        return <Default showBar={false} />;

      case GLOBAL_ENUM.EVENT:
      case GLOBAL_ENUM.ORGANIZATION:
      case GLOBAL_ENUM.PERSON:
      case GLOBAL_ENUM.TEAM:
        return (
          <Default
            Item2={() => (
              <Typography style={{ fontSize: "16px" }}>
                {entity.name}
              </Typography>
            )}
            Item4={() => <CartIcon />}
          />
        );

      default:
        return <LoggedIn />;
    }
  }
  return <LoggedOut />;
}
