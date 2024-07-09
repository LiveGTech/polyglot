/*
    Polyglot

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/polyglot
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";

export var ProjectsPage = astronaut.component("ProjectsPage", function(props, children) {
    return Page(props) (
        Section (
            Heading(1) (_("projects")),
            Cards() (
                Card (
                    Heading(2) (Link() ("Example project")),
                    Paragraph() (
                        BoldTextFragment() ("LiveG Technologies"),
                        Text(" · 5 days ago · This is an example project.")
                    )
                ),
                Card (
                    Heading(2) (Link() ("Example project")),
                    Paragraph() (
                        BoldTextFragment() ("LiveG Technologies"),
                        Text(" · 5 days ago · This is an example project.")
                    )
                ),
                Card (
                    Heading(2) (Link() ("Example project")),
                    Paragraph() (
                        BoldTextFragment() ("LiveG Technologies"),
                        Text(" · 5 days ago · This is an example project.")
                    )
                )
            )
        )
    );
});

export var MainScreen = astronaut.component("MainScreen", function(props, children) {
    var homePage = ProjectsPage({showing: true}) ();

    return Screen(props) (
        Header (
            Text(_("polyglot"))
        ),
        homePage
    );
});