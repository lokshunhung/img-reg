import { describe, expect, test } from "@jest/globals";
import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";
import path from "path";

declare const global: any;
const BASE_URL = global.BASE_URL || "http://localhost:9000"; // TODO: spin up server before tests

describe("image", () => {
    test("upload-image", async () => {
        const cat = await fs.promises.readFile(path.join(__dirname, "cat.jpg"));
        const formData = new FormData();
        formData.append("image", cat, "cat.jpg");

        const url = BASE_URL + "/image";
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        expect(response.status).toBe(201);
        expect(await response.json()).toStrictEqual(
            expect.objectContaining({
                success: true,
                imageURL: expect.any(String),
            }),
        );
    });
});
