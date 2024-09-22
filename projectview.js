/*
    Polyglot

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/polyglot
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";

import * as projects from "./projects.js";

export var ProjectViewScreen = astronaut.component("ProjectViewScreen", function(props, children) {
    var projectsList = null;

    var backButton = IconButton({icon: "back", alt: _("back"), bind: "back"}) ();
    var addNewLocaleButton = Button() (_("locales_addNewLocale"));
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

    addNewLocaleButton.on("click", function() {
        astronaut.addEphemeral(AddLocaleDialog() ()).then((dialog) => dialog.dialogOpen());
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
                    addNewLocaleButton
                )
            )
        )
    );
});

export var AddLocaleDialog = astronaut.component("AddLocaleDialog", function(props, children, inter) {
    var localeCodeInput = Input({
        placeholder: _("addLocaleDialog_localeCode_example"),
        styles: {
            "font-family": "var(--fontCode)"
        }
    }) ();

    var fullLanguageNameInput = Input({placeholder: _("addLocaleDialog_fullLanguageName_example")}) ();
    var shortLanguageNameInput = Input({placeholder: _("addLocaleDialog_shortLanguageName_example")}) ();

    var textDirectionInput = SelectionInput({value: "ltr"}) (
        SelectionInputOption({value: "ltr"}) (_("addLocaleDialog_textDirection_ltr")),
        SelectionInputOption({value: "rtl"}) (_("addLocaleDialog_textDirection_rtl"))
    );

    var addButton = Button() (_("add"));

    var dialog = Dialog (
        DialogContent (
            Heading(1) (_("addLocaleDialog_title")),
            Label (
                Text(_("addLocaleDialog_localeCode")),
                localeCodeInput
            ),
            Label (
                Text(_("addLocaleDialog_fullLanguageName")),
                fullLanguageNameInput
            ),
            Label (
                Text(_("addLocaleDialog_shortLanguageName")),
                shortLanguageNameInput
            ),
            Label (
                Text(_("addLocaleDialog_textDirection")),
                textDirectionInput
            )
        ),
        ButtonRow("end") (
            addButton,
            Button({mode: "secondary", bind: "close"}) (_("cancel"))
        )
    );

    function areRequiredFieldsSatisfied() {
        if (localeCodeInput.getValue().trim() == "") {
            return false;
        }

        if (fullLanguageNameInput.getValue().trim() == "") {
            return false;
        }

        return true;
    }

    function checkCanAdd() {
        if (areRequiredFieldsSatisfied()) {
            addButton.removeAttribute("disabled");
        } else {
            addButton.addAttribute("disabled");
        }
    }

    localeCodeInput.on("input", checkCanAdd);
    fullLanguageNameInput.on("input", checkCanAdd);

    checkCanAdd();

    return dialog;
});