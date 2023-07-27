import styles from './middleContainer.module.scss';
import { OneLineNews } from './oneLineNews';
import { ProductComponent } from './productComponent';

export const MiddleContainer = () => (
    <div className={styles.container}>
        <OneLineNews />
        <ProductComponent />
    </div>
);