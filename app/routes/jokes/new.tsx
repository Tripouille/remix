/** @format */

export default function New() {
    return (
        <form>
            <p>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" id="name"></input>
            </p>
            <p>
                <label htmlFor="content">Content:</label>
                <textarea name="content" id="content"></textarea>
            </p>
            <button type="submit">Add</button>
        </form>
    );
}
