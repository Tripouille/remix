/** @format */

import { Outlet } from "@remix-run/react";

export default function Jokes() {
    return (
        <>
            <p>Here's a random joke:</p>
            <Outlet />
        </>
    );
}
