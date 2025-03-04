/*
    Polyglot

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/polyglot
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as projects from "./projects.js";

export function createLocale(projectId, localeCode, localeData, options = {}) {
    projects.editProject(projectId, function(data) {
        data.locales ||= {};

        if (data.locales[localeCode]) {
            throw new ReferenceError("The provided locale code already exists");
        }

        if (options.makeSource) {
            localeData.isSource = true;

            Object.keys(data.locales).forEach(function(localeCode) {
                delete data.locales[localeCode].isSource;
            });
        }

        data.locales[localeCode] = localeData;
    });

    projects.emit("localechanged", {localeCode});
}

export function getLocales(projectId) {
    return projects.getProjects()[projectId].locales || {};
}