import * as assert from "assert";
import * as AudioSprite from "../src";

describe('audiosprite-loader', function() {
  it('should expose loader', function() {
    assert.ok(typeof (AudioSprite.loader()) === "string");
  });
  it('should instantiate AudioSprite', function() {
    assert.ok(new AudioSprite.Plugin());
  });
});
