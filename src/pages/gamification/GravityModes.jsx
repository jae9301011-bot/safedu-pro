import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Matter from 'matter-js';
import { ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import './GravityModes.css';

export default function GravityModes() {
    const navigate = useNavigate();
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const runnerRef = useRef(null);
    const playerRef = useRef(null);

    const [mode, setMode] = useState('weakness'); // weakness, hazard, collapse
    const [score, setScore] = useState(0);

    useEffect(() => {
        initMatter();
        return () => cleanupMatter();
    }, [mode]);

    const initMatter = () => {
        if (!sceneRef.current) return;
        cleanupMatter();

        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Events = Matter.Events;

        const engine = Engine.create();
        engineRef.current = engine;

        const width = sceneRef.current.clientWidth;
        const height = sceneRef.current.clientHeight;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width,
                height,
                wireframes: false,
                background: 'transparent'
            }
        });
        renderRef.current = render;

        // Boundaries
        const walls = [
            Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true, render: { fillStyle: 'transparent' } }),
            Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true, render: { fillStyle: 'transparent' } }),
            Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true, render: { fillStyle: 'transparent' } })
        ];
        // Ceiling only for weakness mode so things bounce around inside
        if (mode === 'weakness' || mode === 'collapse') {
            walls.push(Bodies.rectangle(width / 2, -30, width, 60, { isStatic: true, render: { fillStyle: 'transparent' } }));
        }

        Composite.add(engine.world, walls);

        // Mode Specific Setups
        if (mode === 'weakness') {
            // Zero gravity floating blocks
            engine.gravity.y = 0;
            engine.gravity.x = 0;

            const keywords = ['타워크레인', '밀폐공간', '산소18%', '위험성평가', '안전인증', '방호장치'];
            const blocks = keywords.map((kw, i) => {
                const bx = 100 + Math.random() * (width - 200);
                const by = 100 + Math.random() * (height - 200);
                const body = Bodies.rectangle(bx, by, 120, 50, {
                    restitution: 0.9,
                    friction: 0.05,
                    frictionAir: 0.01,
                    render: {
                        fillStyle: `hsl(${i * 50}, 70%, 50%)`,
                        text: { content: kw, color: '#fff', size: 16 }
                    }
                });
                Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 });
                return body;
            });
            Composite.add(engine.world, blocks);

            // Blackhole slot (target)
            const slot = Bodies.circle(width / 2, height / 2, 60, {
                isStatic: true,
                isSensor: true,
                label: 'targetSlot',
                render: { fillStyle: 'rgba(79, 70, 229, 0.2)', strokeStyle: 'var(--color-primary)', lineWidth: 3 }
            });
            Composite.add(engine.world, slot);

            Events.on(engine, 'collisionStart', (event) => {
                event.pairs.forEach((pair) => {
                    if ((pair.bodyA.label === 'targetSlot' && !pair.bodyB.isStatic) ||
                        (pair.bodyB.label === 'targetSlot' && !pair.bodyA.isStatic)) {
                        const target = pair.bodyA.label === 'targetSlot' ? pair.bodyB : pair.bodyA;
                        Matter.Composite.remove(engine.world, target);
                        setScore(prev => prev + 10);
                    }
                });
            });
        } else if (mode === 'hazard') {
            // Normal gravity, raining blocks
            engine.gravity.y = 0.5;

            // Player pad at bottom
            playerRef.current = Bodies.rectangle(width / 2, height - 50, 150, 20, {
                isStatic: true,
                render: { fillStyle: 'var(--color-primary)' }
            });
            Composite.add(engine.world, playerRef.current);

            // Spawn hazards loop
            const spawner = setInterval(() => {
                if (!engineRef.current) return;
                const hx = 50 + Math.random() * (width - 100);
                const hazard = Bodies.rectangle(hx, -50, 80, 80, {
                    restitution: 0.5,
                    render: { fillStyle: 'var(--color-danger)' }
                });
                Composite.add(engineRef.current.world, hazard);
            }, 2000);
            engineRef.current.spawner = spawner;

            // Custom mouse control for player pad only on X axis
            document.addEventListener('mousemove', handleMouseMove);
        } else if (mode === 'collapse') {
            engine.gravity.y = 1;
            const elements = createUIMockBlocks(width, height);
            Composite.add(engine.world, elements);
        }

        // Add Mouse interaction for dragging
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Custom rendering for text inside bodies
        Events.on(render, 'afterRender', () => {
            const context = render.context;
            context.font = '14px Inter';
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            Composite.allBodies(engine.world).forEach(body => {
                if (body.render.text) {
                    context.fillStyle = body.render.text.color;
                    context.fillText(body.render.text.content, body.position.x, body.position.y);
                }
            });
        });

        Render.run(render);
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);
    };

    const handleMouseMove = (e) => {
        if (mode !== 'hazard' || !playerRef.current || !sceneRef.current) return;
        const rect = sceneRef.current.getBoundingClientRect();
        const x = Math.max(75, Math.min(rect.width - 75, e.clientX - rect.left));
        Matter.Body.setPosition(playerRef.current, { x, y: playerRef.current.position.y });
    };

    const createUIMockBlocks = (width, height) => {
        const Bodies = Matter.Bodies;
        const blocks = [];
        // Title
        blocks.push(Bodies.rectangle(width / 2, 100, 400, 60, { render: { fillStyle: '#e2e8f0' } }));
        // Grid items
        for (let i = 0; i < 6; i++) {
            blocks.push(Bodies.rectangle((width / 4) + (i % 2) * (width / 2), 250 + Math.floor(i / 2) * 120, 200, 100, {
                render: { fillStyle: '#cbd5e1' }
            }));
        }
        return blocks;
    };

    const cleanupMatter = () => {
        if (engineRef.current?.spawner) clearInterval(engineRef.current.spawner);
        document.removeEventListener('mousemove', handleMouseMove);

        if (renderRef.current) {
            Matter.Render.stop(renderRef.current);
            renderRef.current.canvas.remove();
            renderRef.current = null;
        }
        if (runnerRef.current) {
            Matter.Runner.stop(runnerRef.current);
            runnerRef.current = null;
        }
        if (engineRef.current) {
            Matter.Engine.clear(engineRef.current);
            engineRef.current = null;
        }
    };

    return (
        <div className="gravity-layout">
            <header className="exam-header glass-panel gravity-header">
                <div className="exam-info">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>안티그래비티 게이미피케이션 존</h2>
                </div>
                <div className="mode-selector">
                    <button className={`btn-mode ${mode === 'weakness' ? 'active' : ''}`} onClick={() => { setMode('weakness'); setScore(0); }}><Layers size={16} /> 무중력 오답 노트</button>
                    <button className={`btn-mode ${mode === 'hazard' ? 'active' : ''}`} onClick={() => { setMode('hazard'); setScore(0); }}>☔ 위험 요인 낙하</button>
                    <button className={`btn-mode ${mode === 'collapse' ? 'active' : ''}`} onClick={() => { setMode('collapse'); setScore(0); }}>💥 스트레스 붕괴</button>
                    <button className="btn-icon" onClick={initMatter} title="리셋"><RefreshCw size={20} /></button>
                </div>
            </header>

            <main className="gravity-main">
                <div className="gravity-info glass-panel mb-4">
                    {mode === 'weakness' && <p><strong>[무중력 약점 공략]</strong> 화면에 둥둥 떠다니는 내가 틀렸던 키워드를 클릭하거나 드래그하여 중앙 블랙홀에 골인시키세요!</p>}
                    {mode === 'hazard' && <p><strong>[위험요인 낙하]</strong> 떨어지는 빨간 위험 요인(예: 추락방호망 미설치)을 파란 방어막(마우스 이동)으로 튕겨내세요!</p>}
                    {mode === 'collapse' && <p><strong>[스트레스 붕괴]</strong> 학업 스트레스로 무너진 UI 블록들을 마우스로 집어던지며 스트레스를 날려버리세요!</p>}
                    <div className="score-display font-bold text-primary">Score: {score}</div>
                </div>

                <div className="canvas-container glass-panel" ref={sceneRef}>
                    {/* Matter.js canvas renders here */}
                </div>
            </main>
        </div>
    );
}
