import React, { useState, useCallback } from 'react';
import styles from './Map.module.css';

const CoordinateSystem = ({
    initialWidth = 1600,
    initialHeight = 1200,
    initialXRange = [-50, 50],
    initialYRange = [-50, 50],
    gridStep = 10,
    children
}) => {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
    const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });

    // Рассчитываем текущие диапазоны
    const xRange = [
        initialXRange[0] * scale + offset.x,
        initialXRange[1] * scale + offset.x
    ];

    const yRange = [
        initialYRange[0] * scale + offset.y,
        initialYRange[1] * scale + offset.y
    ];

    // Функции преобразования координат
    const scaleX = useCallback((x) => {
        const relativeX = x - (initialXRange[0] * scale + offset.x);
        return (relativeX / (initialXRange[1] - initialXRange[0]) / scale) * initialWidth;
    }, [initialXRange, scale, offset.x, initialWidth]);
    /* const scaleX = useCallback((x) =>
        ((x - xRange[0]) / (xRange[1] - xRange[0])) * initialWidth,
        [xRange, initialWidth]
    ); */

    const scaleY = useCallback((y) =>
        initialHeight - ((y - yRange[0]) / (yRange[1] - yRange[0])) * initialHeight,
        [yRange, initialHeight]
    );

    // Обратное преобразование координат
    const invertScaleX = useCallback((x) =>
        (x / initialWidth) * (xRange[1] - xRange[0]) + xRange[0],
        [xRange, initialWidth]
    );

    const invertScaleY = useCallback((y) =>
        ((initialHeight - y) / initialHeight) * (yRange[1] - yRange[0]) + yRange[0],
        [yRange, initialHeight]
    );

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
        if (isDragging) {
            const dx = e.nativeEvent.offsetX - startPanPos.x;
            const dy = e.nativeEvent.offsetY - startPanPos.y;

            const deltaX = (dx / initialWidth) * (xRange[1] - xRange[0]);
            const deltaY = (dy / initialHeight) * (yRange[1] - yRange[0]);

            setOffset({
                x: startOffset.x - deltaX,
                y: startOffset.y + deltaY
            });
        }

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
    const generateGrid = () => {
        const gridLines = [];
        const startX = Math.ceil(xRange[0] / gridStep) * gridStep;
        const endX = Math.floor(xRange[1] / gridStep) * gridStep;

        // Вертикальные линии
        for (let x = startX; x <= endX; x += gridStep) {
            gridLines.push(
                <line
                    key={`v_${x}`}
                    x1={scaleX(x)}
                    y1={0}
                    x2={scaleX(x)}
                    y2={initialHeight}
                    stroke="#eee"
                    strokeWidth={0.5}
                />
            );
        }

        // Горизонтальные линии
        const startY = Math.ceil(yRange[0] / gridStep) * gridStep;
        const endY = Math.floor(yRange[1] / gridStep) * gridStep;
        for (let y = startY; y <= endY; y += gridStep) {
            gridLines.push(
                <line
                    key={`h_${y}`}
                    x1={0}
                    y1={scaleY(y)}
                    x2={initialWidth}
                    y2={scaleY(y)}
                    stroke="#eee"
                    strokeWidth={0.5}
                />
            );
        }

        return gridLines;
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Панель масштабирования */}
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 100,
                display: 'flex',
                gap: '5px',
                flexWrap: 'wrap'
            }}>
                {[25, 50, 75, 100, 125, 150, 175].map((percent) => (
                    <button
                        key={percent}
                        onClick={() => handleScaleChange(percent / 100)}
                        style={{
                            padding: '5px 10px',
                            border: '1px solid #ccc',
                            borderRadius: '3px',
                            background: scale === percent / 100 ? '#eee' : '#fff',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {percent}%
                    </button>
                ))}
            </div>

            <svg
                width={initialWidth}
                height={initialHeight}
                style={{
                    border: '1px solid #ccc',
                    cursor: isDragging ? 'grabbing' : 'grab'
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
                    x2={initialWidth}
                    y2={scaleY(0)}
                    stroke="black"
                    strokeWidth={1}
                    markerEnd="url(#arrow)"
                />

                {/* Ось Y */}
                {/* <line
                    x1={scaleX(0)}
                    y1={initialHeight}
                    х2={scaleX(0)}
                    y2={0}
                    stroke="black"
                    strokeWidth={1}
                    markerEnd="url(#arrow)"
                /> */}

                <line
                    x1={scaleX(0)}
                    y1={0}
                    x2={scaleX(0)}
                    y2={initialHeight}
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

const Map = () => {
    return (
        <div className={styles['map']}>
            <div className={styles['map-grid']}>
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
    )
}

export default Map;