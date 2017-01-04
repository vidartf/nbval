// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.


define([
    'notebook/js/celltoolbar',
    'base/js/dialog',
], function(celltoolbar, dialog) {
    "use strict";

    var CellToolbar = celltoolbar.CellToolbar;

    var nbval_preset = [];

    function edit_sanitizers(cell) {
        var message =
            "Edit the cell specific sanitizers below, according to the specs for the " +
            "sanitizer files.";
        var ns = cell.metadata.nbval;
        var sanitizers = (ns === undefined || ns.extra_sanitizers === undefined) ? '': ns.extra_sanitizers;
        var textarea = $('<textarea/>')
            .attr('rows', '13')
            .attr('cols', '80')
            .attr('name', 'sanitizers')
            .text(sanitizers);

        var dialogform = $('<div/>').attr('title', 'Edit the metadata')
            .append(
                $('<form/>').append(
                    $('<fieldset/>').append(
                        $('<label/>')
                        .attr('for','sanitizers')
                        .text(message)
                        )
                        .append($('<br/>'))
                        .append(textarea)
                    )
            );
        var modal_obj = dialog.modal({
            title: "Edit cell nbval output sanitizers",
            body: dialogform,
            default_button: "Cancel",
            buttons: {
                Cancel: {},
                Edit: { class : "btn-primary",
                    click: function() {
                        if (cell.metadata.nbval === undefined) {
                            cell.metadata.nbval = {};
                        }
                        cell.metadata.nbval.extra_sanitizers = textarea[0].value;
                    }
                }
            },
            notebook: cell.notebook,
            keyboard_manager: cell.keyboard_manager
        });
    }

    var add_sanitizer_dialog_button = function(div, cell) {
        var button_container = $(div);
        var button = $('<button />')
            .addClass('btn btn-default btn-xs')
            .text('Extra Sanitizers')
            .click( function() {
              edit_sanitizers(cell);
              return false;
            });
        button_container.append(button);
    };

    var checkbox_test = CellToolbar.utils.checkbox_ui_generator('Check outputs',
         // setter
         function(cell, value){
             // we check that the nbval namespace exist and create it if needed
             if (cell.metadata.nbval === undefined) {
                 cell.metadata.nbval = {};
             }
             // set the value
             cell.metadata.nbval.compare_outputs = value;
             },
         // getter
         function(cell){
             var ns = cell.metadata.nbval;
             // if the slideshow namespace does not exist return `undefined`
             // (will be interpreted as `false` by checkbox) otherwise
             // return the value
             return (ns === undefined) ? undefined: ns.compare_outputs;
             }
    );


    var load_ipython_extension = function () {
        CellToolbar.register_callback('nbval.edit_sanitizers', add_sanitizer_dialog_button, ['code']);
        nbval_preset.push('nbval.edit_sanitizers');

        CellToolbar.register_callback('nbval.compare_outputs', checkbox_test, ['code']);
        nbval_preset.push('nbval.compare_outputs');

        CellToolbar.register_preset('Nbval', nbval_preset);
        console.log('Extension for setting nbval cell metadata.');
    };
    return {'load_ipython_extension': load_ipython_extension};
});
