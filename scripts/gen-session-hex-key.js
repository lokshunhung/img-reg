// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const sodium = require("sodium-native");

const keyBuffer = Buffer.allocUnsafe(sodium.crypto_secretbox_KEYBYTES);
sodium.randombytes_buf(keyBuffer);

const keyHexString = keyBuffer.toString("hex");

if (process.argv.includes("--write")) {
    const keyPath = path.join(__dirname, "key");
    fs.writeFileSync(keyPath, keyHexString);
}

process.stdout.write(keyHexString);
