/*
    Polyglot

    Copyright (C) LiveG. All Rights Reserved.

    https://opensource.liveg.tech/polyglot
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";

import * as projects from "./projects.js";
import * as locales from "./locales.js";

export var ProjectViewScreen = astronaut.component("ProjectViewScreen", function(props, children) {
    var projectsList = null;

    var backButton = IconButton({icon: "back", alt: _("back"), bind: "back"}) ();
    var addNewLocaleButton = Button() (_("locales_addNewLocale"));
    var projectTitle = TextFragment() ();
    var localeCardContainer = Container() ();

    function updateLocalesList() {
        var localeCodes = Object.keys(locales.getLocales(props.projectId));

        if (localeCodes.length == 0) {
            localeCardContainer.clear().add(
                Message (
                    Icon("language", "dark embedded") (),
                    Heading(2) (_("locales_empty_title")),
                    Paragraph() (_("locales_empty_description")),
                    ButtonRow (
                        addNewLocaleButton
                    )
                )
            );

            return;
        }

        localeCardContainer.clear().add(
            Cards() (
                ...localeCodes.map(function(localeCode) {
                    var locale = locales.getLocales(props.projectId)[localeCode];
                    var stringCount = Object.keys(locale.strings || {}).length;

                    return Card (
                        Heading({
                            level: 2,
                            styles: {
                                "font-size": "var(--sizeH4)"
                            }
                        }) (locale.name),
                        Paragraph() ([
                            locale.isSource ? _("locales_status_sourceLanguage") : null,
                            _("locales_status_stringCount", {count: stringCount})
                        ].filter((part) => part).join(" · ")),
                        ProgressIndicator({mode: "secondary", value: 0}) ()
                    );
                })
            ),
            ButtonRow (
                addNewLocaleButton
            )
        );
    }

    function update() {
        projectsList = projects.getProjects();

        var project = projects.getLocalisedProjectMetadata(projectsList[props.projectId]);

        if (project.zoneName.trim().length == 0) {
            projectTitle.setText(project.name);
        } else {
            projectTitle.clear().add(
                Text(project.name),
                Text(_("projects_zoneSeparator")),
                Text(project.zoneName)
            );
        }

        updateLocalesList();
    }

    addNewLocaleButton.on("click", function() {
        astronaut.addEphemeral(AddLocaleDialog({projectId: props.projectId}) ()).then((dialog) => dialog.dialogOpen());
    });

    projects.on("projectchanged", function() {
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
                localeCardContainer
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

    var makeSourceInput = CheckboxInput({value: Object.keys(locales.getLocales(props.projectId) || {}).length == 0}) ();

    var errorMessage = Paragraph() ();

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
            ),
            Label (
                makeSourceInput,
                Text(_("addLocaleDialog_makeSource"))
            ),
            errorMessage
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

    addButton.on("click", function() {
        if (!areRequiredFieldsSatisfied()) {
            errorMessage.setText(_("addLocaleDialog_incompleteError"));
            return;
        }

        var localeCode = localeCodeInput.getValue().trim();

        if (locales.getLocales(props.projectId)[localeCode]) {
            errorMessage.setText(_("addLocaleDialog_alreadyExistsError"));
            return;
        }

        locales.createLocale(props.projectId, localeCode, {
            name: fullLanguageNameInput.getValue().trim(),
            nameShort: shortLanguageNameInput.getValue().trim() || undefined,
            textDirection: textDirectionInput.getValue()
        }, {
            makeSource: makeSourceInput.getValue()
        });

        dialog.dialogClose();
    });

    checkCanAdd();

    return dialog;
});