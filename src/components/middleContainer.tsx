import styles from './middleContainer.module.scss';
import { ProductComponent } from './productComponent';

export const MiddleContainer = () => (
    <div className={styles.container}>
        <ProductComponent />
    </div>
);