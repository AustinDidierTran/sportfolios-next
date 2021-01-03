import React from "react";

import { Container } from "../../components/Custom";

// @ts-ignore
import styles from "./ConfirmEmail.module.css";

const ConfirmEmail = () => {
  return (
    <div className={styles.main}>
      <Container>
        <p>
          Hey, we are now trying to confirm your email, please wait a moment...
        </p>
      </Container>
    </div>
  );
};

export default ConfirmEmail;