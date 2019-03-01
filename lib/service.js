const fs = require('fs');
const express = require('express');

class ExplorerUI {
    constructor(options) {
        // Write the node config to an angular constant module that gets evaluated at app start up.
        // Clone options and remove `node` to avoid JSON.stringify circular ref.
        const config = Object.assign({}, options);
        delete config.node;

        this.routePrefix = config.routePrefix;
        config.fullNodes = config.fullNodes;
        fs.writeFileSync(`${__dirname  }/../www/js/ows-node-config.js`, `angular.module('owsExplorerApp').constant('nodeConfig', ${  JSON.stringify(config, null, 2)  });`);

        this.app = express();
    }

    async start() {
        this.indexFile = this.filterIndexHTML(fs.readFileSync(`${__dirname  }/../www/index-template.html`, {encoding: 'utf8'}));
        this.app.use(express.static(`${__dirname  }/../www`));
        // if not in found, fall back to indexFile (404 is handled client-side)
        this.app.use((req, res) => {
            res.setHeader('Content-Type', 'text/html');
            res.send(this.indexFile);
        });

        this.server = this.app.listen(3000);
    }

    filterIndexHTML(data) {
        let transformed = data;
        if (this.routePrefix !== '') {
            transformed = transformed.replace('<base href="/"', `<base href="${  this.routePrefix  }/"`);
        }
        return transformed;
    }
}

module.exports = ExplorerUI;
