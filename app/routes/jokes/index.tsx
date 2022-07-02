/** @format */

import { Link, Outlet } from "@remix-run/react";

export default function () {
    return (
        <div>
            <p>
                <Link to="new">Add a joke</Link>
            </p>
            <p>
                <Link to="random">Show a random joke</Link>
            </p>
            <Outlet />
        </div>
    );
}
