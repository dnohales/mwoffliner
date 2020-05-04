import './bootstrap.test';
import test from 'blue-tape';
import { Dump } from '../../src/Dump';

test('Dump formats', async (t) => {
    const formatTests = {
        '': '',
        ':extra_alias_tag': '_extra_alias_tag',
        'nopic:nopic_alias': '_nopic_alias',
        'nopic,nopdf': '_nopic',
        'nopic,nopdf:pdf_alias': '_pdf_alias',
        'nopic,:extra_alias': '_extra_alias',
        'nopic:': '',
        'nopic,novid:': '',
        'nopic,nodet' : '_nopic_nodet',
        'nodet,nopic' : '_nopic_nodet',
    };

    for (const [format, expectedFormatTags] of Object.entries(formatTests)) {
        const dump = new Dump(format, {} as any, { creator: '', webUrl: 'https://en.wikipedia.org', langIso2: '' } as any);

        const outFormat = dump.computeFilenameRadical(true, false, true);
        t.equal(outFormat, '_' + expectedFormatTags, `tag [${expectedFormatTags}] is correct`);
    }
});

test('Question Mark escape', async(t) => {
    const dump = new Dump('', {} as any, { creator: '', webUrl: 'https://en.wikipedia.org', langIso2: '' } as any);
    const escapeCharAtEnd = dump.getArticleBase('Que_faire_?');
    const escapeCharFromMiddle = dump.getArticleBase('Que_faire_?_(Lénine)');
    const noEscape =  dump.getArticleBase('Michael_Jackson');
    const noEscapeofOtherChar = dump.getArticleBase('Avanti!');

    t.equal(escapeCharAtEnd, 'Que_faire_%3F', 'Question mark escaped at end of title');
    t.equal(escapeCharFromMiddle, 'Que_faire_%3F_(Lénine)', 'Question mark escaped from the middle of title');
    t.equal(noEscape, 'Michael_Jackson', 'No escaping from regular string');
    t.equal(noEscapeofOtherChar, 'Avanti!', 'No escaping of character like !');
})