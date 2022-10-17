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

///// Firestore /////

const db = firebase.firestore();

const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("thingsList");

let thingsRef; // Reference to a database location
let unsubscribe; // Turn off realtime stream

auth.onAuthStateChanged((user) => {
  if (user) {
    thingsRef = db.collection("things");

    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;

      // Creates a new document
      thingsRef.add({
        uid: user.uid, //User has-many things
        name: faker.commerce.productName(),
        createdAt: serverTimestamp(), //Date obj is not always consistent on every machine, so use Firebase Firestore field value.
      });
    };

    unsubscribe = thingsRef
      .where("uid", "==", user.uid) //Query

      .orderBy("createdAt") //compound Query

      //callback funtion that runs when data changes
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}</li>`;
        });

        thingsList.innerHTML = items.join("");
      });
  } else {
    unsubscribe && unsubscribe(); //unsubsribe when user not log in
  }
});
