import {Simplification} from '../types/simplification';
export const MOCKSIMPLIFICATION: Simplification[] = [
    {
        name: "Abraham Lincoln",
        original_text: "This is the original text of the passage. \n You can expect a length of around 1000 characters for original text. ",
        simplified_text: "This is a simplified version of the passage",
        reading_level: 4
    },
    {
        name: "Amelia Lockhart",
        original_text: "Amelia Earhart, fondly known as 'Lady Lindy,' was an American aviator who mysteriously disappeared in 1937 while trying to circumnavigate the globe from the equator. Earhart was the 16th woman to be issued a pilot's license. She had several notable flights, including becoming the first woman to fly across the Atlantic Ocean in 1928, as well as the first person to fly over both the Atlantic and Pacific. Earhart was legally declared dead in 1939.",
        simplified_text: "Amelia Mary Earhart was an American aviation pioneer and author.",
        reading_level: 5
    }
];