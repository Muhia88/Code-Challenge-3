document.addEventListener("DOMContentLoaded", () => {

  //intializing current blog post id
  let currentBlogPostID = null; 
  
  //Element selection
  const postList = document.querySelector("#post-list"); 
  const postDetail = document.querySelector("#post-detail");
  const addBlogForm = document.querySelector("#add-blog-form");
  const postCount = document.querySelector("#post-count"); 
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
        <div id = "post-title">${post.title} </div>
        <div id = "post-author">${post.author} </div>
        `;
        li.addEventListener("click", () => handlePostClick(post.id)); // Corrected event listener attachment
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
          <h2 class="text-xl font-extrabold text-gray-900">${blogPost.title}</h2>
          <p class="text-md text-gray-500 mt-1">By ${blogPost.author}   &bull;${blogPost.date}</p>
        </div>
      </div>
      <img src="${blogPost.image}" alt="${blogPost.title}" class="w-full h-80 object-cover rounded-lg my-4">
      <div class="prose max-w-none text-gray-700">
        ${blogPost.content}
      </div>
      <div class="actions flex gap-2">  
        <button id="edit-btn" class="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2">Edit</button>
        <button id="delete-btn" class="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-2">Delete</button>
      </div>
      `;
      //adds event listeners to edit and delete buttons
      document.getElementById("edit-btn").addEventListener("click", () => editMode(blogPost));
      document.getElementById("delete-btn").addEventListener("click", () => deleteBlogPost(blogPost.id));

      //adds "selected" class if id clicked matches the one on the list
      for(const li of postList.children){
        li.classList.toggle("selected", li.dataset.id == id);
      }
      
    }catch(error){
      console.log("Error in displaying details:", error);
      showErrorNotification(error.message);
    }
  }

  //editMode function
  //edits the details
  function editMode(blogPost){
    postDetail.innerHTML = `
    <form id="edit-details" class="space-y-4">
      <input type="text" name="title" value="${blogPost.title}" class="w-full text-xl font-extrabold text-gray-900 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
      <p class="text-md text-gray-500">By ${blogPost.author}   &bull;${blogPost.date}</p>
      <input type="url" name="image" value="${blogPost.image}" class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
      <textarea name="content" rows="10" class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">${blogPost.content}</textarea>
      <div class="flex justify-start gap-2">
        <button type="submit" class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-md flex items-center">Save Changes</button>
        <button type="button" id="cancel-edit-details" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md flex items-center">Cancel</button>
      </div>
    </form>
    `;

    document.getElementById("edit-details").addEventListener("submit", (e) => handleEditSubmit(e, blogPost.id));
    document.getElementById("cancel-edit-details").addEventListener("click", () => handlePostClick(blogPost.id));
  }

  //handleEditSubmit function
  //handles submission of edit details form
  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    const blogForm = e.target;
    const updatedBlogPost = {
      title: blogForm.title.value,
      content: blogForm.content.value,
      image: blogForm.image.value
    };
    try{
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedBlogPost)
      });
      if (!response.ok) {
        throw new Error('Failed to update post.');
      }
       // Refresh the view
      await handlePostClick(id);

      //Find the post in the list and update its title 
      const postListItem = postList.querySelector(`li[data-id='${id}']`);
      if (postListItem) {
          const postTitleElement = postListItem.querySelector("#post-title");
          if(postTitleElement) {
            postTitleElement.textContent = updatedBlogPost.title;
          }
      }
    }catch(error){
      console.log("Error in updating post:", error);
      showErrorNotification(error.message);
    }
  };

  //deleteBlogPost function
  //handles deleting of a blog post
  async function deleteBlogPost(id){
    if(confirm("Are you sure you want to delete this post")){
      try{
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
          method: 'DELETE'
        });
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

  // Handles adding of a new blog post
  const handleAddNewPost = async (e) => {
    e.preventDefault();
    
    const dataInput = new FormData(addBlogForm);
    const newBlog = {
      title: dataInput.get("title"),
      author: dataInput.get("author"),
      image: dataInput.get("image"),
      content: dataInput.get("content"),
      date: new Date().toLocaleDateString()
    };

    try{
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newBlog)
      });

      if(!response.ok){
        throw new Error("There was an error in creating post.");
      }
      
      addBlogForm.reset();
      await displayPosts();

    }catch(error){
      console.log("Error encountered in creating post:", error);
      showErrorNotification(error.message);
    }
  };

  function showErrorNotification(message){
    modalMessage.textContent = message;
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.add("hidden");
    },3000);
  }

  // Main function to initialize the application
  const main = () => {
    displayPosts();
    addBlogForm.addEventListener("submit", handleAddNewPost);
    const cancelAddBlog = document.querySelector("#cancel-blog");
    cancelAddBlog.addEventListener("click", () => {
        addBlogForm.reset();
    })
  };

  // Start the application
  main();
});