import { useMemory } from "..";
import { setIntersection } from "./utils";

const MAX_RATIO_OF_SPAM_TO_HAM_WORDS = 0.15;
const MAX_NUMBER_OF_CURSE_WORDS = 10;

export const isMessageSpam = (
    content: string,
    tags?: string[],
    pollOptions?: { option: string, votes: number}[],
) => {

    const
        sTags = tags ? tags : [],
        sPollOps = pollOptions ? pollOptions : [],
        mappedOps = sPollOps.map(s => s.option),
        messageWords = new Set(
            [content, ...sTags, ...mappedOps]
                .flatMap((s) => s.split(" "))
                .map((s) => s.toLowerCase().replaceAll("#", "")),
        );

    const { spamWords } = useMemory();

    const usedBadWords = setIntersection(messageWords, spamWords);

    return usedBadWords.size / messageWords.size > MAX_RATIO_OF_SPAM_TO_HAM_WORDS
        || usedBadWords.size >= MAX_NUMBER_OF_CURSE_WORDS;
};
