import { share } from "mem-box";
import { readJSON } from "../lib/utils";

export const configureSpamFilter = async () => {
    const
        badwordsObj = await readJSON("secrets/badwords.json"),
        badWordsPlObj = await readJSON("secrets/badwords_pl.json"),
        badwordsList = badwordsObj.badwords as string[],
        badwordsPlList = badWordsPlObj.badwords as string[];

    const spamWords = [...badwordsList, ...badwordsPlList].reduce((acc, el) => {
        acc.add(Buffer.from(el, "base64").toString());
        return acc;
    }, new Set<string>());


    share({ spamWords });
};

declare global {
    interface Ctx {
        spamWords: Set<string>;
    }
}
