// Callback for sign-in .OnClick.
function toggleSignIn() {
	if (!firebase.auth().currentUser) {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	} else {
		firebase.auth().signOut();
	}
}

// Callback for bar-toggle OnClick.
function toggleTopBar() {
	console.log("in toggle top bar");
	if (document.getElementById("sign-in").classList.contains("no-display")) {
		console.log("in toggle top bar - removing hidden");
		document.getElementById("sign-in").classList.remove("no-display");
		document.getElementById("save").classList.remove("no-display");
		document.getElementById("title").classList.remove("no-display");
		document.getElementById("header").classList.remove("collapse");
		document.getElementById("bar-toggle").classList.remove("collapse");
	} else {
		console.log("in toggle top bar - adding hidden");
		document.getElementById("save").classList.add("no-display");
		document.getElementById("sign-in").classList.add("no-display");
		document.getElementById("title").classList.add("no-display");
		document.getElementById("header").classList.add("collapse");
		document.getElementById("bar-toggle").classList.add("collapse");
	}
}

// Initializes the app.
// Handles auth redirect.
// Sets up event handlers.
function initApp() {
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

	// Would need to listen to firebase.auth().getRedirectResult() to handle additional
	// requests and errors.

	// Listening for auth state changes.
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			document.getElementById('sign-in').textContent = user.email + ": sign out ";
			var story = new Story(user.email);
			story.loadGraph();
			console.log(story.doc, story.nodes, story.links);
			document.getElementById('save').textContent = "save";
			document.getElementById('save').addEventListener('click',
				function(){story.saveGraph();}, false);
		} else {
			document.getElementById('sign-in').textContent = "sign in";
			document.getElementById('save').textContent = "sign-in to load graph";
			d3.select("#content").selectAll("*").remove();
			document.getElementById("editor").classList.add("no-display");
		}
	});

	// Listeners for top bar click events.
	document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
	document.getElementById('bar-toggle').addEventListener('click', toggleTopBar, false);
}

window.onload = function() {
	initApp();
};
