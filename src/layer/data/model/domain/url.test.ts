import { standardizeURL, _encode as encode } from './url';

describe('Unit: layer/data/model/url', () => {
  describe('standardizeURL', () => {
    it('primitive', () => {
      assert(typeof standardizeURL('') === 'string');
    });

    it('absolutization', () => {
      assert(standardizeURL('') === window.location.href);
    });

    it('default port removing', () => {
      assert(standardizeURL('//host:').endsWith('//host/'));
      assert(standardizeURL('//host:/').endsWith('//host/'));
      assert(standardizeURL('//host:80/').endsWith('//host/'));
      assert(standardizeURL('//[80:80::80]/').endsWith('//[80:80::80]/'));
      assert(standardizeURL('//[80:80::80]:/').endsWith('//[80:80::80]/'));
      assert(standardizeURL('//[80:80::80]:80/').endsWith('//[80:80::80]/'));
      assert(standardizeURL('//host/path:/').endsWith('//host/path:/'));
      assert(standardizeURL('//host/path:80/').endsWith('//host/path:80/'));
    });

    it('root path filling', () => {
      assert(standardizeURL('//host').endsWith('//host/'));
      assert(standardizeURL('//host:').endsWith('//host/'));
      assert(standardizeURL('//host:80').endsWith('//host/'));
      assert(standardizeURL('//[80:80::80]').endsWith('//[80:80::80]/'));
      assert(standardizeURL('//host/path').endsWith('//host/path'));
      assert(standardizeURL('//host?').endsWith('//host/?'));
      assert(standardizeURL('//host/?').endsWith('//host/?'));
      assert(standardizeURL('//host/path?').endsWith('//host/path?'));
      assert(standardizeURL('//host/path/?').endsWith('//host/path/?'));
    });

    it('percent-encoding', () => {
      assert(standardizeURL('?a=b+c&%%3f#/?=+&%%3f#').endsWith(`?a=b%2Bc&%25%3F#/?=+&%%3f#`));
    });

    it('multiple-encoding', () => {
      assert(standardizeURL(standardizeURL('/%%3f%3d') as string).endsWith('/%25%3F%3D'));
    });

  });

  describe('encode', () => {
    it('percent-encoding', () => {
      assert(encode('/<>') === `/%3C%3E`);
      assert(encode('/%3F%3D') === `/%3F%3D`);
      assert(encode('/<%3F%3D>') === `/%3C%3F%3D%3E`);
      assert(encode('/%%FF<%3F%3D>') === `/%25%FF%3C%3F%3D%3E`);
      assert(encode('/\uD800\uDC00') === `/${encodeURI('\uD800\uDC00')}`);
      assert(encode('/\uD800\uD800\uDC00\uDC00') === `/${encodeURI('\uD800\uDC00')}`);
      assert(encode('//[2001:db8::7]/') === `//[2001:db8::7]/`);
      assert(encode('?a=b+c&%%3f#/?=+&%%3f#') === `?a=b%2Bc&%25%3F#/?=+&%%3f#`);
    });

    it('multiple-encoding', () => {
      assert(encode(encode('/%%3f%3d') as string) === `/%25%3F%3D`);
    });

  });

});
