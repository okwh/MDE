import {TextModel, LineModel, TextEdit, TextEditType, Position, PositionUtil, Range} from "../model"
import assert = require("assert");

// total 8 lines
const testText1 = 
`# Title

paragraph 1
something else

- first line
- second line
- third line`

const multilinesText =
`multilinesText
total 3 lines
last line.`

describe("TextModel", () => {

    let testLines1 = testText1.split("\n");
    assert.equal(testLines1.length, 8);

    describe("#Intialize", () => {
        let tm1 = new TextModel(testText1);

        assert(tm1.linesCount === 8);

        tm1.forEach((line: LineModel) => {
            let lineText : string = testLines1[line.number - 1];

            if (line.number != tm1.linesCount)
                lineText += "\n";
            assert(lineText == line.text, 
                "The line " + line.number + '"' + lineText + '" should equal to ' +
                '"' + line.text + '"');;
        });
    })

    describe("Testing Position & CharAt API", () => {
        let tm1 = new TextModel(testText1);

        for (let i = 0; i < testText1.length; i++) {
            assert.equal(tm1.charAt(tm1.positionAt(i)), testText1.charAt(i));
            assert.equal(tm1.offsetAt(tm1.positionAt(i)), i);
        }
    })

    describe("#Report", () => {
        let tm1 = new TextModel(testText1);
        let reportText = tm1.reportAll();
        assert(testText1 == reportText, 
        "Report all should equal to the source");

        let firstLine = tm1.report({
            begin: {
                line: 1,
                offset: 0,
            },
            end: {
                line: 1,
                offset: 7,
            },
        })
        assert(tm1.lineAt(1).text == firstLine + '\n');

        let thatLines = tm1.report({
            begin: {
                line: 1,
                offset: 0,
            },
            end: {
                line:3,
                offset: 1,
            }
        });
        // suppose to
        assert("# Title\n\np");
    })


    /// add text at the beginning of document
    /// add text at the random line of document
    /// add text at out of range and check the Error
    /// add text add the end of document
    describe("#Insert", () => {

        function insertTextToModel(model: TextModel, pos: Position, text: string) {
            model.applyTextEdit(new TextEdit(TextEditType.InsertText, pos, text));
        }

        // Insert at the beginning of document
        let tm1 = new TextModel(testText1);
        insertTextToModel(tm1, {line: 1, offset: 0}, "(insert)")
        assert(tm1.lineAt(1).text == "(insert)# Title\n");

        // Insert at the end of firstLine
        insertTextToModel(tm1, {line: 1, offset: 15}, "(insert)");
        assert(tm1.lineAt(1).text == "(insert)# Title(insert)\n");

        // check out of range error.
        tm1 = new TextModel(testText1);
        assert.throws(() => {
            insertTextToModel(tm1, {line: 0, offset: 0}, "(insert)");
        }, Error);

        assert.throws(() => {
            insertTextToModel(tm1, {line: tm1.linesCount + 1, offset: 0}, "insert");
        }, Error);

        assert.throws(() => {
            insertTextToModel(tm1, {line: 0, offset: tm1.lineAt(1).length}, "insert");
        }, Error);

        // insert linebreak
        tm1 = new TextModel(testText1);
        insertTextToModel(tm1, {line: 4, offset: 9}, "\n");
        assert(tm1.linesCount === 9);
        assert(tm1.lineAt(4).text == "something\n");
        assert(tm1.lineAt(5).text == " else\n");
        assert(tm1.lineAt(6).text == "\n");
        assert(tm1.lineAt(7).text == "- first line\n");
        assert(tm1.lineAt(8).text == "- second line\n");
        assert(tm1.lineAt(9).text == "- third line");

        tm1 = new TextModel(testText1);
        insertTextToModel(tm1, {line: 4, offset: 9}, multilinesText);
        assert(tm1.linesCount === 10);
        assert(tm1.lineAt(4).text == "somethingmultilinesText\n");
        assert(tm1.lineAt(5).text == "total 3 lines\n");
        assert(tm1.lineAt(6).text == "last line. else\n");

        // insert at the end of document
        tm1 = new TextModel(testText1);
        insertTextToModel(tm1, tm1.positionAt(testText1.length - 1), "(insert)");
        assert(/(insert)/.test(tm1.lineAt(tm1.linesCount).text));
    })

    describe("#Delete1", () => {
        function deleteText(model: TextModel, range: Range) {
            model.applyTextEdit(new TextEdit(TextEditType.DeleteText, range));
        }

        let tm1 = new TextModel(testText1);

        // delete word int first line
        deleteText(tm1, {
            begin: {line: 4, offset: 4}, 
            end: {line: 4, offset: 9}
        });

        assert(tm1.lineAt(4).text == "some else\n")
    })

    describe("#Delete2", () => {
        function deleteText(model: TextModel, range: Range) {
            model.applyTextEdit(new TextEdit(TextEditType.DeleteText, range));
        }

        let tm1 = new TextModel(testText1);

        deleteText(tm1, {
            begin: {line: 1, offset: 1},
            end: {line:4, offset: 4}
        });

        assert(tm1.lineAt(1).text == "#thing else\n", tm1.lineAt(1).text);
        assert(tm1.lineAt(2).text == "\n", tm1.lineAt(2).text);
        assert(tm1.lineAt(3).text == "- first line\n", tm1.lineAt(3).text);
    })

    describe("#Cancel", () => {
        console.log("cancellable insert");

        let tm1 = new TextModel(testText1);
        let result = tm1.applyRevocableTextEdit(
            new TextEdit(TextEditType.InsertText, {line: 1, offset: 0}, "(insert)"));
        assert.equal(tm1.lineAt(1).text, "(insert)# Title\n");
        assert.strictEqual(result.reverse.type, TextEditType.DeleteText, "reverse type error");
        assert(PositionUtil.equalPostion(result.reverse.range.begin, {line: 1, offset: 0}), "reverse range begin");
        assert(PositionUtil.equalPostion(result.reverse.range.end, result.pos), "reverse range end.");

        tm1.applyTextEdit(result.reverse);
        assert.equal(tm1.lineAt(1).text, "# Title\n", "reverse result error");

        console.log("cancellable multi-lines insert");

        tm1 = new TextModel(testText1);
        let inputText  = "(insert)\n(secondline)";
        result = tm1.applyRevocableTextEdit(new TextEdit(TextEditType.InsertText, {
            line: 1, offset: 0,
        }, inputText));
        assert.equal(tm1.lineAt(1).text, "(insert)\n");
        assert.equal(tm1.lineAt(2).text, "(secondline)# Title\n");
        assert.strictEqual(result.reverse.type, TextEditType.DeleteText, "reverse type error");

        tm1.applyTextEdit(result.reverse);
        assert.equal(tm1.lineAt(1).text, "# Title\n", "reverse result#1 error");
        assert.equal(tm1.lineAt(2).text, "\n", "reverse result#2 error");
    })

    describe("#Cancel2", () => {
        console.log("cancellable delete API...");

        let tm1 = new TextModel(testText1);

        let result = tm1.applyRevocableTextEdit(new TextEdit(TextEditType.DeleteText, {
            begin: {line: 1, offset: 2},
            end: {line: 1, offset: 3},
        }));
        assert.strictEqual(result.reverse.type, TextEditType.InsertText, "reverse type error");
        assert.equal(tm1.lineAt(1).text, "# itle\n");

        tm1.applyTextEdit(result.reverse);
        assert.equal(tm1.lineAt(1).text, "# Title\n", "reverse result#1 error.");

        console.log("cancellable delete multi-lines API...");

        tm1 = new TextModel(testText1);
        result = tm1.applyRevocableTextEdit(new TextEdit(TextEditType.DeleteText, {
            begin: {line: 1, offset: 2},
            end: {line: 3, offset: 1},
        }));

        assert.equal(tm1.lineAt(1).text, "# aragraph 1\n", "delete result error");
        assert.equal(tm1.lineAt(2).text, "something else\n");

        tm1.applyTextEdit(result.reverse);
        assert.equal(tm1.lineAt(1).text, "# Title\n", "reverse result#1 error.");
        assert.equal(tm1.lineAt(2).text, "\n", "reverse result#2 error.");
        assert.equal(tm1.lineAt(3).text, "paragraph 1\n", "reverse result#3 error.");
    })

    describe("#CancellableReplace", () => {
        let tm1 = new TextModel(testText1);
        let result = tm1.applyRevocableTextEdit(new TextEdit(TextEditType.ReplaceText, {
            begin: {line: 3, offset: 0},
            end:  {line: 4, offset: 1}
        }, "(replace)"));

        assert.strictEqual(result.reverse.type, TextEditType.ReplaceText, "replace API");
        assert.equal(tm1.lineAt(3).text, "(replace)omething else\n", "indeed replace error");

        tm1.applyTextEdit(result.reverse);
        assert.equal(tm1.lineAt(3).text, "paragraph 1\n");
        assert.equal(tm1.lineAt(4).text, "something else\n");
    })

});
