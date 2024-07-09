/*
    Polyglot

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/polyglot
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as $g from "https://opensource.liveg.tech/Adapt-UI/src/adaptui.js";
import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";

import * as main from "./main.js";

window.$g = $g;

astronaut.unpack();

$g.waitForLoad().then(function() {
    return $g.l10n.selectLocaleFromResources({
        "en_GB": "locales/en_GB.json"
    });
}).then(function(locale) {
    window._ = function() {
        return locale.translate(...arguments);
    };

    $g.theme.setProperty("primaryHue", "120");
    $g.theme.setProperty("primarySaturation", "60%");
    $g.theme.setProperty("primaryLightness", "40%");
    $g.theme.setProperty("secondaryHue", "120");
    $g.theme.setProperty("secondarySaturation", "60%");
    $g.theme.setProperty("secondaryLightness", "30%");

    $g.sel("title").setText(_("polyglot"));

    astronaut.render(main.MainScreen({showing: true}) ());
});