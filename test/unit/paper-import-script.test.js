/* eslint-env jest */
import {createPaperImportScript} from '../../src/helper/paper-import-script';

describe('createPaperImportScript', () => {
    test('embeds the Paper.js source as a JSON-escaped literal', () => {
        const fakePaperSource = 'var paper = {setup: function(){}, project: {}};';
        const script = createPaperImportScript(fakePaperSource);
        expect(script).toContain(JSON.stringify(fakePaperSource));
    });

    test('JSON-escapes special characters in Paper.js source', () => {
        const sourceWithSpecialChars = 'var x = "hello\\nworld"; // comment with </script>';
        const script = createPaperImportScript(sourceWithSpecialChars);
        expect(script).toContain(JSON.stringify(sourceWithSpecialChars));
        expect(script).toMatch(/^\(function \(\) \{/);
        expect(script).toMatch(/\}\)\(\);$/);
    });
});
