document.addEventListener("DOMContentLoaded", () => {

  //intializing current blog post id
  const currentBlogPostID = null;
  //Element selection
  const postList = document.querySelector("#post-List");
  const postDetail = document.querySelector("#post-detail");
  const addNewBlog = document.querySelector("#add-blog-form");
  const postCount = document.querySelector("#postCount");
  const modal = document.querySelector("#modal");
  const modalMessage = document.querySelector("#modal-message");


  

  //displayPosts function
  //Fetches all posts and displays them 
const displayPosts = async() => {
    try{
      const response = await fetch("http://localhost:3000/posts");
      if(!response.ok) {
        throw new Error("There was an error in fetching blog posts");
      }
      const blogPosts = await response.json();

      postList.innerHTML = "";
      postCount.textContent = `${blogPosts.length} posts`;
      blogPosts.forEach(post => {
        const li = document.createElement("li");
        li.dataset.id = post.id;
        li.innerHTML = `
        <div id = "post-title">${post.title}</div>
        <div id = "post-author">${post.author}</div>
        `;
        li.addEventListener("click", handlePostClick(post.id));
        postList.appendChild(li);
      });

      if(currentBlogPostID && blogPosts.some(post => post.id == currentBlogPostID)){
          await handlePostClick(currentBlogPostID);
        }else if(blogPosts.length > 0){
          await handlePostClick(blogPosts[0].id);
        }else{
          postDetail.innerHTML = '<p class="text-gray-500">No posts available.</p>';
        }
    }catch (error){
      console.log("Error in displaying posts:", error);
      showErrorNotification(error.message);
    }
  }

  //handlePostClick function
  //Displays blog post details
  async function handlePostClick(id){

    try{
      //fetch specific blog post
      const response = await fetch(`http://localhost:3000/posts/${id}`);

      //checks if fetching of blog had an error
      if(!response.ok) {
          throw new Error("There was an Error in fetching blog post");
        }
      const blogPost = await response.json();

      //sets current blog post id to the clicked one
      currentBlogPostID = blogPost.id;

      //display post details
      postDetail.innerHTML = `
      <div class = "flex justify-between items-start mb-4">
        <div>
          <h2 class="text-xl font-extrabold text-gray-900">${blogPost.title}></h2>
          <p class="text-md text-gray-500 mt-1">By ${blogPost.author} &bull;${blogPost.date}</p>
        </div>
      </div>
      <img src="${blogPost.image} alt="${blogPost.title} class="w-full h-80 object-cover rounded-lg my-4">
      <div class="prose max-w-none text-gray-700">
        ${blogPost.content}
      </div>
      <div class="actions flex gap-2">  
        <button id="edit-btn" class="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2"><i class="fas fa-edit"></i>Edit</button>
        <button id="delete-btn" class="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2"><i class="fas fa-trash-alt"></i>Delete</button>
      </div>
      `;

      //adds event listeners to edit and delete buttons
      document.getElementById("edit-btn").addEventListener("click", () => editMode(blogPost));
      document.getElementById("delete-btn").addEventListener("click", () => deleteBlogPost(blogPost.id));

      //adds "selected" class if id clicked matches the one on the list
      for(const li of postList.children){
        li.classList.toggle("selscted", li.dataset.id === id);
      }
      
    }catch(error){
      console.log("Error in displaying details:", error);
      showErrorNotification(error.message);
    }
  }

  function editMode(blogPost){
    postDetail.innerHTML = `
    <form id="edit-details" class="space-y-4">
      <input type="text" name="title" value="${blogPost.title}" class="w-full text-xl font-extrabold text-gray-900 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
      <p class="text-md text-gray-500">By ${blogPost.author} &bull;${blogPost.date}</p>
      <input type="url" name="image" value="${blogPost.image}" class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
      <textarea name="content" rows="10" class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">${blogPost.content}</textarea>
      <div class="flex justify-start gap-2">
        <button type="submit" class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-md flex items-center"><i class="fas fa-save mr-2"></i>Save Changes</button>
        <button type="button" id="cancel-edit-details" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md flex items-center"><i class="fas fa-times mr-2"></i>Cancel</button>
      </div>
    </form>
    `;

    //adds event listeners to edit form
    document.getElementById("edit-details").addEventListener("submit",handleEditSubmit);
    document.getElementById("cancel-edit-details").addEventListener("click", () => handlePostClick(blogPost.id));
  }

  //handleEditSubmit function
  //handles submission of edit details form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const blogForm = e.target
    const updatedBlogPost = {
      title: blogForm.title.value,
      content: blogForm.content.value,
      image: blogForm.image.value
    }
    try{
      const response = fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedBlogPost)
      })
    }catch(error){
      console.log("Error in updating post:", error);
      showErrorNotification(error.message);
    }
  };

  //deleteBlogPost function
  //handles deleting of a blog post
  async function deleteBlogPost(id){
    if(confirm("Are you sure yo want to delete this post")){
      try{
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok){
          throw new Error("There was error in deleting post");
        }
        currentBlogPostID = null;
        await displayPosts();
      }catch(error){
        console.log("Error in deleting post:", error);
        showErrorNotification(error.message);
      }
    }
  }

  //addNewPostListener function
  //handles adding of a new blog post
  const addNewPostListener = async (e) => {
    //prevents reloading of screen
    e.preventDefault();

    //adds event listener to cancel button
    const cancelAddBlog = document.querySelector("#cancel-blog").addEventListener("click", async () => {
      //resets form
      addNewBlog.reset();
      //displays blog post titles and refreshes detail view
      await displayPosts();
      return;
    });
    
    //populates current data with name attribute from form(addNewBlog) into convenient key/value pairs  
    const dataInput = new FormData(addNewBlog);
    const newBlog = {
      title: dataInput.get("title"),
      author: dataInput.get("author"),
      image: dataInput.get("image"),
      content: dataInput.get("content"),
      date: new Date().toLocaleDateString()
    }

    try{
      //fetches blog posts
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newBlog)
      });
      //checks if error in fetching blog posts(mostly 400s, 500s)
      if(!response.ok){
        throw new Error("There was an error in creating post.");
      }

      //adds event listeners to addBlog and cancel buttons
    const addBlogButton = document.querySelector("#add-post-button").addEventListener("submit", async () =>{
      //resets form
      addNewBlog.reset();
      //displays blog post titles and refreshes detail view
      await displayPosts();
    });
    }catch(error){
      console.log("Error encountered in creating post:", error);
      showErrorNotification(error.message);
    }
  };

  //showErrorNotification() function
  function showErrorNotification(message){
    //set error message in html
    modalMessage.textContent = message;

    //show the message
    modal.classList.remove("hidden");

    //sets timer to hide message after 3 seconds
    setTimeout(() => {
      modal.classList.add("hidden");
    },3000);
  }


  const main = () => {
    //initial load
    displayPosts();
    addNewPostListener();
  }
})