import { useEffect, useState } from "react"
import { GLOBAL_ENUM } from "../../common/enums";
import { getEntityOwned } from "../actions/service/entity/get";

export const useOwnedPeopleIds = (): string[] => {
   return getEntityOwned(GLOBAL_ENUM.PERSON).then((res) =>res.map((p) => p.id)));
}
