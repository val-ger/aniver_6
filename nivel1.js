let juegoCreado = false;

function iniciarMotorJuego(nivel) {

    if (!juegoCreado) {

        kaboom({
            width: 360,
            height: 640,
            background: [15, 5, 20],
        });

        loadSprite("dani", "assets/daniel.png");
        loadSprite("valery", "assets/valery.png");
        loadSprite("instituto", "assets/fondo_instituto.png");

        // ---------------------------
        // INTRO – NARRADOR
        // ---------------------------
        scene("intro1", () => {

            // aviso horizontal
            if (height() > width()) {

                add([rect(width(), height()), color(0, 0, 0)]);

                add([
                    text("Gira tu celular\n\nPon la pantalla en horizontal\npara jugar mejor", {
                        size: 18,
                        align: "center",
                        width: width() - 40
                    }),
                    pos(width() / 2, height() / 2),
                    anchor("center")
                ]);

                add([
                    text("Luego presiona ESPACIO", { size: 12 }),
                    pos(width() / 2, height() - 40),
                    anchor("center"),
                    opacity(0.6)
                ]);

                onKeyPress("space", () => {
                    go("intro1");
                });

                return;
            }

            const historia = [
                "Había una vez una chica muy linda e inteligente...",
                "que usaba lentes y amaba estudiar.",
                "Un día inició sus clases en el instituto...",
                "y conoció a un chico muy apuesto, callado y tímido.",
                "Sus miradas se cruzaron por primera vez...",
                "y sin saberlo, se enamoraron a primera vista."
            ];

            let i = 0;

            add([rect(width(), height()), color(0, 0, 0)]);

            const texto = add([
                text(historia[i], {
                    size: 18,
                    width: width() - 40,
                    align: "center"
                }),
                pos(width() / 2, height() / 2),
                anchor("center")
            ]);

            add([
                text("Toca ESPACIO para continuar", { size: 12 }),
                pos(width() / 2, height() - 40),
                anchor("center"),
                opacity(0.6)
            ]);

            onKeyPress("space", () => {
                i++;
                if (i < historia.length) {
                    texto.text = historia[i];
                } else {
                    go("nivel1");
                }
            });

        });

        // ---------------------------
        // NIVEL 1 – EL INSTITUTO
        // ---------------------------
        scene("nivel1", () => {

            // fondo
            add([
                sprite("instituto"),
                pos(0, 0),
                scale(width() / 800, height() / 600),
                fixed()
            ]);

            // barra progreso
            add([
                rect(width(), 32),
                pos(0, 0),
                color(0, 0, 0),
                opacity(0.6),
                fixed()
            ]);

            add([
                text("Nivel 1 · El encuentro (1 / 6)", { size: 12 }),
                pos(10, 8),
                fixed()
            ]);

            const dani = add([
                sprite("dani"),
                pos(40, height() - 120),
                scale(1.4),
                area()
            ]);

            const valery = add([
                sprite("valery"),
                pos(width() - 90, height() - 120),
                scale(1.4),
                area(),
                "valery"
            ]);

            // ✨ brillo suave en Valery
            let brillo = 0;

            valery.onUpdate(() => {
                brillo += dt();
                const s = 1.4 + Math.sin(brillo * 4) * 0.05;
                valery.scale = vec2(s, s);
            });

            // -------- CONTROLES TECLADO
            const speed = 140;
            let puedeMover = false;

            onKeyDown("left", () => puedeMover && dani.move(-speed, 0));
            onKeyDown("right", () => puedeMover && dani.move(speed, 0));
            onKeyDown("up", () => puedeMover && dani.move(0, -speed));
            onKeyDown("down", () => puedeMover && dani.move(0, speed));

            // -------- BOTONES TÁCTILES
            const sizeBtn = 48;
            const margen = 12;

            function boton(x, y, txt) {

                const b = add([
                    rect(sizeBtn, sizeBtn, { radius: 10 }),
                    pos(x, y),
                    area(),
                    fixed(),
                    color(255, 255, 255),
                    opacity(0.25)
                ]);

                add([
                    text(txt, { size: 20 }),
                    pos(x + sizeBtn / 2, y + sizeBtn / 2),
                    anchor("center"),
                    fixed()
                ]);

                return b;
            }

            const leftBtn  = boton(margen, height() - sizeBtn * 2 - margen * 2, "◀");
            const rightBtn = boton(margen + sizeBtn + 8, height() - sizeBtn * 2 - margen * 2, "▶");
            const upBtn    = boton(width() - sizeBtn * 2 - margen * 2, height() - sizeBtn * 2 - margen * 2, "▲");
            const downBtn  = boton(width() - sizeBtn - margen, height() - sizeBtn * 2 - margen * 2, "▼");

            leftBtn.onUpdate(() => {
                if (leftBtn.isHovering() && puedeMover) dani.move(-speed, 0);
            });

            rightBtn.onUpdate(() => {
                if (rightBtn.isHovering() && puedeMover) dani.move(speed, 0);
            });

            upBtn.onUpdate(() => {
                if (upBtn.isHovering() && puedeMover) dani.move(0, -speed);
            });

            downBtn.onUpdate(() => {
                if (downBtn.isHovering() && puedeMover) dani.move(0, speed);
            });

            // -------- narración inicial
            const dialogosInicio = [
                "Daniel pensaba: ¿Ella está mirándome...?",
                "Es hermosa...",
                "Profesor: ¡Preséntense por favor!"
            ];

            let di = 0;

            const caja = add([
                rect(width() - 30, 90, { radius: 10 }),
                pos(15, height() - 115),
                color(0, 0, 0),
                opacity(0.8),
                fixed()
            ]);

            const texto = add([
                text(dialogosInicio[di], { size: 14, width: width() - 50 }),
                pos(width() / 2, height() - 95),
                anchor("center"),
                fixed()
            ]);

            add([
                text("ESPACIO", { size: 10 }),
                pos(width() - 60, height() - 30),
                fixed(),
                opacity(0.5)
            ]);

            onKeyPress("space", () => {
                di++;
                if (di < dialogosInicio.length) {
                    texto.text = dialogosInicio[di];
                } else {
                    destroy(caja);
                    destroy(texto);
                    puedeMover = true;
                }
            });

            // -------- encuentro con Valery
            let yaHablo = false;

            dani.onCollide("valery", () => {

                if (yaHablo) return;
                yaHablo = true;
                puedeMover = false;

                const dialogos = [
                    "Daniel: Hola... soy Daniel.",
                    "Valery: Hola, me llamo Valery.",
                    "Y así comenzó su primer hola..."
                ];

                let i2 = 0;

                const c2 = add([
                    rect(width() - 30, 90, { radius: 10 }),
                    pos(15, height() - 115),
                    color(0, 0, 0),
                    opacity(0.85),
                    fixed()
                ]);

                const t2 = add([
                    text(dialogos[i2], { size: 14, width: width() - 50 }),
                    pos(width() / 2, height() - 95),
                    anchor("center"),
                    fixed()
                ]);

                onKeyPress("space", () => {
                    i2++;
                    if (i2 < dialogos.length) {
                        t2.text = dialogos[i2];
                    } else {

                        // botón siguiente nivel
                        const b = add([
                            rect(200, 44, { radius: 12 }),
                            pos(width() / 2, height() / 2),
                            anchor("center"),
                            area(),
                            fixed(),
                            color(255, 100, 160)
                        ]);

                        add([
                            text("Siguiente nivel ▶", { size: 14 }),
                            pos(b.pos),
                            anchor("center"),
                            fixed()
                        ]);

                        b.onClick(() => {
                            // aquí luego pondrás nivel 2
                            // go("intro2");
                        });

                    }
                });

            });

        });

        juegoCreado = true;
    }

    go("intro1");
}
