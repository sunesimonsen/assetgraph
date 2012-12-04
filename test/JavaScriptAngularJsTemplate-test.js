var vows = require('vows'),
    assert = require('assert'),
    AssetGraph = require('../lib/AssetGraph');

vows.describe('relations.JavaScriptAngularJsTemplate').addBatch({
    'After loading a test case': {
        topic: function () {
            new AssetGraph({root: __dirname + '/JavaScriptAngularJsTemplate/'})
                .loadAssets('index.html')
                .populate()
                .run(this.callback);
        },
        'the graph should contain 1 Html asset': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'Html'}).length, 1);
        },
        'the graph should contain 2 JavaScript assets': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'JavaScript'}).length, 2);
        },
        'the graph should contain 4 JavaScriptAngularJsTemplate relations': function (assetGraph) {
            assert.equal(assetGraph.findRelations({type: 'JavaScriptAngularJsTemplate'}).length, 4);
        },
        'the graph should contain 6 AngularJsTemplate assets': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'AngularJsTemplate'}).length, 6);
        },
        'the graph should have an inline AngularJsTemplate with <img src="foo.png"> in its text': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'AngularJsTemplate', isInline: true, text: /<img src="foo.png">/}).length, 1);
        },
        'the graph should contain one JavaScriptAngularJsTemplateCacheAssignment relation': function (assetGraph) {
            assert.equal(assetGraph.findRelations({type: 'JavaScriptAngularJsTemplateCacheAssignment'}).length, 1);
        },
        'the graph should have an inline AngularJsTemplate with <h1>4: Template injected directly into <code>$templateCache</code></h1> in its text': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'AngularJsTemplate', isInline: true, text: "<h1>4: Template with a relation (<img src='bar.png'>) injected directly into <code>$templateCache</code></h1>"}).length, 1);
        },
        'the graph should have foo.png': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'Png', url: /\/foo\.png$/}).length, 1);
        },
        'the graph should have bar.png': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'Png', url: /\/bar\.png$/}).length, 1);
        },
        'then run the inlineAngularJsTemplates transform': {
            topic: function (assetGraph) {
                assetGraph.inlineAngularJsTemplates().run(this.callback);
            },
            'the graph should contain no JavaScriptAngularJsTemplateCacheAssignment relations': function (assetGraph) {
                assert.equal(assetGraph.findRelations({type: 'JavaScriptAngularJsTemplateCacheAssignment'}).length, 0);
            },
            'the graph should contain 4 HtmlInlineScriptTemplate relations': function (assetGraph) {
                assert.equal(assetGraph.findRelations({type: 'HtmlInlineScriptTemplate'}).length, 4);
            },
            'one of the HtmlInlineScriptTemplateRelations should have an id of "partials/1.html" and point at an AngularJsTemplate asset with the correct contents': function (assetGraph) {
                var relation = assetGraph.findRelations({type: 'HtmlInlineScriptTemplate', node: function (node) {return node.getAttribute('id') === 'partials/1.html';}})[0];
                assert.ok(relation);
                assert.equal(relation.to.text, '<h1>1: External template loaded asynchronously with <code>templateUrl: \'partials/1.html\'</code></h1>\n');
            },
            'one of the HtmlInlineScriptTemplateRelations should have an id of "partials/2.html" and point at an AngularJsTemplate asset with the correct contents': function (assetGraph) {
                var relation = assetGraph.findRelations({type: 'HtmlInlineScriptTemplate', node: function (node) {return node.getAttribute('id') === 'partials/2.html';}})[0];
                assert.ok(relation);
                assert.equal(relation.to.text, '\n    <h1>2: Template in a &lt;script type="text/ng-template"&gt;-tag</h1>\n  ');
            },
            'one of the HtmlInlineScriptTemplateRelations should have an id of "partials/4.html" and point at an AngularJsTemplate asset with the correct contents': function (assetGraph) {
                var relation = assetGraph.findRelations({type: 'HtmlInlineScriptTemplate', node: function (node) {return node.getAttribute('id') === 'partials/4.html';}})[0];
                assert.ok(relation);
                assert.equal(relation.to.text, '<h1>4: Template with a relation (<img src=\'bar.png\'>) injected directly into <code>$templateCache</code></h1>');
            }
        }
    }
})['export'](module);
