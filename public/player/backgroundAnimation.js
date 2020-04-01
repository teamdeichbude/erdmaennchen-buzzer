/*eslint-env browser */
/*global jQuery, PIXI, TWEEN */

jQuery(function ()
{
    let themeColors = [
        0x202732,
        0x216583,
        0xfff1c1,
        0xf76262,
        0x3ca87f,
        0x202732,

        // 0x202732,
        // 0x1b262c,
        // 0x0f4c81,
        // 0xed6663,
        // 0xffa372,

        // 0x28544b,
        // 0xacbd86,
        // 0xffd6a0,
        // 0xffa06f,

        // 0xeaa81b,
        // 0xc95501,
        // 0x7d0000,
        // 0x012c0b,
    ];


    // Setup the animation loop.
    function animate(time)
    {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);


    let jqBackgroundWrapper = jQuery(".backgroundanimationwrapper");

    let screenWidth = jqBackgroundWrapper.width(),
        screenHeight = jqBackgroundWrapper.height();

    const pixi = new PIXI.Application({
        width: screenWidth, height: screenHeight, backgroundColor: 0x202732, resolution: window.devicePixelRatio || 1,
    });
    const earthman = PIXI.Sprite.from('/assets/img/earthmanMask.png');
    earthman.width = pixi.renderer.width / 2 / window.devicePixelRatio;
    earthman.height = earthman.width;


    // earthman.x = screenWidth / 2;
    // earthman.y = screenHeight / 2;

    debugger
    // earthman.position.x = (pixi.renderer.width / 2) - (earthman.width / 2) / window.devicePixelRatio;
    // earthman.position.y = (pixi.renderer.height / 2) - (earthman.height / 2);
    console.log(earthman);


    pixi.stage.addChild(earthman);

    jqBackgroundWrapper.append(pixi.view);

    let backgroundColorContainer = new PIXI.Container();

    backgroundColorContainer.pivot.x = screenWidth * 0.5;
    backgroundColorContainer.pivot.y = screenHeight * 0.5;

    let bgLayers = [];
    for (let c in themeColors)
    {
        let layer = createBackgroundLayer(themeColors[c]);
        bgLayers.push(layer);
        backgroundColorContainer.addChild(layer);
    }

    pixi.stage.addChild(backgroundColorContainer);

    let maskColorContainer = new PIXI.Container();


    let bgMasks = [];
    for (let c in themeColors)
    {
        let layer = createBackgroundLayer(themeColors[c]);
        bgMasks.push(layer);
        maskColorContainer.addChild(layer);
    }

    maskColorContainer.mask = earthman;

    pixi.stage.addChild(maskColorContainer);


    for (let i = bgLayers.length; i > 0; i--)
    {
        let layer = bgLayers[i - 1];
        const coords = { x: layer.x, y: layer.y, rot: 0.8 }; // Start at (0, 0)
        const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
            .to({ x: screenWidth, y: 0, rot: 0 }, 1500) // Move to (300, 200) in 1 second.
            .delay((bgLayers.length - i - 1) * 50 * i)
            // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
            .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
            .onUpdate(() =>
            { // Called after tween.js updates 'coords'.
                // Move 'box' to the position described by 'coords' with a CSS translation.
                layer.x = coords.x;
                layer.y = coords.y;
                // backgroundColorContainer.rotation = coords.rot;
            })
            .start(); // Start the tween immediately.
    }



    for (let i = bgMasks.length; i > 0; i--)
    {
        let layer = bgMasks[i - 1];
        const coords = { x: layer.x, y: layer.y, rot: 0.5 }; // Start at (0, 0)
        const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
            .to({ x: screenWidth, y: 0, rot: 0 }, 1500) // Move to (300, 200) in 1 second.
            .delay(((bgMasks.length - i - 1) * 50 * i) + 700)
            // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
            .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
            .onUpdate(() =>
            { // Called after tween.js updates 'coords'.
                // Move 'box' to the position described by 'coords' with a CSS translation.
                layer.x = coords.x;
                layer.y = coords.y;
                // maskColorContainer.rotation = coords.rot;

            })
            .onComplete(function ()
            {
                jQuery("#content").addClass("show");
            })
            .start(); // Start the tween immediately.
    }

    function createBackgroundLayer(color)
    {
        let newLayer = new PIXI.Graphics();
        newLayer.beginFill(color);
        newLayer.drawRect(0, 0, screenWidth, screenHeight);
        newLayer.endFill();
        return newLayer;
    }

});