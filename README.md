OWS Explorer
======

A blockchain explorer web application service for the following:

- [OWS Explorer API](https://github.com/owstack/explorer-api)

## Quick Start

Please see the guide at [TBS]() for information about getting a block explorer running. This is only the front-end component of the block explorer, and is packaged together with all of the necessary components in the following:

- [Kubernetes](https://github.com/owstack/kubernetes)

Open a web browser to `http://localhost:3000/`

## Development

To brand and build OWS Explorer locally:

```
$ npm run apply
```

A watch task is also available:

```
$ npm run watch
```

## Configuring nodes

By default, the `default` in `config/default.js` is as follows.  Environment variables must be set to configure.

```
{
    routePrefix: process.env.PROXY_PATH || '',
    fullNodes: [
        {
            url: process.env.EXPLORER_API_URL || 'https://dev.owstack.org',
            apiPrefix: process.env.EXPLORER_API_PROXY_PATH || '/api/explorer/btc'
        }
    ]
}
```

## Multilanguage support

OWS Explorer uses [angular-gettext](http://angular-gettext.rocketeer.be) for multilanguage support.

To enable a text to be translated, add the ***translate*** directive to html tags. See more details [here](http://angular-gettext.rocketeer.be/dev-guide/annotate/). Then, run:

```
grunt compile
```

This action will create a template.pot file in ***po/*** folder. You can open it with some PO editor ([Poedit](http://poedit.net)). Read this [guide](http://angular-gettext.rocketeer.be/dev-guide/translate/) to learn how to edit/update/import PO files from a generated POT file. PO file will be generated inside po/ folder.

If you make new changes, simply run **grunt compile** again to generate a new .pot template and the angular javascript ***js/translations.js***. Then (if use Poedit), open .po file and choose ***update from POT File*** from **Catalog** menu.

Finally changes your default language from ***www/src/js/config***

```
gettextCatalog.currentLanguage = 'es';
```

This line will take a look at any *.po files inside ***po/*** folder, e.g.
**po/es.po**, **po/nl.po**. After any change do not forget to run ***grunt
compile***.


## Note

For more details about the [Explorer API](https://github.com/owstack/explorer-api) configuration and end-points, go to [Explorer API GitHub repository](https://github.com/owstack/explorer-api).

## Contribute

Contributions and suggestions are welcomed at the [OWS Explorer GitHub repository](https://github.com/owstack/ows-explorer).


## License

Code released under [the MIT license](https://github.com/owstack/ows-explorer/blob/master/LICENSE).

Copyright 2019 Open Wallet Stack.
