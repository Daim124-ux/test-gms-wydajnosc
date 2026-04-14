/* Verge3D Main Entry with Bridge */

'use strict';

window.v3dApp = null; // Global reference for the bridge

window.addEventListener('load', e => {
    const params = v3d.AppUtils.getPageParams();
    createApp({
        containerId: 'v3d-container',
        fsButtonId: 'fullscreen-button', 
        sceneURL: params.load || 'scene.gltf', // Use renamed scene
        logicURL: params.logic || 'visual_logic.js',
    });
});

async function createApp({containerId, fsButtonId = null, sceneURL, logicURL = ''}) {
    if (!sceneURL) {
        console.log('No scene URL specified');
        return;
    }

    v3d.Cache.enabled = true;

    let PL = null, PE = null;
    if (v3d.AppUtils.isXML(logicURL)) {
        const PUZZLES_DIR = '/puzzles/';
        const logicURLJS = logicURL.match(/(.*)\.xml$/)[1] + '.js';
        PL = await new v3d.PuzzlesLoader().loadEditorWithLogic(PUZZLES_DIR, logicURLJS);
        PE = v3d.PE;
    } else if (v3d.AppUtils.isJS(logicURL)) {
        PL = await new v3d.PuzzlesLoader().loadLogic(logicURL);
    }

    let initOptions = { useFullscreen: true };
    if (PL) {
        initOptions = PL.execInitPuzzles({ container: containerId }).initOptions;
    }
    
    // Ensure we don't try to load .xz if it doesn't exist
    // sceneURL = initOptions.useCompAssets ? `${sceneURL}.xz` : sceneURL;

    const disposeFullscreen = prepareFullscreen(containerId, fsButtonId,
            initOptions.useFullscreen);
    const preloader = new v3d.SimplePreloader({ container: containerId });

    const app = createAppInstance(containerId, initOptions, preloader, PE);
    window.v3dApp = app; // Expose to window for iframe access
    
    app.addEventListener('dispose', () => disposeFullscreen && disposeFullscreen());

    if (initOptions.preloaderStartCb) initOptions.preloaderStartCb();
    
    app.loadScene(sceneURL, () => {
        app.enableControls();
        app.run();

        if (PE) PE.updateAppInstance(app);
        if (PL) PL.init(app, initOptions);

        runCode(app, PL);
        
        // Signal parent that we are ready
        if (window.parent) {
            window.parent.postMessage({ type: 'VERGE_READY' }, '*');
        }
    }, null, (error) => {
        console.error(`Can't load the scene ${sceneURL}`, error);
    });

    return { app, PL };
}

function createAppInstance(containerId, initOptions, preloader, PE) {
    const ctxSettings = { alpha: true, antialias: true };
    const app = new v3d.App(containerId, ctxSettings, preloader);
    
    // Bridge setup
    app.ExternalInterface = {};
    
    // Register procedures from Puzzles
    app.ExternalInterface.registerProcedure = function(name, callback) {
        console.log('[Bridge] Registering procedure:', name);
        app.ExternalInterface[name] = callback;
    };

    // Universal run command
    app.ExternalInterface.run = function(command, value) {
        console.log('[Bridge] Command start:', command);
        
        // 1. Check procedures
        if (typeof app.ExternalInterface[command] === 'function') {
            console.log('[Bridge] Calling procedure:', command);
            app.ExternalInterface[command](value);
            return;
        }
        
        // 2. Check PARENT document
        try {
            if (window.parent && window.parent.document) {
                const parentElem = window.parent.document.getElementById(command);
                if (parentElem) {
                    console.log('[Bridge] Success! Clicking PARENT elem:', command);
                    parentElem.click();
                    return;
                }
            }
        } catch (e) {
            console.warn('[Bridge] Parent access error:', e);
        }

        // 3. Fallback: LOCAL
        const elem = document.getElementById(command);
        if (elem) {
            console.log('[Bridge] Success! Clicking LOCAL elem:', command);
            elem.click();
        } else {
            console.error('[Bridge] ERROR: Could not find element in parent or local:', command);
        }
    };

    return app;
}

function prepareFullscreen(containerId, fsButtonId, useFullscreen) {
    const container = document.getElementById(containerId);
    const fsButton = document.getElementById(fsButtonId);
    if (!fsButton) return null;
    
    const changeFs = () => {
        const elem = document.fullscreenElement;
        fsButton.classList.add(elem ? 'fullscreen-close' : 'fullscreen-open');
        fsButton.classList.remove(elem ? 'fullscreen-open' : 'fullscreen-close');
    };

    fsButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', changeFs);
    return () => {
        document.removeEventListener('fullscreenchange', changeFs);
    };
}

function runCode(app, puzzles) {
    // Custom logic can go here
}
