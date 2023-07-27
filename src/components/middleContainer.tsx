import { ContactComponent } from './contactComponent';
import { MemberComponent } from './memberComponent';
import styles from './middleContainer.module.scss';
import { OneLineNews } from './oneLineNews';
import { ProductComponent } from './productComponent';

export const MiddleContainer = () => (
  <div className={styles.container}>
    <OneLineNews />
    <ProductComponent />
    <MemberComponent />
    <ContactComponent />
  </div>
);
