console.log("IN SCRIPT!!")

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDnIObGDE6KUuj76kbo5waqcsVCNzhcsR8",
	authDomain: "seybold-story-graph.firebaseapp.com",
	databaseURL: "https://seybold-story-graph.firebaseio.com",
	projectId: "seybold-story-graph",
	storageBucket: "seybold-story-graph.appspot.com",
	messagingSenderId: "737650996710",
	appId: "1:737650996710:web:26d80b6d1531d60b325227",
	measurementId: "G-S0KBGERZTV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

/*
var provider = new firebase.auth.GoogleAuthProvider();
console.log("redirect");
firebase.auth().signInWithRedirect(provider).then(function(result) {
	// This gives you a Google Access Token. You can use it to access the Google API.
	var token = result.credential.accessToken;
	// The signed-in user info.
	var user = result.user;
	// ...
	console.log("logged in:");
	console.log(user);
}).catch(function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	// The email of the user's account used.
	var email = error.email;
	// The firebase.auth.AuthCredential type that was used.
	var credential = error.credential;
	// ...
});
*/


console.log("redirect_result");
firebase.auth().getRedirectResult().then(function(result) {
	if (result.credential) {
		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// ...
	}
	// The signed-in user info.
	var user = result.user;
	console.log("user:");
	console.log(user);
}).catch(function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	// The email of the user's account used.
	var email = error.email;
	// The firebase.auth.AuthCredential type that was used.
	var credential = error.credential;
	// ...
});
/*
// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDnIObGDE6KUuj76kbo5waqcsVCNzhcsR8",
	authDomain: "seybold-story-graph.firebaseapp.com",
	databaseURL: "https://seybold-story-graph.firebaseio.com",
	projectId: "seybold-story-graph",
	storageBucket: "seybold-story-graph.appspot.com",
	messagingSenderId: "737650996710",
	appId: "1:737650996710:web:26d80b6d1531d60b325227",
	measurementId: "G-S0KBGERZTV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// FirebaseUI config.
var uiConfig = {
	signInSuccessUrl: '<url-to-redirect-to-on-success>',
	signInOptions: [
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	],
// tosUrl and privacyPolicyUrl accept either url string or a callback
// function.
// Terms of service url/callback.
	tosUrl: '<your-tos-url>',
// Privacy policy url/callback.
	privacyPolicyUrl: function() {
		window.location.assign('<your-privacy-policy-url>');
	}
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
//if (ui.isPendingRedirect()) {
ui.start('#firebaseui-auth-container', uiConfig);
/}
*/
