/*
    Polyglot

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/polyglot
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as $g from "https://opensource.liveg.tech/Adapt-UI/src/adaptui.js";

var eventCallbacks = {
    "projectchanged": [],
    "localechanged": []
};

export function on(event, callback) {
    eventCallbacks[event].push(callback);
}

export function emit(event, data = {}) {
    eventCallbacks[event].forEach((callback) => callback(data));
}

export function getProjects() {
    return JSON.parse(localStorage.getItem("liveg_polyglot_projects") || "{}");
}

export function setProjectData(id, data) {
    var projects = getProjects();

    projects[id] = data;

    localStorage.setItem("liveg_polyglot_projects", JSON.stringify(projects));

    emit("projectchanged", {projectId: id});
}

export function createProject(data) {
    setProjectData($g.core.generateKey(), data);
}

export function editProject(id, callback) {
    var data = getProjects()[id];
    var result = callback(data);

    setProjectData(id, result ?? data);

    return result ?? data;
}

export function getLocalisedProjectProperty(project, property) {
    return project[property][$g.l10n.getSystemLocaleCode()] || project[property][project.fallbackLocale];
}

export function getLocalisedProjectMetadata(project) {
    var localisedProject = {...project};

    ["name", "zoneName", "owner", "description"].forEach(function(property) {
        localisedProject[property] = getLocalisedProjectProperty(project, property) || "";
    });

    return localisedProject;
}