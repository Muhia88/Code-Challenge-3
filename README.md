# Content Central

A simple, single-page web application to manage blog posts. This project uses a local JSON server to demonstrate full Create, Read, Update, and Delete (CRUD) functionalities.

## Detailed Description

This application provides a modern interface for managing a blog. It interacts with a local API to persist data, ensuring that all changes (additions, updates, and deletions) are saved and available on page reload.

The project utilizes Tailwind CSS, imported via a CDN, for styling.

**Key Features:**

* **View All Posts:** On page load, all blog post titles are fetched from the server and displayed in a list.
* **View Post Details:** Clicking on a post title reveals its full content, author, date, and image.
* **Add New Posts:** A dedicated form allows for the creation of new blog posts, which are then saved to the database.
* **Edit Posts:** An "Edit" button enables inline updating of a post's title, content, and image URL.
* **Delete Posts:** Remove posts from the database with a single click.
* **Persistent Data:** All CRUD operations are sent to the local `json-server` backend, making all changes persistent.

## File Structure

* `src/index.js`
* `index.html`
* `style.css`
* `db.json`

## Project Setup

This project requires a simple local server to handle API requests. Follow these steps to get it running:

1.  **Download the files:**
    Clone or download this repository to your local machine.

2.  **Install `json-server`:**
    If you don't have it already, you'll need to install `json-server` globally using npm.
    ```bash
    npm install -g json-server
    ```

3.  **Start the API Server:**
    Navigate to the project's root directory in your terminal and run the following command to start the server. It will watch the `db.json` file for any changes.
    ```bash
    json-server --watch db.json
    ```
    Your API will now be running at `http://localhost:3000/posts`.

4.  **Open in Browser:**
    Open the `index.html` file in any modern web browser. You can do this by double-clicking the file or by using a tool like VS Code's Live Server. The application will now be fully functional and connected to your local server.

## Usage

Once the application is open in your browser, you can perform the following actions:

1.  **Viewing a Post:**
    * The list of post titles is displayed on the left.
    * Click any post title to view its full details on the right. The first post's details are shown by default.

2.  **Adding a Post:**
    * Fill out the "Add New Post" form fields (Title, Author, Image URL, and Content).
    * Click the **Add Post** button to save the new post. The list and details view will update automatically.

3.  **Managing a Post:**
    * **Edit Post:** In the post detail view, click the **Edit** button. The details will turn into an editable form. Make your changes and click **Save Changes**.
    * **Delete Post:** In the post detail view, click the **Delete** button. You will be asked to confirm the deletion.

## Author

* **Daniel Muhia**

## License

This project is licensed under the MIT License.

---

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.