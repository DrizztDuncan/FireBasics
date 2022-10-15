//firebase states
console.log(firebase);

//firebase auth
const auth = firebase.auth();
//Grab HTML elements

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");
// Google Auth popup
const provider = new firebase.auth.GoogleAuthProvider();

// Sign in event handlers
signInBtn.addEventListener("click", () =>
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      console.log("result", result);
    })
    .catch(function (error) {
      console.error(error);
    })
);

signOutBtn.onclick = () => auth.signOut();
// Stream of changes
auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
  } else {
    // not signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = "";
  }
});
