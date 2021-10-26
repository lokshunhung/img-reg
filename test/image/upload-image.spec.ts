import { describe, expect, jest, test } from "@jest/globals";
import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";
import path from "path";

jest.setTimeout(20_000);

declare const global: any;
const BASE_URL = global.BASE_URL || "http://localhost:9000"; // TODO: spin up server before tests

describe("image", () => {
    test("upload-image", async () => {
        const image = await fs.promises.readFile(path.join(__dirname, "cat.jpg"));
        const formData = new FormData();
        formData.append("image", image, "cat.jpg");
        formData.append("caption", "An image of a cat");
        for (const tag of ["cat", "meow"]) {
            formData.append("tags", tag);
        }

        const url = BASE_URL + "/image";
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        expect(await response.text()).toBeFalsy();
        expect(response.status).toBe(201);
        expect(await response.json()).toStrictEqual(
            expect.objectContaining({
                success: true,
                imageURL: expect.any(String),
            }),
        );
    });
});
