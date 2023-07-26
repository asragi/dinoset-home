import { ContactForm } from './contact';
import { ContactComponent } from './contactComponent';
import { MemberComponent } from './memberComponent';
import styles from './middleContainer.module.scss';
import { ProductComponent } from './productComponent';

export const MiddleContainer = () => (
  <div className={styles.container}>
    <ProductComponent />
    <MemberComponent />
    <ContactComponent />
  </div>
);
