import React, { useState, useCallback, useEffect, useRef } from 'react';
import styles from './Map.module.css';

const CoordinateSystem = ({
    initialXRange = [-200, 200],
    initialYRange = [-200, 200],
    gridStep = 10,
    children
}) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
    const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });

    // Расчет текущих диапазонов
    const xRange = [
        initialXRange[0] * scale + offset.x,
        initialXRange[1] * scale + offset.x
    ];

    const yRange = [
        initialYRange[0] * scale + offset.y,
        initialYRange[1] * scale + offset.y
    ];

    // Отслеживание размеров контейнера
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    // Функции преобразования координат
    const scaleX = useCallback((x) => {
        const relativeX = x - (initialXRange[0] * scale + offset.x);
        return (relativeX / (initialXRange[1] - initialXRange[0]) / scale) * dimensions.width;
    }, [initialXRange, scale, offset.x, dimensions.width]);

    const scaleY = useCallback((y) => {
        const relativeY = y - (initialYRange[0] * scale + offset.y);
        return dimensions.height - (relativeY / (initialYRange[1] - initialYRange[0])) / scale * dimensions.height;
    }, [initialYRange, scale, offset.y, dimensions.height]);

    // Обратное преобразование координат
    const invertScaleX = useCallback((x) =>
        (x / dimensions.width) * (xRange[1] - xRange[0]) + xRange[0],
        [dimensions.width, xRange]);

    const invertScaleY = useCallback((y) =>
        ((dimensions.height - y) / dimensions.height) * (yRange[1] - yRange[0]) + yRange[0],
        [dimensions.height, yRange]);

    // Обработчики событий мыши
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPanPos({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY
        });
        setStartOffset(offset);
    };

    const handleMouseMove = (e) => {
        if (!dimensions.width || !dimensions.height) return;

        // Обработка перемещения
        if (isDragging) {
            const dx = e.nativeEvent.offsetX - startPanPos.x;
            const dy = e.nativeEvent.offsetY - startPanPos.y;

            const deltaX = (dx / dimensions.width) * (xRange[1] - xRange[0]);
            const deltaY = (dy / dimensions.height) * (yRange[1] - yRange[0]);

            setOffset({
                x: startOffset.x - deltaX,
                y: startOffset.y + deltaY
            });
        }

        // Обновление позиции курсора
        const pointX = invertScaleX(e.nativeEvent.offsetX);
        const pointY = invertScaleY(e.nativeEvent.offsetY);
        setMousePos({
            x: pointX,
            y: pointY,
            svgX: e.nativeEvent.offsetX,
            svgY: e.nativeEvent.offsetY
        });
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsDragging(false);
        setMousePos(null);
    };

    // Масштабирование колесом мыши
    const handleWheel = (e) => {
        e.preventDefault();
        if (!dimensions.width || !dimensions.height) return;

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(0.25, scale * delta), 3);

        const pointX = invertScaleX(e.nativeEvent.offsetX);
        const pointY = invertScaleY(e.nativeEvent.offsetY);

        setOffset({
            x: pointX - (pointX - offset.x) * delta / scale * newScale,
            y: pointY - (pointY - offset.y) * delta / scale * newScale
        });
        setScale(newScale);
    };

    // Изменение масштаба кнопками
    const handleScaleChange = (newScale) => {
        setScale(newScale);
        setOffset({ x: 0, y: 0 });
    };

    // Генерация сетки
    // Модифицированная функция генерации сетки
    const generateGrid = () => {
        if (!dimensions.width || !dimensions.height) return null;

        const gridLines = [];
        const subGridStep = gridStep / 5;

        // Вертикальные линии
        const startX = Math.ceil(xRange[0] / subGridStep) * subGridStep;
        const endX = Math.floor(xRange[1] / subGridStep) * subGridStep;

        for (let x = startX; x <= endX; x += subGridStep) {
            const isMainLine = Math.abs(x % gridStep) < 0.001; // Проверка на основной шаг

            gridLines.push(
                <line
                    key={`v_${x}`}
                    x1={scaleX(x)}
                    y1={0}
                    x2={scaleX(x)}
                    y2={dimensions.height}
                    stroke={isMainLine ? "#97bd83" : "#b4b4b4"}
                    strokeWidth={isMainLine ? 0.5 : 0.25}
                    opacity={isMainLine ? 1 : 0.6}
                />
            );
        }

        // Горизонтальные линии
        const startY = Math.ceil(yRange[0] / subGridStep) * subGridStep;
        const endY = Math.floor(yRange[1] / subGridStep) * subGridStep;

        for (let y = startY; y <= endY; y += subGridStep) {
            const isMainLine = Math.abs(y % gridStep) < 0.001;

            gridLines.push(
                <line
                    key={`h_${y}`}
                    x1={0}
                    y1={scaleY(y)}
                    x2={dimensions.width}
                    y2={scaleY(y)}
                    stroke={isMainLine ? "#97bd83" : "#b4b4b4"}
                    strokeWidth={isMainLine ? 0.5 : 0.25}
                    opacity={isMainLine ? 1 : 0.6}
                />
            );
        }

        return gridLines;
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '300px',
                overflow: 'hidden'
            }}
        >
            {/* Панель управления масштабом */}
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 100,
                display: 'flex',
                gap: '5px',
                flexWrap: 'wrap',
                backgroundColor: 'rgba(255,255,255,0.8)',
                padding: '5px',
                borderRadius: '5px'
            }}>
                {[25, 50, 75, 100, 125, 150, 175].map((percent) => (
                    <button
                        key={percent}
                        onClick={() => handleScaleChange(percent / 100)}
                        style={{
                            padding: '5px 10px',
                            border: '1px solid #ccc',
                            borderRadius: '3px',
                            background: scale === percent / 100 ? '#ddd' : '#fff',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {percent}%
                    </button>
                ))}
            </div>

            <svg
                width={dimensions.width}
                height={dimensions.height}
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setIsHovered(true)}
                onWheel={handleWheel}
            >
                <defs>
                    <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="9"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
                    </marker>
                </defs>

                {/* Сетка */}
                {generateGrid()}

                {/* Ось X */}
                <line
                    x1={0}
                    y1={scaleY(0)}
                    x2={dimensions.width}
                    y2={scaleY(0)}
                    stroke="black"
                    strokeWidth={1}
                    markerEnd="url(#arrow)"
                />

                {/* Ось Y */}
                <line
                    x1={scaleX(0)}
                    y1={0}
                    x2={scaleX(0)}
                    y2={dimensions.height}
                    stroke="black"
                    strokeWidth={1}
                    markerEnd="url(#arrow)"
                />

                {/* Подсказка с координатами */}
                {isHovered && mousePos && (
                    <text
                        x={mousePos.svgX + 10}
                        y={mousePos.svgY - 10}
                        fontSize="12"
                        fill="black"
                        style={{
                            userSelect: 'none',
                            pointerEvents: 'none',
                            backgroundColor: 'white',
                            padding: '2px 5px',
                            borderRadius: '3px',
                            boxShadow: '0 0 3px rgba(0,0,0,0.3)'
                        }}
                    >
                        {`(${mousePos.x.toFixed(2)}, ${mousePos.y.toFixed(2)})`}
                    </text>
                )}

                {/* Дочерние элементы */}
                {children({ scaleX, scaleY, scale })}
            </svg>
        </div>
    );
};

// Пример использования
const App = () => (
    <div className={styles.map}>
        <div style={{
            width: '45vw',
            height: '84vh',
            /* padding: '20px', */
            boxSizing: 'border-box',
            margin: '5px auto',
            backgroundColor: '#fff',
            boxShadow: '0px 0px 5px #5e5c5c'
        }}>
            <CoordinateSystem>
                {({ scaleX, scaleY, scale }) => (
                    <>
                        <circle
                            cx={scaleX(0)}
                            cy={scaleY(0)}
                            r={5 / scale}
                            fill="red"
                        />
                        <path
                            d={`M${scaleX(-20)} ${scaleY(-20)} L${scaleX(20)} ${scaleY(20)}`}
                            stroke="blue"
                            strokeWidth={2 / scale}
                            fill="none"
                        />
                    </>
                )}
            </CoordinateSystem>
        </div>
    </div>
);

export default App;