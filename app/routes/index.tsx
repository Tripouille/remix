/** @format */

import { Link } from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";

import styles from "../styles/index.css";

export const links: LinksFunction = () => {
    return [
        {
            rel: "stylesheet",
            href: styles,
        },
    ];
};

export default function Index() {
    return (
        <div>
            <Link to="/jokes">Visit jokes</Link>
        </div>
    );
}
