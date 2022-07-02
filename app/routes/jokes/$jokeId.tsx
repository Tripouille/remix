/** @format */

import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { Joke } from "@prisma/client";

type LoaderData = {
    joke: Joke;
};

/** @format */
export const loader: LoaderFunction = async ({ params }) => {
    const { jokeId } = params;
    const joke = await db.joke.findUnique({
        where: { id: jokeId },
    });
    const data = { joke };
    return json(data);
};

export default function JokeId() {
    const data = useLoaderData<LoaderData>();
    return <p>{data.joke.content}</p>;
}
