/** @format */

import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, Link, useSearchParams } from "@remix-run/react";

import { db } from "~/utils/db.server";
import stylesUrl from "~/styles/login.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: stylesUrl }];
};

function validateUsername(username: unknown) {
    if (typeof username !== "string" || username.length < 3) {
        return `Usernames must be at least 3 characters long`;
    }
}

function validatePassword(password: unknown) {
    if (typeof password !== "string" || password.length < 6) {
        return `Passwords must be at least 6 characters long`;
    }
}

function validateUrl(url: any) {
    console.log(url);
    let urls = ["/jokes", "/", "https://remix.run"];
    if (urls.includes(url)) {
        return url;
    }
    return "/jokes";
}

type ActionData = {
    formError?: string;
    fieldErrors?: {
        username: string | undefined;
        password: string | undefined;
    };
    fields?: {
        loginType: string;
        username: string;
        password: string;
    };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const loginType = form.get("loginType");
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = validateUrl(form.get("redirectTo") || "/jokes");
    if (
        typeof loginType !== "string" ||
        typeof username !== "string" ||
        typeof password !== "string" ||
        typeof redirectTo !== "string"
    ) {
        return badRequest({
            formError: `Form not submitted correctly.`,
        });
    }

    const fields = { loginType, username, password };
    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
    };
    if (Object.values(fieldErrors).some(Boolean))
        return badRequest({ fieldErrors, fields });

    switch (loginType) {
        case "login": {
            // login to get the user
            // if there's no user, return the fields and a formError
            // if there is a user, create their session and redirect to /jokes
            return badRequest({
                fields,
                formError: "Not implemented",
            });
        }
        case "register": {
            const userExists = await db.user.findFirst({
                where: { username },
            });
            if (userExists) {
                return badRequest({
                    fields,
                    formError: `User with username ${username} already exists`,
                });
            }
            // create the user
            // create their session and redirect to /jokes
            return badRequest({
                fields,
                formError: "Not implemented",
            });
        }
        default: {
            return badRequest({
                fields,
                formError: `Login type invalid`,
            });
        }
    }
};

export default function Login() {
    const actionData = useActionData<ActionData>();
    const [searchParams] = useSearchParams();
    return (
        <div className="container">
            <div className="content" data-light="">
                <h1>Login</h1>
                <form method="post">
                    <input
                        type="hidden"
                        name="redirectTo"
                        value={searchParams.get("redirectTo") ?? undefined}
                    />
                    <fieldset>
                        <legend className="sr-only">Login or Register?</legend>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="login"
                                defaultChecked={
                                    !actionData?.fields?.loginType ||
                                    actionData?.fields?.loginType === "login"
                                }
                            />{" "}
                            Login
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="register"
                                defaultChecked={
                                    actionData?.fields?.loginType === "register"
                                }
                            />{" "}
                            Register
                        </label>
                    </fieldset>
                    <div>
                        <label htmlFor="username-input">Username</label>
                        <input
                            type="text"
                            id="username-input"
                            name="username"
                            defaultValue={actionData?.fields?.username}
                            aria-invalid={Boolean(
                                actionData?.fieldErrors?.username
                            )}
                            aria-errormessage={
                                actionData?.fieldErrors?.username
                                    ? "username-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.username ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="username-error"
                            >
                                {actionData.fieldErrors.username}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password-input">Password</label>
                        <input
                            id="password-input"
                            name="password"
                            defaultValue={actionData?.fields?.password}
                            type="password"
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.password) ||
                                undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.password
                                    ? "password-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.password ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="password-error"
                            >
                                {actionData.fieldErrors.password}
                            </p>
                        ) : null}
                    </div>
                    <div id="form-error-message">
                        {actionData?.formError ? (
                            <p className="form-validation-error" role="alert">
                                {actionData.formError}
                            </p>
                        ) : null}
                    </div>
                    <button type="submit" className="button">
                        Submit
                    </button>
                </form>
            </div>
            <div className="links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/jokes">Jokes</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
