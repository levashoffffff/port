import SidebarLeft from './SidebarLeft/SidebarLeft';
import Map from './Map/Map';
import SidebarRight from './SidebarRight/SidebarRight';
import styles from './Content.module.css';

const Content = () => {
    return ( 
        <main className={styles['content']}>
            <SidebarLeft />
            <Map />
            <SidebarRight />
        </main>
        
    )
}

export default Content;