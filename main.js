/*
    Polyglot

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/polyglot
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";

import * as polyglot from "./script.js";
import * as projects from "./projects.js";
import * as projectView from "./projectview.js";

export var ProjectsPage = astronaut.component("ProjectsPage", function(props, children) {
    var projectsList = null;

    var projectCardContainer = Container() ();

    function update() {
        projectsList = projects.getProjects();

        projectCardContainer.clear().add(
            Cards() (
                ...Object.keys(projectsList).map(function(projectId) {
                    var project = projects.getLocalisedProjectMetadata(projectsList[projectId]);
        
                    var link = project.zoneName.trim().length > 0 ? Link() (
                        BoldTextFragment() (project.name),
                        Text(_("projects_zoneSeparator")),
                        Text(project.zoneName)
                    ) : Link() (
                        BoldTextFragment() (project.name)
                    );
        
                    var descriptionParts = [];
        
                    if (project.owner.trim().length > 0) {
                        descriptionParts.push(BoldTextFragment() (project.owner));
                    }
        
                    if (project.description.trim().length > 0) {
                        descriptionParts.push(Text(project.description));
                    }

                    link.on("click", function() {
                        var view = projectView.ProjectViewPage({projectId}) ();

                        polyglot.projectViewContainer.add(view);

                        view.screenForward();
                    });
        
                    var card = Card (
                        Heading({
                            level: 2,
                            styles: {
                                "font-weight": "normal"
                            }
                        }) (link),
                        Paragraph() (
                            ...descriptionParts.map((part, i) => i == 0 ? [part] : [Text(_("projects_descriptionSeparator")), part]).flat()
                        )
                    );
        
                    return card;
                })
            )
        );
    }

    projects.on("projectschanged", function() {
        update();
    });

    update();

    return Page(props) (
        Section (
            Heading(1) (_("projects")),
            projectCardContainer
        )
    );
});

export var NewProjectScreen = astronaut.component("NewProjectScreen", function(props, children) {
    var backButton = IconButton("back", _("back")) ();

    var nameInput = Input() ();
    var zoneNameInput = Input({placeholder: _("optional")}) ();
    var ownerInput = Input() ();
    var descriptionInput = TextInputArea({placeholder: _("optional")}) ();

    var typeRadioButtons = {
        resourceFiles: RadioButtonInput({group: "projects_new_projectType"}) (),
        properties: RadioButtonInput({group: "projects_new_projectType"}) ()
    };

    var errorMessage = Paragraph() ();

    var createButton = Button() (_("create"));
    var cancelButton = Button("secondary") (_("cancel"));

    var screen = Screen(props) (
        Header (
            backButton,
            Text(_("projects_new"))
        ),
        Page(true) (
            Section (
                Heading() (_("projects_new_title")),
                Label (
                    Text(_("projects_new_projectName")),
                    nameInput
                ),
                Label (
                    Text(_("projects_new_projectZoneName")),
                    zoneNameInput
                ),
                Label (
                    Text(_("projects_new_projectOwner")),
                    ownerInput
                ),
                Label (
                    Text(_("projects_new_projectDescription")),
                    descriptionInput
                )
            ),
            Section (
                Label (
                    Paragraph() (_("projects_new_projectType")),
                    Label (
                        typeRadioButtons.resourceFiles,
                        Container (
                            BoldTextFragment() (_("projects_new_projectType_resourceFiles_title")),
                            LineBreak() (),
                            Text(_("projects_new_projectType_resourceFiles_description"))
                        )
                    ),
                    Label (
                        typeRadioButtons.properties,
                        Container (
                            BoldTextFragment() (_("projects_new_projectType_properties_title")),
                            LineBreak() (),
                            Text(_("projects_new_projectType_properties_description"))
                        )
                    )
                )
            ),
            Section (
                errorMessage,
                ButtonRow (createButton, cancelButton)
            )
        )
    );

    function clear() {
        nameInput.setValue("");
        zoneNameInput.setValue("");
        ownerInput.setValue("");
        descriptionInput.setValue("");

        typeRadioButtons.resourceFiles.setValue(true);

        errorMessage.setText("");
    }

    backButton.on("click", function() {
        clear();
        polyglot.mainScreen.screenBack();
    });

    createButton.on("click", function() {
        var locale = $g.l10n.getSystemLocaleCode();

        if (
            nameInput.getValue().trim() == "" ||
            ownerInput.getValue().trim() == ""
        ) {
            errorMessage.setText(_("projects_new_incompleteError"));

            return;
        }

        projects.createProject({
            name: {[locale]: nameInput.getValue()},
            zoneName: {[locale]: zoneNameInput.getValue()},
            owner: {[locale]: ownerInput.getValue()},
            description: {[locale]: descriptionInput.getValue()},
            fallbackLocale: locale,
            type: Object.keys(typeRadioButtons).find(function(type) {
                if (typeRadioButtons[type].getValue()) {
                    return true;
                }
    
                return false;
            }) || "resourceFiles"
        });

        clear();
        polyglot.mainScreen.screenBack();
    });

    cancelButton.on("click", function() {
        clear();
        polyglot.mainScreen.screenBack();
    });

    clear();

    return screen;
})

export var MainScreen = astronaut.component("MainScreen", function(props, children) {
    var homePage = ProjectsPage({showing: true}) ();

    var newProjectButton = HeaderActionButton({icon: "add", alt: _("projects_new")}) ();

    newProjectButton.on("click", function() {
        polyglot.newProjectScreen.screenForward();
    });

    return Screen(props) (
        Header (
            Text(_("polyglot")),
            newProjectButton
        ),
        homePage
    );
});