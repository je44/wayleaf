import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../newtab.js", import.meta.url), "utf8");
const validationStart = source.indexOf("function safeUrl(value)");
const validationEnd = source.indexOf("\nfunction emptyState(message)", validationStart);

assert.notEqual(validationStart, -1, "Favorite URL validation helpers should remain directly testable.");
assert.notEqual(validationEnd, -1, "Favorite URL normalization should remain directly testable.");

const normalizePortalUrl = Function(
  "normalizeText",
  "MAX_PORTAL_URL_LENGTH",
  `${source.slice(validationStart, validationEnd)}\nreturn normalizePortalUrl;`
)(
  (value) => String(value || "").replace(/\s+/g, " ").trim(),
  512
);

for (const invalidValue of [
  "",
  "11",
  "https://11",
  "hello",
  "http://localhost",
  "127.1",
  "999.1.1.1",
  "example",
  "https://-example.com",
  "https://example-.com",
  "https://user:password@example.com"
]) {
  assert.equal(normalizePortalUrl(invalidValue), "", `${invalidValue || "Empty input"} must not be accepted as a website URL.`);
}

assert.equal(normalizePortalUrl("example.com"), "https://example.com/", "A valid bare domain should receive HTTPS.");
assert.equal(normalizePortalUrl("https://www.notion.so/product"), "https://www.notion.so/product", "A valid HTTPS URL should retain its path.");
assert.equal(normalizePortalUrl("192.168.1.1"), "https://192.168.1.1/", "A complete IPv4 address should remain supported.");
assert.equal(normalizePortalUrl("http://[::1]:8080/"), "http://[::1]:8080/", "A bracketed IPv6 URL should remain supported.");
assert.equal(normalizePortalUrl("例子.测试"), "https://xn--fsqu00a.xn--0zwm56d/", "An internationalized domain should remain supported.");

console.log("favorite URL validation fixtures passed");
