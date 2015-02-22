/**
 * Displays a form for the user to enter a Monster. Takes in the Monster and creates a new json file for it
 * on the server.
 */
var express = require('express');
var jf = require('jsonfile');
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var app = express();

var monsterForm = forms.create({
    username: fields.string({required: true}),
    password: fields.password({required: validators.required('You need a password.')}),
    confirm: fields.password({
        required: validators.required("Don't you know your password?"),
        validators: [validators.matchField('password')]
    }),
    email: fields.email()
});

app.get('/', function(req, res) {
    res.send(monsterForm.toHTML());
});

app.get('/monsters', function(req, res) {
    var condensedJSON = {
        "entries": []
    };

    var bestiaryJSON;
    var file = '../bestiaries/bestiary1.json';

    jf.readFile(file, function(err, bestiaryJSON) {
        console.log(err);

        function addMonster(element, index, array) {
            condensedJSON.entries.push({"name": element.name, "id": element.id});
        }

        bestiaryJSON.monsters.forEach(addMonster);

        // create HTML from the bestiary JSON
        var htmlGen = "<!DOCTYPE html><html><head></head><body><ul>";

        function addElement(element, index, array) {
            htmlGen += '<li><a href=' + element.name + '</li>';
        }

        condensedJSON.entries.forEach(addElement);

        htmlGen += "</ul></body></html>";

        // res.send(condensedJSON);
        res.send(htmlGen);
    });
});

app.get('monsters/:id', function(req, res) {

});

app.post('monsters/new', function(req, res) {

});

app.listen(3000);