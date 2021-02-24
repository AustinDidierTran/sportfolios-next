import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export default function GameDetailed() {
  const { t } = useTranslation();
  const router = useRouter();

  return <>Afficher une game</>;
}
