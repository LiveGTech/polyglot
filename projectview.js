/*
    Polyglot

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/polyglot
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";

import * as polyglot from "./script.js";
import * as projects from "./projects.js";

export var ProjectViewPage = astronaut.component("ProjectViewPage", function(props, children) {
    var projectsList = null;

    var backButton = IconButton("back", _("back")) ();
    var projectTitle = TextFragment() ();

    function update() {
        projectsList = projects.getProjects();

        var project = projects.getLocalisedProjectMetadata(projectsList[props.projectId]);

        if (project.zoneName.trim().length == 0) {
            projectTitle.setText(project.name);

            return;
        }

        projectTitle.clear().add(
            Text(project.name),
            Text(_("projects_zoneSeparator")),
            Text(project.zoneName)
        );
    }

    backButton.on("click", function() {
        polyglot.mainScreen.screenBack();
    });

    projects.on("projectschanged", function() {
        update();
    });

    update();

    return Screen(props) (
        Header (
            backButton,
            projectTitle
        ),
        Page(true) ()
    );
});