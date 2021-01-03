import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { ROUTES } from "../../public/src/actions/goTo";
import AddPaymentMethod from "../../public/src/views/AddPaymentMethod";

const AddPaymentMethodRoute = (props) => {
  const router = useRouter();
  const { redirect: redirectProps } = router.query;

  const redirect = useMemo(() => {
    if (redirectProps) {
      return redirectProps;
    }

    return ROUTES.userSettings;
  });

  return <AddPaymentMethod redirect={redirect} />;
};

export default AddPaymentMethodRoute;
