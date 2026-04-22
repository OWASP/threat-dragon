const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const maxDiffPixelRatio = 0.01;
const pixelmatchThreshold = 0.1;
const visualDir = path.join('tests', 'e2e', 'visual');
const baselineDir = path.join(visualDir, 'baselines');
const diffDir = path.join(visualDir, 'diffs');

const ensureDirectory = (dirPath) => {
    fs.mkdirSync(dirPath, { recursive: true });
};

const sanitizeSnapshotName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '-');

const findFile = (dirPath, filename) => {
    if (!fs.existsSync(dirPath)) {
        return null;
    }

    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
        const entryPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            const nested = findFile(entryPath, filename);
            if (nested) {
                return nested;
            }
        } else if (entry.name === filename) {
            return entryPath;
        }
    }

    return null;
};

const readPng = (filePath) => PNG.sync.read(fs.readFileSync(filePath));

const compareSnapshot = async ({ name, updateSnapshots }, config) => {
    const snapshotName = sanitizeSnapshotName(name);
    const filename = `${snapshotName}.png`;
    const screenshotsFolder = path.resolve(config.projectRoot, config.screenshotsFolder);
    const baselinePath = path.resolve(config.projectRoot, baselineDir, filename);
    const diffPath = path.resolve(config.projectRoot, diffDir, filename);
    const actualPath = findFile(screenshotsFolder, filename);

    if (!actualPath) {
        throw new Error(`No screenshot found for visual snapshot "${snapshotName}" in ${screenshotsFolder}`);
    }

    ensureDirectory(path.dirname(baselinePath));
    ensureDirectory(path.dirname(diffPath));

    if (updateSnapshots || !fs.existsSync(baselinePath)) {
        fs.copyFileSync(actualPath, baselinePath);
        return {
            actualPath,
            baselinePath,
            diffPath: null,
            diffPixels: 0,
            diffPixelRatio: 0,
            maxDiffPixelRatio,
            updated: true
        };
    }

    const baseline = readPng(baselinePath);
    const actual = readPng(actualPath);

    if (baseline.width !== actual.width || baseline.height !== actual.height) {
        throw new Error(
            `Snapshot "${snapshotName}" size changed: baseline ${baseline.width}x${baseline.height}, actual ${actual.width}x${actual.height}`
        );
    }

    const diff = new PNG({ width: baseline.width, height: baseline.height });
    const { default: pixelmatch } = await import('pixelmatch');
    const diffPixels = pixelmatch(
        baseline.data,
        actual.data,
        diff.data,
        baseline.width,
        baseline.height,
        { threshold: pixelmatchThreshold, includeAA: false }
    );
    const diffPixelRatio = diffPixels / (baseline.width * baseline.height);

    if (diffPixels > 0) {
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
    } else if (fs.existsSync(diffPath)) {
        fs.rmSync(diffPath);
    }

    return {
        actualPath,
        baselinePath,
        diffPath,
        diffPixels,
        diffPixelRatio,
        maxDiffPixelRatio,
        updated: false
    };
};

module.exports = {
    register(on, config) {
        on('task', {
            'visual:compareSnapshot': (options) => compareSnapshot(options, config)
        });
    }
};
