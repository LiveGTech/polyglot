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
        Page(true) (
            Section (
                Heading(1) (_("locales")),
                Cards (
                    Card (
                        Heading({
                            level: 2,
                            styles: {
                                "font-size": "var(--sizeH4)"
                            }
                        }) ("العربية (الإمارات العربية المتحدة)"),
                        Paragraph() ("40% complete · 3 flagged"),
                        ProgressIndicator({mode: "secondary", value: 0.4}) ()
                    ),
                    Card (
                        Heading({
                            level: 2,
                            styles: {
                                "font-size": "var(--sizeH4)"
                            }
                        }) ("English (United Kingdom)"),
                        Paragraph() ("Source language"),
                        ProgressIndicator({mode: "secondary", value: 1}) ()
                    ),
                    Card (
                        Heading({
                            level: 2,
                            styles: {
                                "font-size": "var(--sizeH4)"
                            }
                        }) ("English (United States)"),
                        Paragraph() ("15% complete · Based on English (United Kingdom)"),
                        ProgressIndicator({
                            mode: "secondary",
                            value: 0.15
                        }) ()
                    ),
                    Card (
                        Heading({
                            level: 2,
                            styles: {
                                "font-size": "var(--sizeH4)"
                            }
                        }) ("Français (France)"),
                        Paragraph() ("90% complete"),
                        ProgressIndicator({mode: "secondary", value: 0.9}) ()
                    ),
                    Card (
                        Heading({
                            level: 2,
                            styles: {
                                "font-size": "var(--sizeH4)"
                            }
                        }) ("Русский (Россия)"),
                        Paragraph() ("45% complete · 2 flagged"),
                        ProgressIndicator({mode: "secondary", value: 0.45}) ()
                    ),
                    Card (
                        Heading({
                            level: 2,
                            styles: {
                                "font-size": "var(--sizeH4)"
                            }
                        }) ("中文（中国）"),
                        Paragraph() ("60% complete"),
                        ProgressIndicator({mode: "secondary", value: 0.6}) ()
                    )
                ),
                ButtonRow (
                    Button() ("Add new locale")
                )
            )
        )
    );
});