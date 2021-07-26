import { useEffect, useState } from "react"
import { GLOBAL_ENUM } from "../../common/enums";
import { getEntityOwned } from "../actions/service/entity/get";

export const useOwnedPeopleIds = (): string[] => {
  const [ownedPeople, setOwnedPeople] = useState([]);

  useEffect(() => {
    getEntityOwned(GLOBAL_ENUM.PERSON).then((data) => setOwnedPeople(data.map((p) => p.id)));
  })

  return ownedPeople;
}