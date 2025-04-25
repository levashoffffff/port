import React from 'react';
import styles from './Header.module.css';
import logo from './../../logo.svg';

import view from './../../img/header/view.svg';
import arrowdown from './../../img/header/arrowdown.svg';
import plus from './../../img/header/plus.svg';
import minus from './../../img/header/minus.svg';
import next from './../../img/header/next.svg';
import back from './../../img/header/back.svg';
import deletes from './../../img/header/delete.svg';
import frontIcon from './../../img/header/front-icon.svg';
import backIcon from './../../img/header/back-icon.svg';

const Header = () => {
    return (
        <header className={styles.header}>
            <section className={styles['header-top']}>
                <div className={styles['header-top-left-group']}>
                    <div className={styles.logo}>
                        <img src={logo} alt="" />
                    </div>
                    <div className={styles['name-menu-group']}>
                        <div className={styles['project-name']}>
                            Название проекта
                        </div>
                        <div className={styles['header-top-menu']}>
                            <ul className={styles['header-top-menu-list']}>
                                <li className={styles['header-top-menu-item']}>Файл</li>
                                <li className={styles['header-top-menu-item']}>Правка</li>
                                <li className={styles['header-top-menu-item']}>Вид</li>
                                <li className={styles['header-top-menu-item']}>Положение</li>
                                <li className={styles['header-top-menu-item']}>Дополнительно</li>
                                <li className={styles['header-top-menu-item']}>Помощь</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles['header-top-right-group']}>
                    <div className={styles['profile']}>
                        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256" /><path d="M128,32A96,96,0,0,0,63.8,199.4h0A72,72,0,0,1,128,160a40,40,0,1,1,40-40,40,40,0,0,1-40,40,72,72,0,0,1,64.2,39.4A96,96,0,0,0,128,32Z" opacity="0.2" /><circle cx="128" cy="128" fill="none" r="96" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" /><circle cx="128" cy="120" fill="none" r="40" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" /><path d="M63.8,199.4a72,72,0,0,1,128.4,0" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" /></svg>
                        <div>Профиль</div>
                    </div>
                </div>
            </section>
            <section className={styles['header-bottom']}>
                <div className={styles['header-bottom-menu']}>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={view} alt="Вид" title='Вид' />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            175% <img src={arrowdown} alt="#" />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={plus} alt="Плюс" title='Увеличить' />
                        </div>
                        <div className={styles['header-bottom-item']}>
                            <img src={minus} alt="Уменьшить" title='Уменьшить' />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={back} alt="Отменить" title='Отменить' />
                        </div>
                        <div className={styles['header-bottom-item']}>
                            <img src={next} alt="Вернуть" title='Вернуть' />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={deletes} alt="Удалить" title='Удалить' />
                        </div>
                    </div>
                    <div className={styles['header-bottom-menu-group']}>
                        <div className={styles['header-bottom-item']}>
                            <img src={frontIcon} alt="На передний план" title='На передний план' />
                        </div>
                        <div className={styles['header-bottom-item']}>
                            <img src={backIcon} alt="На задний план" title='На задний план' />
                        </div>
                    </div>

                </div>
            </section>
        </header>
    )
}

export default Header;