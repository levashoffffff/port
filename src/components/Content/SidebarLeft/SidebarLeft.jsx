import React, { useState, useRef } from 'react';
import styles from './SidebarLeft.module.css';
/* import Box from '@mui/material/Box'; */

/*Input Search*/
const SearchInput = ({
  placeholder = 'Поиск...',
  onSearch,
  loading = false,
  className,
  ...props
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(query);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.inputWrapper} ${isFocused ? styles.inputWrapperFocused : ''}`}>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className={styles.input}
          {...props}
        />

        {query && (
          <button
            type="button"
            className={`${styles.clearButton} ${query ? styles.clearButtonVisible : ''}`}
            onClick={handleClear}
            aria-label="Очистить поиск"
          />
        )}

        <button
          type="button"
          className={`${styles.searchIcon} ${loading ? styles.loading : ''}`}
          onClick={() => onSearch?.(query)}
          aria-label="Выполнить поиск"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};


/* Аккордион */
const Accordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState([]);

  const toggleAccordion = (index) => {
    setActiveIndex(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={styles['accordion']}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          isActive={activeIndex.includes(index)}
          onClick={() => toggleAccordion(index)}
          title={item.title}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

const AccordionItem = ({ isActive, onClick, title, children }) => {
  return (
    <div className={`${styles['accordion-item']} ${isActive ? styles.active : ''}`}>
      <button className={styles['accordion-header']} onClick={onClick}>
        <span className={styles['accordion-icon']}></span>
        <span className={styles['accordion-title']}>{title}</span>
      </button>
      <div className={styles['accordion-content']}>
        <div className={styles['accordion-text']}>{children}</div>
      </div>
    </div>
  );
};


const SidebarLeft = () => {

  const accordionItems = [
    {
      title: 'Первый элемент',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      title: 'Второй элемент',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.'
    },
    {
      title: 'Третий элемент',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit.'
    },
    {
      title: 'Четвертый элемент',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit.'
    },
    {
      title: 'Пятый элемент',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit.'
    },
    {
      title: 'Шестой элемент',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit.'
    }
  ];

  return (
    <aside className={styles['sidebar-left']}>
      <div className={styles['sidebar-left-search']}>
        <SearchInput
          placeholder="Поиск элемента..."
          onSearch={(query) => console.log('Search:', query)}
          loading={false}
        />
      </div>
      <div className={styles['sidebar-left-equipments']}>
        <Accordion items={accordionItems} />
      </div>
    </aside>
  )
}

export default SidebarLeft;